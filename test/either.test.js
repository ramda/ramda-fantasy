var assert = require('assert');
var equalsInvoker = require('./utils').equalsInvoker;
var types = require('./types')(equalsInvoker);

var Either = require('..').Either;

describe('Either', function() {
  var e = Either('original left', 1);

  function mult(a) {
    return function(b) { return a * b; };
  }

  function add(a) {
    return function(b) { return a + b; };
  }

  it('is a Functor', function() {
    var fTest = types.functor;
    assert.equal(true, fTest.iface(e));
    assert.equal(true, fTest.id(e));
    assert.equal(true, fTest.compose(e, mult(2), add(3)));
  });

  it('is an Apply', function() {
    var aTest = types.apply;
    var appA = Either('apply test fn a', mult(10));
    var appU = Either('apply test fn u', add(5));
    var appV = Either('apply test value v', 10);

    assert.equal(true, aTest.iface(appA));
    assert.equal(true, aTest.compose(appA, appU, appV));
  });

  it('is an Applicative', function() {
    var aTest = types.applicative;
    var app1 = Either('app1', 101);
    var app2 = Either('app2', -123);
    var appF = Either('appF', mult(3));

    assert.equal(true, aTest.iface(app1));
    assert.equal(true, aTest.id(app1, app2));
    assert.equal(true, aTest.homomorphic(app1, add(3), 46));
    assert.equal(true, aTest.interchange(app1, appF, 17));
  });

  it('is a Chain', function() {
    var cTest = types.chain;
    var f1 = function(x) {return Either('f1', (3 * x));};
    var f2 = function(x) {return Either('f2', (5 + x));};

    assert.equal(true, cTest.iface(e));
    assert.equal(true, cTest.associative(e, f1, f2));
  });

  it('is a Monad', function() {
    var mTest = types.monad;
    assert.equal(true, mTest.iface(e));
  });

  it('is an Extend', function() {
    var eTest = types.extend;
    var r = Either(null, 1);
    var l = Either(1, null);
    var f = function(x) {return x + 1;};

    assert.equal(true, eTest.iface(e));
    assert.equal(true, eTest.iface(r.extend(f)));
    assert.equal(true, eTest.iface(l.extend(f)));
  });

  describe('#bimap', function() {

    it('maps the first function over the left value', function() {
      var e = Either(1, null);
      var result = e.bimap(add(1));
      assert.equal(true, result.equals(Either(2, null)));
    });

    it('maps the second function over the right value', function() {
      var e = Either(null, 1);
      var result = e.bimap(null, add(1));
      assert.equal(true, result.equals(Either(null, 2)));
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
