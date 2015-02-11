var R = require('ramda');
var assert = require('assert');
var types = require('./types');

var Maybe = require('..').Maybe;

describe('Maybe', function() {
    var m = Maybe.fromNullable(1);
    var nada = Maybe.fromNullable(null);

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
        assert.equal(true, fTest.iface(nada));
        assert.equal(true, fTest.id(nada));
        assert.equal(true, fTest.compose(nada, mult(2), add(3)));
    });

    it('is an Apply', function() {
        var aTest = types.apply;
        var appA = Maybe.fromNullable(mult(10));
        var appU = Maybe.fromNullable(add(7));
        var appV = Maybe.fromNullable(10);

        assert.equal(true, aTest.iface(appA));
        assert.equal(true, aTest.compose(appA, appU, appV));
        assert.equal(true, aTest.iface(nada));
    });

    it('is an Applicative', function() {
        var aTest = types.applicative;
        var app1 = Maybe.fromNullable(101);
        var app2 = Maybe.fromNullable(-123);
        var appF = Maybe.fromNullable(R.multiply(3));

        assert.equal(true, aTest.iface(app1));
        assert.equal(true, aTest.id(app1, app2));
        assert.equal(true, aTest.id(app1, nada));
        assert.equal(true, aTest.homomorphic(app1, add(3), 46));
        assert.equal(true, aTest.interchange(app2, appF, 17));

        assert.equal(true, aTest.iface(nada));
        assert.equal(true, aTest.id(nada, Maybe.fromNullable(null)));
        assert.equal(true, aTest.homomorphic(nada, add(3), 46));
        assert.equal(true, aTest.interchange(nada, appF, 17));

    });

    it('is a Chain', function() {
        var cTest = types.chain;
        var f1 = function(x) {return Maybe.fromNullable(3 * x);};
        var f2 = function(x) {return Maybe.fromNullable(5 + x);};
        var fNull = function() {return Maybe.fromNullable(null);};
        assert.equal(true, cTest.iface(m));
        assert.equal(true, cTest.associative(m, f1, f2));
        assert.equal(true, cTest.iface(nada));
        assert.equal(true, cTest.associative(m, fNull, f2));
        assert.equal(true, cTest.associative(m, f1, fNull));
        assert.equal(true, cTest.associative(m, fNull, fNull));
    });

    it('is a Monad', function() {
        var mTest = types.monad;
        assert.equal(true, mTest.iface(m));
    });

});
