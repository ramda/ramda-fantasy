var R = require('ramda');

module.exports = {
  sum: sum,
  product: productOf(null)
};

/**
 * # Algebraic Data Types
 *
 * Algebraic data types are a way of modeling data, typically in two forms known
 * as product types and sum types. Product types associate values with their
 * fields (similar to a standard object in javascript), while sum types model a
 * group of different types together as a single type.
 *
 * ## Product types
 *
 * Product types can be created by calling `product` with strings
 * representing the fields to exist on each type.
 *
 * For example, the following will create a `Point` type with two
 * fields (`x` and `y`):
 * ```js
 * var Point = Type.product('x', 'y');
 * ```
 *
 * Instances are created by calling the type as a function:
 * ```js
 * var origin = Point(0, 0);
 * origin instanceof Point // true
 * ```
 *
 * Once an instance is created, its fields can be accessed via
 * getter methods attached to the instance:
 * ```js
 * var originX = origin.x();
 * ```
 *
 * Alternatively an instance can be unapplied, providing access to
 * all its fields in one call:
 * ```js
 * origin.unapply(function(x, y) {
 *   return x === 0 && y === 0;
 * });
 * ```
 *
 * Values of a product instance can also be modified, however because the
 * instances are immutable this will cause a new instance to be returned with
 * the modified value rather than mutating the previous instance.
 * ```js
 * var x1y0 = origin.x(1);
 * x1y0.x(); // 1
 *
 * // note `origin` remains unmodified
 * origin.x(); // 0
 * ```
 *
 * When a type is created, lenses for each field are also available on the
 * type constructor:
 * ```js
 * R.view(Point.x, point); // 0
 * R.set(Point.y, point);  // Point(0, 1);
 * ```
 *
 * ## Sum Types
 *
 * Sum types can be created by calling `sum` with an object that describes
 * its constructors.
 *
 * For example will create a `List` type, with two constructors `Cons` and `Nil`:
 * ```js
 * var List = Type.sum({ Cons: ['head', 'tail'], Nil: [] });
 * var Cons = List.Cons;
 * var Nil = List.Nil;
 * ```
 *
 * The constructors behave exactly the same as product type constructors:
 * ```js
 * var abc = Cons('a', Cons('b', Cons('c', Nil)));
 * abc instanceof Cons; // true
 * abc instanceof List; // true
 *
 * var c = abc.tail().tail().head();
 * // or
 * var c = R.view(R.compose(Cons.tail, Cons.tail, Cons.head), abc);
 *
 * abc.unapply(function(head, tail) {
 *   return head + head + head;
 * }); // "aaa"
 * ```
 *
 * If a constructor is declared with no fields, a singleton instance
 * of that constructor is returned instead:
 * ```js
 * Nil instanceof List; // true
 * Nil.unapply(function() { return '?'; }); // '?'
 * ```
 *
 * An instance can also be matched and dispatched against its type:
 * ```js
 * function headOrElse(other, list) {
 *   return list.match({
 *     Cons: function(head, tail) { return head; },
 *     Nil: function() { return other; }
 *   });
 * }
 * ```
 */

// Allows a given `proto` to be used as the base prototype of the product
// instances -- this is used by `sum` to extend the generated sum type without
// resorting to setting __proto__ or relying on Object.setPrototypeOf introduced
// in ES6.
function productOf(proto) {
  // The actual function used to create a product type with the given set of field names.
  return function() {
    var field, i;
    var fields = arguments;
    var Constructor = R.curryN(fields.length, function () {
      var vals = arguments;
      return Object.create(Constructor.prototype, {
        unapply: {
          value: function unapply(f) {
            return f.apply(this, vals);
          }
        }
      });
    });
    Constructor.prototype = Object.create(proto);
    Constructor.prototype.constructor = Constructor;
    for (i = 0; i < fields.length; i++) {
      field = fields[i];
      Constructor[field] = productLens(i);
      Constructor.prototype[field] = getterSetter(field);
    }
    return Constructor;
  };
}

// The function used to create a sum type with the given constructor descriptor.
function sum(constructors) {
  var Type = function () {};

  function buildProto(name) {
    return Object.create(Type.prototype, {
      match: {
        value: function(cases) {
          return this.unapply(cases[name]);
        }
      }
    });
  }

  function buildConstructor(name, fields) {
    var constructor = productOf(buildProto(name)).apply(null, fields);
    constructor.prototype.constructor = constructor;
    // Return a singleton instance for nullary constructors
    return fields.length > 0 ? constructor : constructor();
  }

  for (var k in constructors) {
    if (constructors.hasOwnProperty(k)) {
      Type[k] = buildConstructor(k, constructors[k]);
    }
  }
  return Type;
}

// Creates a lens with a focus on the `n`th field of a product instance.
function productLens(n) {
  return R.lens(
    function(p) {
      return p.unapply(R.nthArg(n));
    },
    function(x, p) {
      return p.unapply(function() {
        return p.constructor.apply(null, R.update(n, x, arguments));
      });
    }
  );
}

// Returns a getter/setter function for the given field name.
// If called with no arguments, the field's value will be returned, otherwise
// a new instance will be returned with the field's value replaced with the
// first argument.
function getterSetter(field) {
  return function() {
    var lens = this.constructor[field];
    return arguments.length > 0 ? R.set(lens, arguments[0], this)
                                : R.view(lens, this);
  };
}
