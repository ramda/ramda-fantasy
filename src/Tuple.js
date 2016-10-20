var toString = require('ramda/src/toString');
var equals = require('ramda/src/equals');
var Z = require('sanctuary-type-classes');


function Tuple(x, y) {
  switch (arguments.length) {
    case 0:
      throw new TypeError('no arguments to Tuple');
    case 1:
      return function(y) {
        return new _Tuple(x, y);
      };
    default:
      return new _Tuple(x, y);
  }
}

function _Tuple(x, y) {
  this[0] = x;
  this[1] = y;
  this.length = 2;
}

Tuple.fst = function(x) {
  return x[0];
};

Tuple.snd = function(x) {
  return x[1];
};

_Tuple.prototype['@@type'] = 'ramda-fantasy/Tuple';

// semigroup
_Tuple.prototype.concat = function(x) {
  return Tuple(Z.concat(this[0], x[0]), Z.concat(this[1], x[1]));
};

// functor
_Tuple.prototype.map = function(f) {
  return Tuple(this[0], f(this[1]));
};

// apply
_Tuple.prototype.ap = function(m) {
  return Tuple(Z.concat(this[0], m[0]), this[1](m[1]));
};

// setoid
_Tuple.prototype.equals = function(that) {
  return that instanceof _Tuple && equals(this[0], that[0]) && equals(this[1], that[1]);
};

_Tuple.prototype.toString = function() {
  return 'Tuple(' + toString(this[0]) + ', ' + toString(this[1]) + ')';
};

require('./internal/fl-patch.js')([_Tuple, _Tuple.prototype]);


module.exports = Tuple;
