var assert = require('assert');
var types = require('./types');

var Reader = require('..').Reader;

function add(a) {
      return function(b) { return a + b; };
}

function always(x) {
      return function() { return x; };
}

function mult(a) {
      return function(b) { return a * b; };
}

function identity(x) { return x; }

describe('Reader properties', function() {

    var f1 = function(x) { return x + '1 '; };
    var f2 = function(x) { return x + '2 '; };
    var f3 = function(x) { return x + '3 '; };
    var r1 = Reader(f1);
    var r2 = Reader(f2);

    it('is a Functor', function() {
        var fTest = types.functor;
        assert.ok(fTest.iface(r1));
        assert.ok(fTest.id(r1));
        assert.ok(fTest.compose(r1, f2, f3));
    });

    it('is an Apply', function() {
        var aTest = types.apply;
        var a = Reader(function() { return add(1); });
        var b = Reader(function() { return always(2); });
        var c = Reader(always(4));

        assert.equal(true, aTest.iface(r1));
        assert.equal(true, aTest.compose(a, b, c));
    });

    it('is an Applicative', function() {
        var aTest = types.applicative;

        assert.equal(true, aTest.iface(r1));
        assert.equal(true, aTest.id(Reader, r2));
        assert.equal(true, aTest.homomorphic(r1, add(3), 46));
        assert.equal(true, aTest.interchange(
            Reader(function() { return mult(20); }),
            Reader(function() { return mult(0.5); }),
            73
        ));
    });

    it('is a Chain', function() {
        var cTest = types.chain;
        var c = Reader(function() {
            return Reader(function() {
                return Reader(function() {
                    return 3;
                });
            });
        });
        assert.equal(true, cTest.iface(r1));
        assert.equal(true, cTest.associative(c, identity, identity));
    });

    it('is a Monad', function() {
        var mTest = types.monad;
        assert.equal(true, mTest.iface(r1));
    });

});

describe('Reader examples', function() {
    it('should write name of options object', function() {

        var options = {name: 'header'};
        var Printer = {};
        Printer.write = function(x) {
            return '/** ' + x + ' */';
        };

        function getOptionsName(opts) {
            return Reader(function(printer) {
                return printer.write(opts.name);
            });
        }

        var nameReader = getOptionsName(options);

        assert.equal(nameReader.run(Printer), '/** header */');
    });
});
