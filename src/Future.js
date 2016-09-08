var once = require('ramda/src/once');
var forEach = require('ramda/src/forEach');
var toString = require('ramda/src/toString');
var curry = require('ramda/src/curry');

var util = require('./internal/util');

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

Future.prototype['@@type'] = 'ramda-fantasy/Future';

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

var chainRecFork = function(t, rej, res) {
  var isSync = false;
  t.fork(function(v) {
    var r = rej(v, !isSync);
    isSync = true;
    return r;
  }, function(v) {
    var r = res(v, !isSync);
    isSync = true;
    return r;
  });
  if (isSync) {
    return { isSync: true };
  } else {
    isSync = true;
    return { isSync: false };
  }
};

// chainRec
Future.chainRec = Future.prototype.chainRec = function(f, i) {
  return new Future(function(reject, resolve) {
    chainRecFork(
      f(util.chainRecNext, util.chainRecDone, i),
      function(z/*, isSync*/) {
        return reject(z);
      },
      function(step, isSync) {
        return util.chainRecFold(
          step,
          function(v) {
            if (isSync === false) {
              Future.chainRec(f, v).fork(reject, resolve);
              return;
            }
            var state = { loop: true, arg: v };
            var onReject = function(z/*, isSync*/) {
              state.loop = false;
              reject(z);
            };
            var onResolve = function(step, isSync) {
              return util.chainRecFold(
                step,
                function(v2) {
                  state = { loop: isSync, arg: v2 };
                  if (isSync === false) {
                    Future.chainRec(f, v2).fork(reject, resolve);
                  }
                },
                function(v) {
                  state = { loop: false};
                  resolve(v);
                }
              );
            };
            while (state.loop) {
              var forkRes = chainRecFork(
                f(util.chainRecNext, util.chainRecDone, state.arg),
                onReject,
                onResolve
              );
              if (forkRes.isSync === false) {
                state = { loop: false};
              }
            }
          },
          resolve
        );
      }
    );
  });
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
