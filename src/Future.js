var curry = require('ramda/src/curry');
var forEach = require('ramda/src/forEach');
var once = require('ramda/src/once');
var toString = require('ramda/src/toString');

function jail(handler, f){
  return function(a){
    try{
      return f(a);
    } catch(err) {
      handler(err);
    }
  };
}

// `f` is a function that takes two function arguments: `reject` (failure) and `resolve` (success)
function Future(f) {
  if (!(this instanceof Future)) {
    return new Future(f);
  }
  this._fork = f;
}

Future.prototype.fork = function(reject, resolve) {
  this._fork(reject, jail(reject, resolve));
};

// functor
Future.prototype.map = function(f) {
  return this.chain(function(a) { return Future.of(f(a)); });
};

// apply
Future.prototype.ap = function(m) {
  var self = this;

  return new Future(function(rej, res) {
    var applyFn, val;
    var doReject = once(rej);

    var resolveIfDone = jail(doReject, function() {
      if (applyFn != null && val != null) {
        return res(applyFn(val));
      }
    });

    self._fork(doReject, function(fn) {
      applyFn = fn;
      resolveIfDone();
    });

    m._fork(doReject, function(v) {
      val = v;
      resolveIfDone();
    });

  });

};

// applicative
Future.of = function(x) {
  // should include a default rejection?
  return new Future(function(_, resolve) { return resolve(x); });
};

Future.prototype.of = Future.of;

// chain
//  f must be a function which returns a value
//  f must return a value of the same Chain
//  chain must return a value of the same Chain
//:: Future a, b => (b -> Future c) -> Future c
Future.prototype.chain = function(f) {  // Sorella's:
  return new Future(function(reject, resolve) {
    return this._fork(
      function(a) { return reject(a); },
      jail(reject, function(b) { return f(b)._fork(reject, resolve); })
    );
  }.bind(this));
};

// chainReject
// Like chain but operates on the reject instead of the resolve case.
//:: Future a, b => (a -> Future c) -> Future c
Future.prototype.chainReject = function(f) {
  return new Future(function(reject, resolve) {
    return this._fork(
      jail(reject, function(a) { return f(a)._fork(reject, resolve); }),
      function(b) { return resolve(b); }
    );
  }.bind(this));
};

// monad
// A value that implements the Monad specification must also implement the Applicative and Chain specifications.
// see above.

Future.prototype.bimap = function(errFn, successFn) {
  var self = this;
  return new Future(function(reject, resolve) {
    self._fork(
      jail(reject, function(err) { reject(errFn(err)); }),
      jail(reject, function(val) { resolve(successFn(val)); })
    );
  });
};

Future.reject = function(val) {
  return new Future(function(reject) {
    reject(val);
  });
};

Future.prototype.toString = function() {
  return 'Future(' + toString(this._fork) + ')';
};

Future.cache = function(f) {
  var status = 'IDLE';
  var listeners = [];
  var cachedValue;

  var handleCompletion = curry(function(newStatus, cb, val) {
    status = newStatus;
    cachedValue = val;
    cb(val);
    forEach(function(listener) {
      listener[status](cachedValue);
    }, listeners);
  });

  function addListeners(reject, resolve) {
    listeners.push({ REJECTED: reject, RESOLVED: resolve } );
  }

  function doResolve(reject, resolve) {
    status = 'PENDING';
    return f._fork(
      handleCompletion('REJECTED', reject),
      handleCompletion('RESOLVED', resolve)
    );
  }

  return new Future(function(reject, resolve) {

    switch(status) {
      case 'IDLE': doResolve(reject, resolve); break;
      case 'PENDING': addListeners(reject, resolve); break;
      case 'REJECTED': reject(cachedValue); break;
      case 'RESOLVED': resolve(cachedValue); break;
    }

  });
};

module.exports = Future;
