var R = require('ramda');

// `f` is a function that takes two function arguments: `reject` (failure) and `resolve` (success)
function Future(f) {
  if (!(this instanceof Future)) {
    return new Future(f);
  }
  this.fork = f;
}

// functor
Future.prototype.map = function(f) {
  return this.chain(function(a) { return Future.of(f(a)); });
};

// apply
Future.prototype.ap = function(m) {
  var self = this;

  return new Future(function(rej, res) {
    var applyFn, val;
    var doReject = R.once(rej);

    function resolveIfDone() {
      if (applyFn != null && val != null) {
        return res(applyFn(val));
      }
    }

    self.fork(doReject, function(fn) {
      applyFn = fn;
      resolveIfDone();
    });

    m.fork(doReject, function(v) {
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
    return this.fork(function(a) { return reject(a); },
                     function(b) { return f(b).fork(reject, resolve); });
  }.bind(this));
};

// chainReject
// Like chain but operates on the reject instead of the resolve case.
//:: Future a, b => (a -> Future c) -> Future c
Future.prototype.chainReject = function(f) {
  return new Future(function(reject, resolve) {
    return this.fork(function(a) { return f(a).fork(reject, resolve); },
                     function(b) { return resolve(b);
    });
  }.bind(this));
};

// monad
// A value that implements the Monad specification must also implement the Applicative and Chain specifications.
// see above.

Future.prototype.bimap = function(errFn, successFn) {
  var self = this;
  return new Future(function(reject, resolve) {
    self.fork(function(err) {
      reject(errFn(err));
    }, function(val) {
      resolve(successFn(val));
    });
  });
};

Future.reject = function(val) {
  return new Future(function(reject) {
    reject(val);
  });
};

Future.prototype.toString = function() {
  return 'Future(' + R.toString(this.fork) + ')';
};

module.exports = Future;
