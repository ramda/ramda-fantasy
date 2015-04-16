var R = require('ramda');
module.exports = Future;

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
    };

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
Future.prototype.chain = function(f) {  // Sorella's:
    return new Future(function(reject, resolve) {
        return this.fork(function(a) { return reject(a); },
                         function(b) { return f(b).fork(reject, resolve); });
    }.bind(this));
};

// monad
// A value that implements the Monad specification must also implement the Applicative and Chain specifications.
// see above.

Future.reject = function(val) {
    return new Future(function(reject, _) {
        reject(val);
    });
};
