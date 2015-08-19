var R = require('ramda');
var assert = require('assert');
var equalsInvoker = require('./utils').equalsInvoker;
var types = require('./types')(equalsInvoker);
var Future = require('../src/Future');

Future.prototype.equals = function(b) {
  this.fork(function(e1) {
    b.fork(function(e2) {
      assert.equal(e1, e2);
    }, function() {
      assert.fail(null, e1, 'Futures not equal: f1 failed, f2 did not', '===');
    });
  }, function(v1) {
    b.fork(function() {
      assert.fail(null, v1, 'Futures not equal: f1 succeeded, f2 did not', '===');
    }, function(v2) {
      assert.equal(v1, v2);
    });
  });
  return true;
};

describe('Future', function() {

  it('should equal another future', function() {
    var f1 = Future.of(2);
    var f2 = Future.of(2);
    assert.equal(true, f1.equals(f2));
  });

  it('is a Functor', function() {
    var fTest = types.functor;
    var f = Future.of(2);
    assert.equal(true, fTest.iface(f));
    assert.equal(true, fTest.id(f));
    assert.equal(true, fTest.compose(f, R.multiply(2), R.add(3)));
  });

  it('is an Apply', function() {
    var aTest = types.apply;
    var appA = Future.of(R.multiply(10));
    var appU = Future.of(R.add(5));
    var appV = Future.of(10);
    assert.equal(true, aTest.iface(appA));
    assert.equal(true, aTest.compose(appA, appU, appV));
  });

  it('is an Applicative', function() {
    var aTest = types.applicative;
    var app1 = Future.of(101);
    var app2 = Future.of(-123);
    var appF = Future.of(R.multiply(3));

    assert.equal(true, aTest.iface(app1));
    assert.equal(true, aTest.id(app1, app2));
    assert.equal(true, aTest.homomorphic(app1, R.add(3), 46));
    assert.equal(true, aTest.interchange(app1, appF, 17));
  });

  it('is a Chain', function() {
    var cTest = types.chain;
    var f = Future.of(2);
    var f1 = function(x) {return Future.of((3 * x));};
    var f2 = function(x) {return Future.of((5 + x));};

    assert.equal(true, cTest.iface(f));
    assert.equal(true, cTest.associative(f, f1, f2));
  });

  it('is a Monad', function() {
    var mTest = types.monad;
    var f = Future.of(null);
    assert.equal(true, mTest.iface(f));
  });

  it('.map should work according to the functor specification', function() {
    var result = Future.of(1).map(R.inc);
    assert.equal(true, Future.of(2).equals(result));
  });

  it('.chain should work according to the chainable specification', function() {
    var incInTheFuture = function(val) {
      return Future.of(R.inc(val));
    };
    var result = Future.of(1).chain(incInTheFuture);
    assert.equal(true, Future.of(2).equals(result));
  });

  describe('chainReject', function() {
    it('.chainReject should work like chain but off reject case', function() {
      var f1 = Future.reject(2);
      var f2 = function(val){ return Future.of(val + 3);};
      assert.equal(true, Future.of(5).equals(f1.chainReject(f2)));
    });
  });

  describe('#ap', function() {
    /*jshint browser:true */
    var add = R.add;
    function delayError(delay, err) {
      /*jshint unused:false */
      return new Future(function(reject, resolve) {
        setTimeout(reject, delay, err);
      });
    }

    function delayValue(delay, value) {
      return new Future(function(reject, resolve) {
        setTimeout(resolve, delay, value);
      });
    }

    function assertCbVal(done, expectedVal) {
      return function(val) {
        assert.equal(expectedVal, val);
        done();
      };
    }

    it('applies its function to the passed in future', function() {
      var f1 = Future.of(add(1));
      var result = f1.ap(Future.of(2));
      assert.equal(true, Future.of(3).equals(result));
    });

    it('does the apply in parallel', function(done) {
      this.timeout(25);
      var f1 = delayValue(15, 1);
      var f2 = delayValue(15, 2);
      f1.map(add).ap(f2).fork(null, assertCbVal(done, 3));
    });

    it('can handle itself being resolved first', function(done) {
      var f1 = delayValue(1, 1);
      var f2 = delayValue(15, 2);
      f1.map(add).ap(f2).fork(null, assertCbVal(done, 3));
    });

    it('can handle the input future being resolved first', function(done) {
      var f1 = delayValue(15, 1);
      var f2 = delayValue(1, 2);
      f1.map(add).ap(f2).fork(null, assertCbVal(done, 3));
    });

    it('is rejected with the first error to occur - case 1', function(done) {
      var f1 = delayError(10, 'firstError');
      var f2 = delayError(20, 'secondError');
      f1.map(add).ap(f2).fork(assertCbVal(done, 'firstError'));
    });

    it('is rejected with the first error to occur - case 2', function(done) {
      var f1 = delayError(20, 'firstError');
      var f2 = delayError(10, 'secondError');
      f1.map(add).ap(f2).fork(assertCbVal(done, 'secondError'));
    });

  });

  describe('reject', function() {

    it('creates a rejected future with the given value', function() {
      var f = Future.reject('foo');
      var forked;
      f.fork(function(err) {
        forked = true;
        assert.equal('foo', err);
      });
      assert.equal(true, forked);
    });

  });

  describe('#bimap', function() {

    it('maps the first function over the rejected value', function() {
      var f = Future.reject('err');
      var result = f.bimap(R.concat('map over '));
      result.fork(function(e) {
        assert.equal(e, 'map over err');
      });
    });

    it('maps the second function over the resolved value', function() {
      var f = Future.of(1);
      var result = f.bimap(null, R.add(1));
      result.fork(null, function(v) {
        assert.equal(v, 2);
      });
    });

  });

  describe('#toString', function() {

    it('returns the string representation of a Future', function() {
      assert.strictEqual(
        Future(function(reject, resolve) { void resolve; }).toString(),
        'Future(function (reject, resolve) { void resolve; })'
      );
    });

  });

  describe('#fork', function() {

    var result;
    var futureOne = Future.of(1);
    var throwError = function() {
      throw new Error('Some error message');
    };
    var setErrorResult = function(e) {
      result = e.message;
    };

    beforeEach(function() {
      result = null;
    });

    it('creates a rejected future if the resolve function throws an error', function() {
      futureOne.fork(setErrorResult, throwError);
      assert.equal('Some error message', result);
    });

    it('rejects the future if an error is thrown in a map function', function() {
      futureOne.map(throwError).fork(setErrorResult);
      assert.equal('Some error message', result);
    });

    it('rejects the future if an error is thrown in a chain function', function() {
      futureOne.chain(throwError).fork(setErrorResult);
      assert.equal('Some error message', result);
    });

    it('rejects the future if an error is thrown in a ap function', function() {
      Future.of(throwError).ap(futureOne).fork(setErrorResult);
      assert.equal('Some error message', result);
    });

  });

  describe('#cache', function() {
    var cached;
    var throwIfCalledTwice;

    beforeEach(function() {
      throwIfCalledTwice = (function() {
        var count = 0;
        return function(val) {
          if (++count > 1) {
            throw new Error('Was called twice');
          }
          return val;
        };
      }());
    });

    describe('resolve cases', function() {

      beforeEach(function() {
        cached = Future.cache(Future.of(1).map(throwIfCalledTwice));
      });

      it('can be forked with a resolved value', function(done) {
        cached.fork(done, function(v) {
          assert.equal(1, v);
          done();
        });
      });

      it('passes on the same value to the cached future', function(done) {
        cached.fork(done, function() {
          cached.fork(done, function(v) {
            assert.equal(1, v);
            done();
          });
        });
      });

    });

    describe('reject cases', function() {

      var throwError = function() {
        throw new Error('SomeError');
      };

      beforeEach(function() {
        cached = Future.cache(Future.of(1).map(throwIfCalledTwice).map(throwError));
      });

      it('can be forked with a rejected value', function() {
        var result;
        cached.fork(function(err) {
          result = err.message;
        });
        assert.equal('SomeError', result);
      });

      it('does not call the underlying fork twice', function() {
        var result;
        cached.fork(function() {
          cached.fork(function(err) {
            result = err.message;
          });
        });
        assert.equal('SomeError', result);
      });

    });

    describe('pending cases', function() {

      it('calls all fork resolve functions when the cached future is resolved', function(done) {
        var delayed = new Future(function(reject, resolve) {
          setTimeout(resolve, 5, 'resolvedValue');
        });
        var cached = Future.cache(delayed.map(throwIfCalledTwice));
        var result1;
        var result2;
        function assertBoth() {
          if (result1 !== undefined && result2 !== undefined) {
            assert.equal('resolvedValue', result1);
            assert.equal('resolvedValue', result2);
            done();
          }
        }
        cached.fork(done, function(v) {
          result1 = v;
          assertBoth();
        });
        cached.fork(done, function(v) {
          result2 = v;
          assertBoth();
        });
      });

      it('calls all fork reject fnctions when the cached future is rejected', function(done) {
        var delayed = new Future(function(reject) {
          setTimeout(reject, 5, 'rejectedValue');
        });
        var cached = Future.cache(delayed.bimap(throwIfCalledTwice, R.identity));
        var result1;
        var result2;
        function assertBoth() {
          if (result1 !== undefined && result2 !== undefined) {
            assert.equal('rejectedValue', result1);
            assert.equal('rejectedValue', result2);
            done();
          }
        }
        cached.fork(function(e) {
          result1 = e;
          assertBoth();
        });
        cached.fork(function(e) {
          result2 = e;
          assertBoth();
        });

      });

    });

  });

});

