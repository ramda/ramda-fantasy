var R = require('ramda');
var assert = require('assert');
var types = require('./types');
var Future = require('../src/Future');

Future.prototype.equals = function(b) {
  var isEqual;
  this.fork(function(e1) {
    b.fork(function(e2) {
      assert.equal(v1, v2);
    }, function() {
      assert.fail(null, e1, 'Futures not equal: f1 failed, f2 did not', '===');
    })
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
      }
      var result = Future.of(1).chain(incInTheFuture);
      assert.equal(true, Future.of(2).equals(result));
    });

});
