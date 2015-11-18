var assert = require('assert');
var types = require('./types');

var readerTypes = types(function(r1, r2) {
  return r1.run('x') === r2.run('x');
});

var transformerTypes = types(function(r1, r2) {
  return r1.run('x').get() === r2.run('x').get();
});

var Identity = require('..').Identity;
var Reader = require('../src/Reader');

var ReaderTIdentity = Reader.T(Identity);

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
    var fTest = readerTypes.functor;
    assert.ok(fTest.iface(r1));
    assert.ok(fTest.id(r1));
    assert.ok(fTest.compose(r1, f2, f3));
  });

  it('is an Apply', function() {
    var aTest = readerTypes.apply;
    var a = Reader(function() { return add(1); });
    var b = Reader(function() { return always(2); });
    var c = Reader(always(4));

    assert.equal(true, aTest.iface(r1));
    assert.equal(true, aTest.compose(a, b, c));
  });

  it('is an Applicative', function() {
    var aTest = readerTypes.applicative;

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
    var cTest = readerTypes.chain;
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
    var mTest = readerTypes.monad;
    assert.equal(true, mTest.iface(r1));
  });

  describe('.ask', function() {
    it('provides access to the environment', function() {
      var r = Reader.ask.map(add(100));
      assert.equal(101, r.run(1));
    });
  });

  describe('#@@type', function() {

    it('is "ramda-fantasy/Reader"', function() {
      assert.strictEqual(Reader(function(x) { void x; })['@@type'],
                         'ramda-fantasy/Reader');
    });

  });

  describe('#toString', function() {

    it('returns the string representation of a Reader', function() {
      assert.strictEqual(Reader(function(x) { void x; }).toString(),
                         'Reader(function (x) { void x; })');
    });

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

    assert.equal(Reader.run(nameReader, Printer), '/** header */');
  });
});

describe('Reader.T', function() {
  var r1 = ReaderTIdentity(function(x) {
    return Identity(x + '1 ');
  });
  var r2 = ReaderTIdentity(function(x) {
    return Identity(x + '2 ');
  });

  it('is a Functor', function() {
    var fTest = transformerTypes.functor;
    assert(fTest.iface(r1));
    assert(fTest.id(r1));
    assert(fTest.compose(r1,
      function(x) { return x + 'a'; },
      function(x) { return x + 'b'; }
    ));
  });

  it('is an Apply', function() {
    var aTest = transformerTypes.apply;
    var a = ReaderTIdentity(function() { return Identity(add(1)); });
    var b = ReaderTIdentity(function() { return Identity(always(2)); });
    var c = ReaderTIdentity(always(Identity(4)));

    assert(aTest.iface(r1));
    assert(aTest.compose(a, b, c));
  });

  it('is an Applicative', function() {
    var aTest = transformerTypes.applicative;

    assert(aTest.iface(r1));
    assert(aTest.id(ReaderTIdentity, r2));
    assert(aTest.homomorphic(r1, add(3), 46));
    assert(aTest.interchange(
      ReaderTIdentity(function() { return Identity(mult(20)); }),
      ReaderTIdentity(function() { return Identity(mult(0.5)); }),
      73
    ));
  });

  it('is a Chain', function() {
    var cTest = transformerTypes.chain;
    var c = ReaderTIdentity(function() {
      return Identity(ReaderTIdentity(function() {
        return Identity(ReaderTIdentity(function() {
          return Identity(3);
        }));
      }));
    });
    assert(cTest.iface(r1));
    assert(cTest.associative(c, identity, identity));
  });

  it('is a Monad', function() {
    var mTest = transformerTypes.monad;
    assert(mTest.iface(r1));
  });

  it('is a Transformer', function() {
    var mtTest = transformerTypes.transformer;
    assert(mtTest.iface(Reader.T));
    assert(mtTest.id(Reader.T));
    assert(mtTest.associative(Reader.T));
  });
});

describe('Reader.T examples', function() {
  it('should provide its environment to a lifted monad', function() {
    var readerTimes10 = ReaderTIdentity.ask.chain(function(env) {
      return ReaderTIdentity.lift(Identity(env * 10));
    });
    assert.strictEqual(readerTimes10.run(3).get(), 30);
  });
});
