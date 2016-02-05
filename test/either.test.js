var R = require('ramda');
var assert = require('assert');
var jsv = require('jsverify');
var types = require('./types')(R.equals);

var Either = require('..').Either;

var leftArb = function(arb) {
  return arb.smap(Either.Left, R.prop('value'), R.toString);
};
var rightArb = function(arb) {
  return arb.smap(Either.Right, R.prop('value'), R.toString);
};
var eitherArb = function(arb) {
  return jsv.oneof([leftArb(arb), rightArb(arb)]);
};

var eNatArb = eitherArb(jsv.nat);
var eFnArb = eitherArb(jsv.fn(jsv.nat));
var fnNatArb = jsv.fn(jsv.nat);

describe('Either', function() {

  it('is a Functor', function() {
    var fTest = types.functor;
    jsv.assert(jsv.forall(eNatArb, fTest.iface));
    jsv.assert(jsv.forall(eNatArb, fTest.id));
    jsv.assert(jsv.forall(eNatArb, fnNatArb, fnNatArb, fTest.compose));
  });

  it('is an Apply', function() {
    var aTest = types.apply;
    var rNatArb = rightArb(jsv.nat);
    var rFnArb = rightArb(jsv.fn(jsv.nat));
    jsv.assert(jsv.forall(rFnArb, rFnArb, rNatArb, aTest.compose));
    jsv.assert(jsv.forall(eNatArb, aTest.iface));
  });

  it('is an Applicative', function() {
    var aTest = types.applicative;
    jsv.assert(jsv.forall(eNatArb, aTest.iface));
    jsv.assert(jsv.forall(eNatArb, eNatArb, aTest.id));
    jsv.assert(jsv.forall(eNatArb, fnNatArb, jsv.nat, aTest.homomorphic));
    jsv.assert(jsv.forall(eNatArb, eFnArb, jsv.nat, aTest.interchange));
  });

  it('is a Chain', function() {
    var cTest = types.chain;
    var fnEArb = jsv.fn(eNatArb);
    jsv.assert(jsv.forall(eNatArb, cTest.iface));
    jsv.assert(jsv.forall(eNatArb, fnEArb, fnEArb, cTest.associative));
  });

  it('is a Monad', function() {
    jsv.assert(jsv.forall(eNatArb, types.monad.iface));
  });

  it('is an Extend', function() {
    var eTest = types.extend;
    jsv.assert(jsv.forall(eNatArb, eTest.iface));
    jsv.assert(jsv.forall(eNatArb, fnNatArb, fnNatArb, eTest.associative));
  });

  describe('checking for Left | Right', function() {
    it('should allow the user to check if the instance is a Left', function() {
      jsv.assert(jsv.forall(leftArb(jsv.nat), rightArb(jsv.nat), function(l, r) {
        return l.isLeft === true && r.isLeft === false;
      }));
    });

    it('should allow the user to check if the instance is a Right', function() {
      jsv.assert(jsv.forall(leftArb(jsv.nat), rightArb(jsv.nat), function(l, r) {
        return l.isRight === false && r.isRight === true;
      }));
    });

    it('can check the type statically', function() {
      jsv.assert(jsv.forall(leftArb(jsv.nat), rightArb(jsv.nat), function(l, r) {
        return Either.isRight(l) === false && Either.isRight(r) === true &&
               Either.isLeft(l) === true && Either.isLeft(r) === false;
      }));
    });
  });

  describe('#bimap', function() {

    it('maps the first function over the left value', function() {
      jsv.assert(jsv.forall(leftArb(jsv.nat), fnNatArb, fnNatArb, function(e, f, g) {
        return e.bimap(f, g).value === f(e.value);
      }));
    });

    it('maps the second function over the right value', function() {
      jsv.assert(jsv.forall(rightArb(jsv.nat), fnNatArb, fnNatArb, function(e, f, g) {
        return e.bimap(f, g).value === g(e.value);
      }));
    });

  });

  describe('.either', function() {
    it('returns the value of a Left after applying the first function arg', function() {
      jsv.assert(jsv.forall(leftArb(jsv.nat), fnNatArb, fnNatArb, function(e, f, g) {
        return Either.either(f, g, e) === f(e.value);
      }));
    });

    it('returns the value of a Right after applying the second function arg', function() {
      jsv.assert(jsv.forall(rightArb(jsv.nat), fnNatArb, fnNatArb, function(e, f, g) {
        return Either.either(f, g, e) === g(e.value);
      }));
    });
  });

  describe('#toString', function() {

    it('returns the string representation of a Left', function() {
      assert.strictEqual(Either.Left('Cannot divide by zero').toString(),
                         'Either.Left("Cannot divide by zero")');
    });

    it('returns the string representation of a Right', function() {
      assert.strictEqual(Either.Right([1, 2, 3]).toString(),
                         'Either.Right([1, 2, 3])');
    });

  });

});
