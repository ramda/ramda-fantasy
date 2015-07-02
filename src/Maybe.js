var R = require('ramda');

var util = require('./internal/util.js');

function Maybe(x) {
  return x == null ? _nothing : Maybe.Just(x);
}

function _Just(x) {
  this.value = x;
}
util.extend(_Just, Maybe);

function _Nothing() {}
util.extend(_Nothing, Maybe);

var _nothing = new _Nothing();

Maybe.Nothing = function() {
  return _nothing;
};

Maybe.Just = function(x) {
  return new _Just(x);
};

Maybe.of = Maybe.Just;

Maybe.prototype.of = Maybe.Just;

Maybe.isJust = function(x) {
  return x instanceof _Just;
};

Maybe.isNothing = function(x) {
  return x === _nothing;
};

Maybe.maybe = R.curry(function(nothingVal, justFn, m) {
  return m.reduce(function(_, x) {
    return justFn(x);
  }, nothingVal);
});

// functor
_Just.prototype.map = function(f) {
  return this.of(f(this.value));
};

_Nothing.prototype.map = util.returnThis;

// apply
// takes a Maybe that wraps a function (`app`) and applies its `map`
// method to this Maybe's value, which must be a function.
_Just.prototype.ap = function(m) {
  return m.map(this.value);
};

_Nothing.prototype.ap = util.returnThis;

// applicative
// `of` inherited from `Maybe`


// chain
//  f must be a function which returns a value
//  f must return a value of the same Chain
//  chain must return a value of the same Chain
_Just.prototype.chain = util.baseMap;

_Nothing.prototype.chain = util.returnThis;


//
_Just.prototype.datatype = _Just;

_Nothing.prototype.datatype = _Nothing;

// monad
// A value that implements the Monad specification must also implement the Applicative and Chain specifications.
// see above.

// equality method to enable testing
_Just.prototype.equals = util.getEquals(_Just);

_Nothing.prototype.equals = function(that) {
  return that === _nothing;
};

Maybe.prototype.isNothing = function() {
  return this === _nothing;
};

Maybe.prototype.isJust = function() {
  return this instanceof _Just;
};

_Just.prototype.getOrElse = function() {
  return this.value;
};

_Nothing.prototype.getOrElse = function(a) {
  return a;
};

_Just.prototype.reduce = function(f, x) {
  return f(x, this.value);
};

_Nothing.prototype.reduce = function(f, x) {
  return x;
};

_Just.prototype.toString = function() {
  return 'Maybe.Just(' + R.toString(this.value) + ')';
};

_Nothing.prototype.toString = function() {
  return 'Maybe.Nothing()';
};

module.exports = Maybe;
