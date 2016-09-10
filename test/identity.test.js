var assert = require('assert');
var equalsInvoker = require('./utils').equalsInvoker;
var types = require('./types')(equalsInvoker);

var Identity = require('..').Identity;

describe('Identity', function() {
  var m = Identity(1);

  function mult(a) {
    return function(b) { return a * b; };
  }

  function add(a) {
    return function(b) { return a + b; };
  }


  it('is a Functor', function() {
    var fTest = types.functor;
    assert.equal(true, fTest.iface(m));
    assert.equal(true, fTest.id(m));
    assert.equal(true, fTest.compose(m, mult(2), add(3)));
  });

  it('is an Apply', function() {
    var aTest = types.apply;
    var appA = Identity(mult(10));
    var appU = Identity(add(7));
    var appV = Identity(10);

    assert.equal(true, aTest.iface(appA));
    assert.equal(true, aTest.compose(appA, appU, appV));
  });

  it('is an Applicative', function() {
    var aTest = types.applicative;
    var app1 = Identity(101);
    var app2 = Identity(-123);
    var appF = Identity(mult(3));

    assert.equal(true, aTest.iface(app1));
    assert.equal(true, aTest.id(app1, app2));
    assert.equal(true, aTest.homomorphic(app1, add(3), 46));
    assert.equal(true, aTest.interchange(app2, appF, 17));
  });

  it('is a Chain', function() {
    var cTest = types.chain;
    var f1 = function(x) {return Identity(3 * x);};
    var f2 = function(x) {return Identity(5 + x);};
    var fNull = function() {return Identity(null);};
    assert.equal(true, cTest.iface(m));
    assert.equal(true, cTest.associative(m, f1, f2));
    assert.equal(true, cTest.associative(m, fNull, f2));
    assert.equal(true, cTest.associative(m, f1, fNull));
    assert.equal(true, cTest.associative(m, fNull, fNull));
  });

  describe('ChainRec', function() {
    it('is a ChainRec', function() {
      var cTest = types.chainRec;
      var predicate = function(a) {
        return a.length > 5;
      };
      var done = Identity.of;
      var x = 1;
      var initial = [x];
      var next = function(a) {
        return Identity.of(a.concat([x]));
      };
      assert.equal(true, cTest.iface(Identity.of(1)));
      assert.equal(true, cTest.equivalence(Identity, predicate, done, next, initial));
    });

    it('is stacksafe', function() {
      assert.equal(true, Identity.of('DONE').equals(Identity.chainRec(function(next, done, n) {
        if (n === 0) {
          return Identity.of(done('DONE'));
        } else {
          return Identity.of(next(n - 1));
        }
      }, 100000)));
    });
  });

  it('is a Monad', function() {
    var mTest = types.monad;
    assert.equal(true, mTest.iface(m));
  });

  describe('#@@type', function() {

    it('is "ramda-fantasy/Identity"', function() {
      assert.strictEqual(Identity(null)['@@type'], 'ramda-fantasy/Identity');
    });

  });

  describe('#toString', function() {

    it('returns the string representation of an Identity', function() {
      assert.strictEqual(Identity([1, 2, 3]).toString(),
                         'Identity([1, 2, 3])');
      assert.strictEqual(Identity(Identity('abc')).toString(),
                         'Identity(Identity("abc"))');
    });

  });

});

describe('Identity example', function() {

  it('returns wrapped value', function() {
    var identNumber = Identity(4);
    assert.equal(identNumber.get(), 4);

    var identArray = Identity([1, 2, 3, 4]);
    assert.deepEqual(identArray.get(), [1, 2, 3, 4]);
  });

});
