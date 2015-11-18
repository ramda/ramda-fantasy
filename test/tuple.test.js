var R = require('ramda');
var assert = require('assert');
var equalsInvoker = require('./utils').equalsInvoker;
var types = require('./types')(equalsInvoker);
var jsv = require('jsverify');

var Tuple = require('..').Tuple;
var constructor = Tuple('', '').constructor;

var TupleGen = R.curry(function(a, b, n) {
  return Tuple(a.generator(n), b.generator(n));
});

var TupleShow = R.curry(function(a, m) {
  return 'Tuple(' + a.show(m[0]) + ', ' + a.show(m[1]) + ')';
});

var TupleShrink = R.curry(function(a, m) {
  return [Tuple(a.shrink(m[0]), a.shrink(m[1]))];
});

var TupleArb = function(a, b) {
  return {
    generator: jsv.generator.bless(TupleGen(a, b)),
    show: TupleShow(a),
    shrink: jsv.shrink.bless(TupleShrink(a))
  };
};

var stringArb = jsv.generator.bless({
  generator: function() {
    switch (jsv.random(0, 2)) {
      case 0: return 'foo';
      case 1: return 'bar';
      case 2: return 'quux';
    }
  },
  show: function(a) { return a; },
  shrink: jsv.shrink.bless(function(m) { return [m.slice(1)]; })
});

function mult(a) {
  return function(b) { return a * b; };
}

function add(a) {
  return function(b) { return a + b; };
}


describe('Tuple', function() {
  var m = TupleArb(stringArb, jsv.nat);

  it('has an arbitrary', function() {
    var arb = jsv.forall(m, function(m) {
      return m instanceof constructor;
    });
    jsv.assert(arb);
  });

  it('is a Semigroup', function() {
    var t = TupleArb(stringArb, stringArb);
    var t1 = TupleArb(stringArb, stringArb);
    var t2 = TupleArb(stringArb, stringArb);
    var sTest = types.semigroup;

    jsv.assert(jsv.forall(t, sTest.iface));
    jsv.assert(jsv.forall(t, t1, t2, sTest.associative));
  });

  it('is a Functor', function() {
    var fTest = types.functor;

    jsv.assert(jsv.forall(m, fTest.iface));
    jsv.assert(jsv.forall(m, fTest.id));
    jsv.assert(jsv.forall(m, 'nat -> nat', 'nat -> nat', fTest.compose));
  });

  it('is an Apply', function() {
    var aTest = types.apply;
    var appA = Tuple('', mult(10));
    var appU = Tuple('', add(7));
    var appV = Tuple('', 10);

    jsv.assert(jsv.forall(m, aTest.iface));
    assert.equal(true, aTest.compose(appA, appU, appV));
  });
});

describe('Tuple usage', function() {

  describe('creation', function() {
    it('should be curried', function() {
      var tpl = Tuple('dr')(true);
      assert.equal('dr', tpl[0]);
      assert.equal(true, tpl[1]);
    });
  });

  describe('element access', function() {
    var tuple = Tuple('nacho', 'cheese');

    it('should work with indexes', function() {
      assert.equal('nacho', tuple[0]);
      assert.equal('cheese', tuple[1]);
    });

    it('should return the value in the first position', function() {
      assert.equal('nacho', Tuple.fst(tuple));
      assert.equal('cheese', Tuple.snd(tuple));
    });

    it('should work with head', function() {
      assert.equal('nacho', R.head(tuple));
    });

    it('should work with nth', function() {
      assert.equal('cheese', R.nth(1, tuple));
    });

    it('should work with tail', function() {
      assert.equal('cheese', R.tail(tuple));
    });

    it('should work with take', function() {
      assert.equal('nacho', R.take(1, tuple)[0]);
    }
    );
    it('should work with drop', function() {
      assert.equal('cheese', R.drop(1, tuple)[0]);
    });

    it('will tell us the length', function() {
      assert.equal(2, tuple.length);
    });
  });

  describe('interface sanity check', function() {
    var tuple = Tuple('mixed', 'nuts');

    it('only maps the snd', function() {
      var t = tuple.map(add('coco'));
      assert.equal('mixed', t[0]);
      assert.equal('coconuts', t[1]);
    });

    it('will combine two tuples', function() {
      var t = tuple.concat(Tuple(' chocolate', ' bars'));
      assert.equal('mixed chocolate', t[0]);
      assert.equal('nuts bars', t[1]);
    });

    it('will apply and concat', function() {
      var t = Tuple('Re', 'dough').map(add).ap(tuple);
      assert.equal('Remixed', t[0]);
      assert.equal('doughnuts', t[1]);
    });
  });

  describe('#@@type', function() {

    it('is "ramda-fantasy/Tuple"', function() {
      assert.strictEqual(Tuple(null, null)['@@type'], 'ramda-fantasy/Tuple');
    });

  });

  describe('#toString', function() {

    it('returns the string representation of a Tuple', function() {
      assert.strictEqual(Tuple('abc', [1, 2, 3]).toString(),
                         'Tuple("abc", [1, 2, 3])');
      assert.strictEqual(Tuple('abc', Tuple(1, 2)).toString(),
                         'Tuple("abc", Tuple(1, 2))');
    });

  });

});
