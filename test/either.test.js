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
    jsv.assert(jsv.forall(eFnArb, eFnArb, eNatArb, aTest.compose));
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

  describe('ChainRec', function() {
    it('is a ChainRec', function() {
      var cTest = types.chainRec;
      var predicate = function(a) {
        return a.length > 5;
      };
      var done = Either.of;
      var x = 1;
      var initial = [x];
      var next = function(a) {
        return Either.of(a.concat([x]));
      };
      assert.equal(true, cTest.iface(Either.of(1)));
      assert.equal(true, cTest.equivalence(Either, predicate, done, next, initial));
    });

    it('is stacksafe', function() {
      assert.equal(true, Either.of('DONE').equals(Either.chainRec(function(next, done, n) {
        if (n === 0) {
          return Either.of(done('DONE'));
        } else {
          return Either.of(next(n - 1));
        }
      }, 100000)));
    });

    it('responds to failure immediately', function() {
      assert.equal(true, Either.Left("ERROR").equals(Either.chainRec(function(/*next, done, n*/) {
        return Either.Left("ERROR");
      }, 100)));
    });

    it('responds to failure on next step', function() {
      assert.equal(true, Either.Left("ERROR").equals(Either.chainRec(function(next, done, n) {
        if (n === 0) {
          return Either.Left("ERROR");
        }
        return Either.of(next(n - 1));
      }, 100)));
    });
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

  describe('#@@type', function() {

    it('is "ramda-fantasy/Either"', function() {
      assert.strictEqual(Either.Left(null)['@@type'], 'ramda-fantasy/Either');
      assert.strictEqual(Either.Right(null)['@@type'], 'ramda-fantasy/Either');
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

  describe('#equals', function() {

    it('returns true if both contain equal values and are both Left', function() {
      assert.equal(true, Either.Left(1).equals(Either.Left(1)));
    });

    it('returns true if both contain equal values and are both Right', function() {
      assert.equal(true, Either.Right(1).equals(Either.Right(1)));
    });

    it('returns false if both contain equal values but are of different constructors', function() {
      assert.equal(false, Either.Left(1).equals(Either.Right(1)));
    });

    it('returns false if both contain different values and are both Left', function() {
      assert.equal(false, Either.Left(0).equals(Either.Left(1)));
    });

    it('returns false if both contain different values and are both Right', function() {
      assert.equal(false, Either.Right(0).equals(Either.Right(1)));
    });

  });



  describe('#either', function() {
    it('returns the value of a Left after applying the first function arg', function() {
      jsv.assert(jsv.forall(leftArb(jsv.nat), fnNatArb, fnNatArb, function(e, f, g) {
        return e.either(f, g) === f(e.value);
      }));
    });

    it('returns the value of a Right after applying the second function arg', function() {
      jsv.assert(jsv.forall(rightArb(jsv.nat), fnNatArb, fnNatArb, function(e, f, g) {
        return e.either(f, g) === g(e.value);
      }));
    });
  });

});
