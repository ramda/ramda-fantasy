var R = require('ramda');
var assert = require('assert');
var equalsInvoker = require('./utils').equalsInvoker;
var types = require('./types')(equalsInvoker);
var jsv = require('jsverify');

var Maybe = require('..').Maybe;

var MaybeGen = R.curry(function(a, n) {
  return n % 2 === 0 ? Maybe.Just(a.generator(n)) : Maybe.Nothing();
});

var MaybeShow = R.curry(function(a, m) {
  return (Maybe.isJust(m)) ?
    'Just(' + a.show(m.value) + ')' :
    'Nothing';
});

var MaybeShrink = R.curry(function(a, m) {
  return (Maybe.isJust(m)) ?
    [Maybe.Nothing()].concat(a.shrink(m.value).map(Maybe.Just)) :
    [];
});

var MaybeArb = function(a) {
  return {
    generator: jsv.generator.bless(MaybeGen(a)),
    show: MaybeShow(a),
    shrink: jsv.shrink.bless(MaybeShrink(a))
  };
};

describe('Maybe', function() {
  var m = MaybeArb(jsv.nat);
  var env = {Maybe: MaybeArb};
  var appF = 'Maybe (nat -> nat)';
  var appN = 'Maybe nat';

  it('has an arbitrary', function() {
    var arb = jsv.forall(m, function(m) {
      return m instanceof Maybe;
    });
    jsv.assert(arb);
  });

  it('is a Functor', function() {
    var fTest = types.functor;

    jsv.assert(jsv.forall(m, fTest.iface));
    jsv.assert(jsv.forall(m, fTest.id));
    jsv.assert(jsv.forall(m, 'nat -> nat', 'nat -> nat', fTest.compose));
  });

  it('is an Apply', function() {
    var aTest = types.apply;

    jsv.assert(jsv.forall(m, aTest.iface));
    jsv.assert(jsv.forall(appF, appF, appN, env, aTest.compose));
  });

  it('is an Applicative', function() {
    var aTest = types.applicative;

    jsv.assert(jsv.forall(m, aTest.iface));
    jsv.assert(jsv.forall(appN, appN, env, aTest.id));
    jsv.assert(jsv.forall(appN, 'nat -> nat', 'nat', env, aTest.homomorphic));
    jsv.assert(jsv.forall(appN, appF, 'nat', env, aTest.interchange));
  });

  it('is a Chain', function() {
    var cTest = types.chain;
    var f = 'nat -> Maybe nat';

    jsv.assert(jsv.forall(m, cTest.iface));
    jsv.assert(jsv.forall(m, f, f, env, cTest.associative));
  });

  describe('ChainRec', function() {
    it('is a ChainRec', function() {
      var cTest = types.chainRec;
      var predicate = function(a) {
        return a.length > 5;
      };
      var done = Maybe.of;
      var x = 1;
      var initial = [x];
      var next = function(a) {
        return Maybe.of(a.concat([x]));
      };
      assert.equal(true, cTest.iface(Maybe.of(1)));
      assert.equal(true, cTest.equivalence(Maybe, predicate, done, next, initial));
    });

    it('is stacksafe', function() {
      var a = Maybe.chainRec(function(next, done, n) {
        if (n === 0) {
          return Maybe.of(done('DONE'));
        } else {
          return Maybe.of(next(n - 1));
        }
      }, 100000);
      console.log('a',a);
      assert.equal(true, Maybe.of('DONE').equals(a));
    });

    it('responds to failure immediately', function() {
      assert.equal(true, Maybe.Nothing().equals(Maybe.chainRec(function(/*next, done, n*/) {
        return Maybe.Nothing();
      }, 100)));
    });

    it('responds to failure on next step', function() {
      return Maybe.Nothing().equals(Maybe.chainRec(function(next, done, n) {
        if (n === 0) {
          return Maybe.Nothing();
        }
        return Maybe.of(next(n - 1));
      }, 100));
    });
  });

  it('is a Monad', function() {
    var mTest = types.monad;

    jsv.assert(jsv.forall(m, mTest.iface));
  });

  it('is Foldable', function() {
    var fTest = types.foldable;

    jsv.assert(jsv.forall(m, fTest.iface));
    jsv.assert(jsv.forall('nat -> nat -> nat', 'nat', 'nat', function(f, n1, n2) {
      return Maybe.Just(n1).reduce(R.uncurryN(2, f), n2) === f(n2)(n1);
    }));
    jsv.assert(jsv.forall('nat -> nat -> nat', 'nat', function(f, n) {
      return Maybe.Nothing().reduce(R.uncurryN(2, f), n) === n;
    }));
  });
});

describe('Maybe usage', function() {

  describe('checking for Just | Nothing', function() {
    it('should allow the user to check if the instance is a Nothing', function() {
      assert.equal(true, Maybe(null).isNothing);
      assert.equal(false, Maybe(42).isNothing);
    });

    it('should allow the user to check if the instance is a Just', function() {
      assert.equal(true, Maybe(42).isJust);
      assert.equal(false, Maybe(null).isJust);
    });

    it('can check the type statically', function() {
      var nada = Maybe.Nothing();
      var just1 = Maybe.Just(1);
      assert.equal(Maybe.isJust(nada), false);
      assert.equal(Maybe.isNothing(nada), true);
      assert.equal(Maybe.isJust(just1), true);
      assert.equal(Maybe.isNothing(just1), false);
    });
  });

  describe('#getOrElse', function() {

    it('should return the contained value for if the instance is a Just', function() {
      assert.equal(42, Maybe(42).getOrElse(24));
    });

    it('should return the input value if the instance is a Nothing', function() {
      assert.equal(24, Maybe(null).getOrElse(24));
    });

  });

  describe('#@@type', function() {

    it('is "ramda-fantasy/Maybe"', function() {
      assert.strictEqual(Maybe.Just(null)['@@type'], 'ramda-fantasy/Maybe');
      assert.strictEqual(Maybe.Nothing()['@@type'], 'ramda-fantasy/Maybe');
    });

  });

  describe('#toString', function() {

    it('returns the string representation of a Just', function() {
      assert.strictEqual(Maybe.Just([1, 2, 3]).toString(),
                         'Maybe.Just([1, 2, 3])');
    });

    it('returns the string representation of a Nothing', function() {
      assert.strictEqual(Maybe.Nothing().toString(),
                         'Maybe.Nothing()');
    });

  });

  describe('#maybe', function() {

    it('returns the result of applying the value of a Just to the second argument', function() {
      jsv.assert(jsv.forall('nat -> nat', 'nat', 'nat', function(f, n1, n2) {
        return R.equals(Maybe.maybe(n2, f, Maybe.Just(n1)), f(n1));
      }));
    });

    it('returns the first argument for a Nothing', function() {
      jsv.assert(jsv.forall('nat -> nat', 'nat', 'nat', function(f, n) {
        return R.equals(Maybe.maybe(n, f, Maybe.Nothing()), n);
      }));
    });
  });
});
