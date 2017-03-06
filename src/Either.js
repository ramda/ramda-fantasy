var curry = require('ramda/src/curry');
var toString = require('ramda/src/toString');

var util = require('./internal/util');


function Either(left, right) {
  switch (arguments.length) {
    case 0:
      throw new TypeError('no arguments to Either');
    case 1:
      return function(right) {
        return right == null ? Either.Left(left) : Either.Right(right);
      };
    default:
      return right == null ? Either.Left(left) : Either.Right(right);
  }
}

Either.prototype['@@type'] = 'ramda-fantasy/Either';

Either.prototype.map = util.returnThis;

Either.of = Either.prototype.of = function(value) {
  return Either.Right(value);
};

Either.prototype.chain = util.returnThis; // throw?

Either.either = curry(function either(leftFn, rightFn, e) {
  if (e instanceof _Left) {
    return leftFn(e.value);
  } else if (e instanceof _Right) {
    return rightFn(e.value);
  } else {
    throw new TypeError('invalid type given to Either.either');
  }
});

Either.isLeft = function(x) {
  return x.isLeft;
};

Either.isRight = function(x) {
  return x.isRight;
};


// Right
function _Right(x) {
  this.value = x;
}
util.extend(_Right, Either);

_Right.prototype.isRight = true;
_Right.prototype.isLeft = false;

_Right.prototype.map = function(fn) {
  return new _Right(fn(this.value));
};

_Right.prototype.ap = function(that) {
  return that.map(this.value);
};

_Right.prototype.chain = function(f) {
  return f(this.value);
};

//chainRec
Either.chainRec = Either.prototype.chainRec = function(f, i) {
  var res, state = util.chainRecNext(i);
  while (state.isNext) {
    res = f(util.chainRecNext, util.chainRecDone, state.value);
    if (Either.isLeft(res)) {
      return res;
    }
    state = res.value;
  }
  return Either.Right(state.value);
};

_Right.prototype.bimap = function(_, f) {
  return new _Right(f(this.value));
};

_Right.prototype.extend = function(f) {
  return new _Right(f(this));
};

_Right.prototype.toString = function() {
  return 'Either.Right(' + toString(this.value) + ')';
};

_Right.prototype.equals = util.getEquals(_Right);

Either.Right = function(value) {
  return new _Right(value);
};


// Left
function _Left(x) {
  this.value = x;
}
util.extend(_Left, Either);

_Left.prototype.isLeft = true;
_Left.prototype.isRight = false;

_Left.prototype.ap = util.returnThis;

_Left.prototype.bimap = function(f) {
  return new _Left(f(this.value));
};

_Left.prototype.extend = util.returnThis;

_Left.prototype.toString = function() {
  return 'Either.Left(' + toString(this.value) + ')';
};

_Left.prototype.equals = util.getEquals(_Left);

Either.Left = function(value) {
  return new _Left(value);
};


// either
Either.prototype.either = function instanceEither(leftFn, rightFn) {
  return this.isLeft ? leftFn(this.value) : rightFn(this.value);
};

module.exports = Either;
