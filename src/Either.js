var R = require('ramda');
var $ = require('sanctuary-def');


var a = $.TypeVariable('a');
var b = $.TypeVariable('b');
var c = $.TypeVariable('c');
var d = $.TypeVariable('d');

//  $Either :: Type -> Type -> Type
var $Either = $.BinaryType(
  'ramda-fantasy/Either',
  function(x) { return x instanceof Either; },
  function(e) { return e.isLeft ? [e.value] : []; },
  function(e) { return e.isRight ? [e.value] : []; }
);

var def = $.create($.env.concat([$Either]));

var method = function method(name, constraints, types, _f) {
  var f = def(name, constraints, types, _f);
  return def(name, constraints, R.tail(types), function() {
    return R.apply(f, R.prepend(this, arguments));
  });
};


function Either() {}

//. ### Constructors

//# Either.Left :: a -> Either a b
Either.Left =
def('Either.Left',
    {},
    [a, $Either(a, b)],
    function Left(value) {
      var e = new Either();
      e.value = value;
      e.isLeft = true;
      e.isRight = false;
      return e;
    });

//# Either.Right :: b -> Either a b
Either.Right =
def('Either.Right',
    {},
    [b, $Either(a, b)],
    function Right(value) {
      var e = new Either();
      e.value = value;
      e.isLeft = false;
      e.isRight = true;
      return e;
    });

//. ### Static functions

//# Either.either :: (a -> c) -> (b -> c) -> Either a b -> c
Either.either =
def('Either.either',
    {},
    [$.Function, $.Function, $Either(a, b), c],
    function either(leftFn, rightFn, e) {
      return e.isLeft ? leftFn(e.value) : rightFn(e.value);
    });

//# Either.equals :: Either a b -> Any -> Boolean
Either.equals =
def('Either.equals',
    {},
    [$Either(a, b), $.Any, $.Boolean],
    function equals(e, x) {
      return x instanceof Either &&  // XXX: Unreliable check.
             x.isLeft === e.isLeft &&
             R.equals(x.value, e.value);
    });

//# Either.isLeft :: Either a b -> Boolean
Either.isLeft =
def('Either.isLeft',
    {},
    [$Either(a, b), $.Boolean],
    function isLeft(x) { return x.isLeft; });

//# Either.isRight :: Either a b -> Boolean
Either.isRight =
def('Either.isRight',
    {},
    [$Either(a, b), $.Boolean],
    function isRight(x) { return x.isRight; });

//# Either.of :: b -> Either a b
Either.of =
def('Either.of',
    {},
    [b, $Either(a, b)],
    Either.Right);

//. ### Instance methods

//# Either#ap :: Either a (b -> c) ~> Either a b -> Either a c
Either.prototype.ap =
method('Either#ap',
       {},
       [$Either(a, $.Function), $Either(a, b), $Either(a, c)],
       function ap(e, e2) { return e.isLeft ? e : e2.map(e.value); });

//# Either#bimap :: Either a b ~> (a -> c) -> (b -> d) -> Either c d
Either.prototype.bimap =
method('Either#bimap',
       {},
       [$Either(a, b), $.Function, $.Function, $Either(c, d)],
       function bimap(e, l, r) {
         return e.isLeft ? Either.Left(l(e.value)) : Either.Right(r(e.value));
       });

//# Either#chain :: Either a b ~> (b -> Either a c) -> Either a c
Either.prototype.chain =
method('Either#chain',
       {},
       [$Either(a, b), $.Function, $Either(a, c)],
       function chain(e, f) { return e.isLeft ? e : f(e.value); });

//# Either#equals :: Either a b ~> Any -> Boolean
Either.prototype.equals =
method('Either#equals',
       {},
       [$Either(a, b), $.Any, $.Boolean],
       Either.equals);

//# Either#extend :: Either a b ~> (Either a b -> c) -> Either a c
Either.prototype.extend =
method('Either#extend',
       {},
       [$Either(a, b), $.Function, $Either(a, c)],
       function extend(e, f) { return e.isLeft ? e : Either.Right(f(e)); });

//# Either#map :: Either a b ~> (b -> c) -> Either a c
Either.prototype.map =
method('Either#map',
       {},
       [$Either(a, b), $.Function, $Either(a, c)],
       function map(e, f) { return e.isLeft ? e : Either.Right(f(e.value)); });

//# Either#of :: Either a b ~> c -> Either a c
Either.prototype.of =
method('Either#of',
       {},
       [$Either(a, b), c, $Either(a, c)],
       function of(e, x) { return Either.Right(x); });

//# Either#toString :: Either a b ~> String
Either.prototype.toString =
method('Either#toString',
       {},
       [$Either(a, b), $.String],
       function toString(e) {
         var ctorName = e.isLeft ? 'Left' : 'Right';
         return 'Either.' + ctorName + '(' + R.toString(e.value) + ')';
       });


module.exports = Either;
