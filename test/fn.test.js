var assert = require('assert');

var Fn = require('..').Fn;

describe('Fn', function () {

  var id = Fn(function (x) {
    return x;
  });
  var add = Fn(function (a, b) {
    return a + b;
  });
  var mul = Fn(function (a, b) {
    return a * b;
  });
  var composeFn = Fn(function (f, g, x) {
    return f(g(x));
  });
  var apply = Fn(function (x, f) {
    return f(x);
  });

  it('produces a curried function', function () {
    var incr = add(1);
    assert.strictEqual(incr(10), 11);
  });

  describe('is a Monoid', function () {
    function Mul(v) {
      this.val = v;
    }

    Mul.prototype.empty = Mul.empty = function empty() {
      return new Mul(1);
    };
    Mul.prototype.concat = function concat(b) {
      return new Mul(this.val * b.val);
    };
    Mul.prototype.equals = function equals(b) {
      return b instanceof Mul && this.val === b.val;
    };

    var m = new Mul(42);
    var addMul1 = Fn(function add1(x) {
      return new Mul(x.val + 1);
    });
    var mulMul10 = Fn(function mul10(x) {
      return new Mul(x.val * 10);
    });

    it('satisfies left neutral', function () {
      assert.strictEqual(Fn.empty().concat(id)(m).equals(m), true);
    });

    it('satisfies right neutral', function () {
      assert.strictEqual(id.concat(Fn.empty())(m).equals(m), true);
    });

    it('satisfies associativity', function () {
      var monoidLaw3L = id.concat(addMul1.concat(mulMul10));
      var monoidLaw3R = id.concat(addMul1).concat(mulMul10);
      assert.strictEqual(monoidLaw3L(m).equals(monoidLaw3R(m)), true);
    });
  });

  describe('is a Functor', function () {
    it('satisfies identity', function () {
      var x = 42, y = 1;
      assert.strictEqual(add(x).map(id)(y), id(add(x))(y));
    });

    it('satisfies composition', function () {
      var x = 42, y = 2, z = 1;
      assert.strictEqual(
        id.map(add(x).compose(mul(y)))(z),
        id.map(mul(y)).map(add(x))(z)
      );
    });
  });

  describe('is an Applicative', function () {
    it('satisfies identity', function () {
      var x = 42, y = 1;
      assert.strictEqual(
        Fn.of(function (z) {
          return z;
        }).ap(add(x))(y),
        add(x)(y)
      );
    });

    it('satisfies composition', function () {
      var x = 42;
      assert.strictEqual(
        Fn.of(composeFn).ap(add).ap(mul).ap(id)(x),
        add.ap(mul.ap(id))(x)
      );
    });

    it('satisifies homomorphism', function () {
      var x = 1, y = 42, z = 10;
      assert.strictEqual(
        Fn.of(add(x)).ap(Fn.of(y))(z),
        Fn.of(add(x, y))(z)
      );
    });

    it('satisfies interchange', function () {
      var x = 42, y = 1;
      assert.strictEqual(
        add.ap(Fn.of(x))(y),
        Fn.of(apply(x)).ap(add)(y)
      );
    });

    it('satisfies functor', function () {
      var x = 42, f = function (a) {
        return a * a;
      };
      assert.strictEqual(id.map(f)(x), Fn.of(f).ap(id)(x));
    });
  });

  describe('is a Monad', function () {
    it('satisfies left identity', function () {
      var x = 42, y = 1;
      assert.strictEqual(Fn.of(x).chain(add)(y), add(x)(y));
    });
    it('satisfies right identity', function () {
      var x = 42;
      assert.strictEqual(id.chain(Fn.of)(x), id(x));
    });
    it('satisfies associativity', function () {
      var x = 42;
      assert.strictEqual(
        id.chain(add).chain(mul)(x),
        id.chain(function (a) {
          return add(a).chain(mul);
        })(x)
      );
    });
  });

  describe('is a Profunctor', function () {
    it('satisfies identity', function () {
      var x = 42, y = 1;
      assert.strictEqual(
        add(x).dimap(id, id)(y),
        id(add(x))(y)
      );
    });

    it('satisfies composition', function () {
      var h = mul(2);
      var h_ = add(42);
      var f = add(2);
      var f_ = mul(42);
      var x = 10;
      assert.strictEqual(
        id.dimap(h_.compose(h), f.compose(f_))(x),
        id.dimap(h_, f_).dimap(h, f)(x)
      );
    });
  });

  describe('is a Semigroupoid', function () {
    it('satisfies left identity', function () {
      var x = 42, f = add(10);
      assert.strictEqual(id.compose(f)(x), f(x));
    });

    it('satisfies right identity', function () {
      var x = 42, f = add(10);
      assert.strictEqual(f.compose(id)(x), f(x));
    });

    it('satisfies composition', function () {
      var f = add(10), g = mul(2), h = add(4), x = 42;
      assert.strictEqual(
        f.compose(g).compose(h)(x),
        f.compose(g.compose(h))(x)
      );
    });
  });

  describe('#toString', function () {
    it('returns the string representation of a named function', function () {
      assert.strictEqual(Fn(function undef() {}).toString(), 'Fn[undef]()'); });

    it('returns the string representation of a anonymous function', function () {
      assert.strictEqual(Fn(function() {}).toString(), 'Fn[?]()');
    });

    it('returns the string representation of a named function with args', function () {
      assert.strictEqual(Fn(function add(a, b) { return a + b; }).toString(), 'Fn[add](_, _)');
    });

    it('returns the string representation of an anonymous function with args', function () {
      assert.strictEqual(Fn(function(a, b) { return a + b; }).toString(), 'Fn[?](_, _)');
    });

    it('returns the string representation of a partially applied named function', function () {
      assert.strictEqual(Fn(function add(a, b) { return a + b; })(1).toString(), 'Fn[add](1, _)');
    });

    it('returns the string representation of a partially applied anonymous function', function () {
      assert.strictEqual(Fn(function(a, b) { return a + b; })(1).toString(), 'Fn[?](1, _)');
    });
  });
});
