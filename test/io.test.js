var assert = require('assert');
var equals = require('ramda/src/equals');
var types = require('./types')(function(io1, io2) {
  return io1.equals(io2);
});

var IO = require('..').IO;

IO.prototype.equals = function(b) {
  return equals(this.runIO('x'), b.runIO('x'));
};

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

  describe('ChainRec', function() {
    it('is a ChainRec', function() {
      var cTest = types.chainRec;
      var predicate = function(a) {
        return a.length > 5;
      };
      var done = IO.of;
      var x = 1;
      var initial = [x];
      var next = function(a) {
        return IO.of(a.concat([x]));
      };
      assert.equal(true, cTest.iface(IO.of(1)));
      assert.equal(true, cTest.equivalence(IO, predicate, done, next, initial));
    });

    it('is stacksafe', function() {
      assert.equal(true, IO.of('DONE').equals(IO.chainRec(function(next, done, n) {
        if (n === 0) {
          return IO.of(done('DONE'));
        } else {
          return IO.of(next(n - 1));
        }
      }, 100000)));
    });
  });

  it('is a Monad', function() {
    var mTest = types.monad;
    assert.equal(true, mTest.iface(i1));
  });

  describe('#@@type', function() {

    it('is "ramda-fantasy/IO"', function() {
      assert.strictEqual(IO(function() {})['@@type'], 'ramda-fantasy/IO');
    });

  });

  describe('#toString', function() {

    it('returns the string representation of an IO', function() {
      assert.strictEqual(IO(function() {}).toString(),
                         'IO(function () {})');
    });

  });

});
