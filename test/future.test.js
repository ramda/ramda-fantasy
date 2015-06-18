var R = require('ramda');
var assert = require('assert');
var types = require('./types');
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

});

