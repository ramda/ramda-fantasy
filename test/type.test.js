var R = require('ramda');
var assert = require('assert');

var Type = require('..').Type;

describe('Type.product', function() {
  var point = Type.product('x', 'y');
  point.prototype.equals = function(p) {
    return p instanceof point &&
      this.x() === p.x() &&
      this.y() === p.y();
  };
  var point_1_2 = point(1, 2);

  it('creates a curried constructor', function() {
    assert(point(1)(2).equals(point_1_2));
  });

  it('creates lenses for all properties', function() {
    assert.strictEqual(R.view(point.x, point_1_2), 1);
    assert.strictEqual(R.view(point.y, point_1_2), 2);
    assert(R.set(point.x, 3, point_1_2).equals(point(3, 2)));
    assert(R.set(point.y, 3, point_1_2).equals(point(1, 3)));
  });

  describe('instances', function() {
    it('can be unapplied to access the properties', function() {
      var xy = point_1_2.unapply(function(x, y) { return [x, y]; });
      assert.strictEqual(xy[0], 1);
      assert.strictEqual(xy[1], 2);
    });

    it('creates a getter/setter method for each declared property', function() {
      assert.strictEqual(point_1_2.x(), 1);
      assert.strictEqual(point_1_2.y(), 2);
      assert(point_1_2.x(3).equals(point(3, 2)));
      assert(point_1_2.y(3).equals(point(1, 3)));
    });

    it('returns a new instance when a setter is called', function() {
      var point_0_2 = point_1_2.x(0);
      assert(point_0_2.equals(point(0, 2)));
      assert(point_1_2.equals(point(1, 2)));
    });

    it('is an instanceof its constructor', function() {
      assert(point_1_2 instanceof point);
    });
  });
});

describe('Type.sum', function() {
  it('creates a product constructor for each declared type', function() {
    var Foo = Type.sum({ Bar: ['a', 'b'], Baz: ['c'] });
    var bar = Foo.Bar(1, 2);
    var baz = Foo.Baz(3);
    var _1_2 = bar.unapply(function(a, b) { return [a, b]; });
    var _3 = baz.unapply(function(c) { return c; });
    assert.strictEqual(_1_2[0], 1);
    assert.strictEqual(_1_2[1], 2);
    assert.strictEqual(_3, 3);
  });

  it('creates a singleton instance for constructors with no properties', function() {
    var Maybe = Type.sum({ Just: ['value'], Nothing: [] });
    assert(Maybe.Nothing instanceof Maybe);
    assert.strictEqual(Maybe.Nothing.unapply(function() { return 'foo'; }), 'foo');
  });

  describe('instances', function() {
    it('can be matched against each type', function() {
      var Either = Type.sum({ Left: ['value'], Right: ['value'] });
      var left1 = Either.Left(1);
      var right2 = Either.Right(2);
      assert(left1.match({
        Left: function(x) { return x === 1; },
        Right: function() { return false; }
      }));
      assert(right2.match({
        Left: function() { return false; },
        Right: function(x) { return x === 2; }
      }));
    });

    it('is an instance of its type', function() {
      var Foo = Type.sum({ Bar: ['x'] });
      assert(Foo.Bar(1) instanceof Foo.Bar);
      assert(Foo.Bar(1) instanceof Foo);
    });
  });
});

