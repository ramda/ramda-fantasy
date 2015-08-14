var assert = require('assert');
var types = require('./types')(function(io1, io2) {
  return io1.runIO('x') === io2.runIO('x');
});

var IO = require('..').IO;

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

describe('IO', function() {
  var logger = (function() {
    var results = [];
    return {
      log: function(str) {results.push(str);},
      clear: function() {results = [];},
      report: function() {return results.join(' ~ ');}
    };
  }());
  var f1 = function() { logger.log('IO 1'); return '1 '; };
  var f2 = function(x) { logger.log('IO 2'); return x + '2 '; };
  var f3 = function(x) { logger.log('IO 3'); return x + '3 '; };
  var i1 = IO(f1);
  var i2 = IO(f2);

  beforeEach(function() {
    logger.clear();
  });

  it('is a Functor', function() {
    var fTest = types.functor;
    assert.equal(true, fTest.iface(i1));
    assert.equal(true, fTest.id(i1));
    assert.equal(logger.report(), 'IO 1 ~ IO 1');
    logger.clear();
    assert.equal(true, fTest.compose(i1, f2, f3));
    assert.equal(logger.report(), 'IO 1 ~ IO 3 ~ IO 2 ~ IO 1 ~ IO 3 ~ IO 2');
  });

  it('is an Apply', function() {
    var aTest = types.apply;
    var a = IO(function() { return add(1); });
    var b = IO(function() { return always(2); });
    var c = IO(always(4));

    assert.equal(true, aTest.iface(i1));
    assert.equal(true, aTest.compose(a, b, c));
  });

  it('is an Applicative', function() {
    var aTest = types.applicative;

    assert.equal(true, aTest.iface(i1));
    assert.equal(true, aTest.id(IO, i2));
    assert.equal(logger.report(), 'IO 2 ~ IO 2');
    assert.equal(true, aTest.homomorphic(i1, add(3), 46));
    assert.equal(true, aTest.interchange(
      IO(function() { return mult(20); }),
      IO(function() { return mult(0.5); }),
      73
    ));
  });

  it('is a Chain', function() {
    var cTest = types.chain;
    var c = IO(function() {
      return IO(function() {
        return IO(function() {
          return 3;
        });
      });
    });
    assert.equal(true, cTest.iface(i1));
    assert.equal(true, cTest.associative(c, identity, identity));
  });

  it('is a Monad', function() {
    var mTest = types.monad;
    assert.equal(true, mTest.iface(i1));
  });

  describe('#toString', function() {

    it('returns the string representation of an IO', function() {
      assert.strictEqual(IO(function() {}).toString(),
                         'IO(function () {})');
    });

  });

});
