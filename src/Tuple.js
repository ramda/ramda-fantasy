var R = require('ramda');


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

function ensureConcat(xs) {
  xs.forEach(function(x) {
    if (typeof x.concat != 'function') {
      throw new TypeError(R.toString(x) + ' must be a semigroup to perform this operation');
    }
  });
}

Tuple.fst = function(x) {
  return x[0];
};

Tuple.snd = function(x) {
  return x[1];
};

// semigroup
_Tuple.prototype.concat = function(x) {
  ensureConcat([this[0], this[1]]);
  return Tuple(this[0].concat(x[0]), this[1].concat(x[1]));
};

// functor
_Tuple.prototype.map = function(f) {
  return Tuple(this[0], f(this[1]));
};

// apply
_Tuple.prototype.ap = function(m) {
  ensureConcat([this[0]]);
  return Tuple(this[0].concat(m[0]), this[1](m[1]));
};

// setoid
_Tuple.prototype.equals = function(that) {
  return that instanceof _Tuple && R.equals(this[0], that[0]) && R.equals(this[1], that[1]);
};

_Tuple.prototype.toString = function() {
  return 'Tuple(' + R.toString(this[0]) + ', ' + R.toString(this[1]) + ')';
};

module.exports = Tuple;
