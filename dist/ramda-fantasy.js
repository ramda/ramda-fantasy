(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.RF = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var _curry1 = _dereq_('./internal/_curry1');


/**
 * Returns a function that always returns the given value. Note that for non-primitives the value
 * returned is a reference to the original value.
 *
 * @func
 * @memberOf R
 * @category Function
 * @sig a -> (* -> a)
 * @param {*} val The value to wrap in a function
 * @return {Function} A Function :: * -> val.
 * @example
 *
 *      var t = R.always('Tee');
 *      t(); //=> 'Tee'
 */
module.exports = _curry1(function always(val) {
  return function() {
    return val;
  };
});

},{"./internal/_curry1":12}],2:[function(_dereq_,module,exports){
var _curry2 = _dereq_('./internal/_curry2');


/**
 * Wraps a function of any arity (including nullary) in a function that accepts exactly `n`
 * parameters. Unlike `nAry`, which passes only `n` arguments to the wrapped function,
 * functions produced by `arity` will pass all provided arguments to the wrapped function.
 *
 * @func
 * @memberOf R
 * @sig (Number, (* -> *)) -> (* -> *)
 * @category Function
 * @param {Number} n The desired arity of the returned function.
 * @param {Function} fn The function to wrap.
 * @return {Function} A new function wrapping `fn`. The new function is
 *         guaranteed to be of arity `n`.
 * @deprecated since v0.15.0
 * @example
 *
 *      var takesTwoArgs = function(a, b) {
 *        return [a, b];
 *      };
 *      takesTwoArgs.length; //=> 2
 *      takesTwoArgs(1, 2); //=> [1, 2]
 *
 *      var takesOneArg = R.arity(1, takesTwoArgs);
 *      takesOneArg.length; //=> 1
 *      // All arguments are passed through to the wrapped function
 *      takesOneArg(1, 2); //=> [1, 2]
 */
module.exports = _curry2(function(n, fn) {
  // jshint unused:vars
  switch (n) {
    case 0: return function() {return fn.apply(this, arguments);};
    case 1: return function(a0) {return fn.apply(this, arguments);};
    case 2: return function(a0, a1) {return fn.apply(this, arguments);};
    case 3: return function(a0, a1, a2) {return fn.apply(this, arguments);};
    case 4: return function(a0, a1, a2, a3) {return fn.apply(this, arguments);};
    case 5: return function(a0, a1, a2, a3, a4) {return fn.apply(this, arguments);};
    case 6: return function(a0, a1, a2, a3, a4, a5) {return fn.apply(this, arguments);};
    case 7: return function(a0, a1, a2, a3, a4, a5, a6) {return fn.apply(this, arguments);};
    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) {return fn.apply(this, arguments);};
    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {return fn.apply(this, arguments);};
    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {return fn.apply(this, arguments);};
    default: throw new Error('First argument to arity must be a non-negative integer no greater than ten');
  }
});

},{"./internal/_curry2":13}],3:[function(_dereq_,module,exports){
var _compose = _dereq_('./internal/_compose');
var _createComposer = _dereq_('./internal/_createComposer');


/**
 * Creates a new function that runs each of the functions supplied as parameters in turn,
 * passing the return value of each function invocation to the next function invocation,
 * beginning with whatever arguments were passed to the initial invocation.
 *
 * Note that `compose` is a right-associative function, which means the functions provided
 * will be invoked in order from right to left. In the example `var h = compose(f, g)`,
 * the function `h` is equivalent to `f( g(x) )`, where `x` represents the arguments
 * originally passed to `h`.
 *
 * @func
 * @memberOf R
 * @category Function
 * @sig ((y -> z), (x -> y), ..., (b -> c), (a... -> b)) -> (a... -> z)
 * @param {...Function} functions A variable number of functions.
 * @return {Function} A new function which represents the result of calling each of the
 *         input `functions`, passing the result of each function call to the next, from
 *         right to left.
 * @example
 *
 *      var triple = function(x) { return x * 3; };
 *      var double = function(x) { return x * 2; };
 *      var square = function(x) { return x * x; };
 *      var squareThenDoubleThenTriple = R.compose(triple, double, square);
 *
 *      //≅ triple(double(square(5)))
 *      squareThenDoubleThenTriple(5); //=> 150
 */
module.exports = _createComposer(_compose);

},{"./internal/_compose":10,"./internal/_createComposer":11}],4:[function(_dereq_,module,exports){
var _curry1 = _dereq_('./internal/_curry1');
var curryN = _dereq_('./curryN');


/**
 * Returns a curried equivalent of the provided function. The curried
 * function has two unusual capabilities. First, its arguments needn't
 * be provided one at a time. If `f` is a ternary function and `g` is
 * `R.curry(f)`, the following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value `R.__` may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is `R.__`,
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @category Function
 * @sig (* -> a) -> (* -> a)
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curryN
 * @example
 *
 *      var addFourNumbers = function(a, b, c, d) {
 *        return a + b + c + d;
 *      };
 *
 *      var curriedAddFourNumbers = R.curry(addFourNumbers);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
module.exports = _curry1(function curry(fn) {
  return curryN(fn.length, fn);
});

},{"./curryN":5,"./internal/_curry1":12}],5:[function(_dereq_,module,exports){
var _curry2 = _dereq_('./internal/_curry2');
var _curryN = _dereq_('./internal/_curryN');
var arity = _dereq_('./arity');


/**
 * Returns a curried equivalent of the provided function, with the
 * specified arity. The curried function has two unusual capabilities.
 * First, its arguments needn't be provided one at a time. If `g` is
 * `R.curryN(3, f)`, the following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value `R.__` may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is `R.__`,
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      var addFourNumbers = function() {
 *        return R.sum([].slice.call(arguments, 0, 4));
 *      };
 *
 *      var curriedAddFourNumbers = R.curryN(4, addFourNumbers);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
module.exports = _curry2(function curryN(length, fn) {
  return arity(length, _curryN(length, [], fn));
});

},{"./arity":2,"./internal/_curry2":13,"./internal/_curryN":14}],6:[function(_dereq_,module,exports){
var _curry2 = _dereq_('./internal/_curry2');
var _equals = _dereq_('./internal/_equals');
var _hasMethod = _dereq_('./internal/_hasMethod');


/**
 * Returns `true` if its arguments are equivalent, `false` otherwise.
 * Dispatches to an `equals` method if present. Handles cyclical data
 * structures.
 *
 * @func
 * @memberOf R
 * @category Relation
 * @sig a -> b -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      R.equals(1, 1); //=> true
 *      R.equals(1, '1'); //=> false
 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
 *
 *      var a = {}; a.v = a;
 *      var b = {}; b.v = b;
 *      R.equals(a, b); //=> true
 */
module.exports = _curry2(function equals(a, b) {
  return _hasMethod('equals', a) ? a.equals(b) :
         _hasMethod('equals', b) ? b.equals(a) : _equals(a, b, [], []);
});

},{"./internal/_curry2":13,"./internal/_equals":15,"./internal/_hasMethod":18}],7:[function(_dereq_,module,exports){
var _curry2 = _dereq_('./internal/_curry2');
var _forEach = _dereq_('./internal/_forEach');
var _hasMethod = _dereq_('./internal/_hasMethod');


/**
 * Iterate over an input `list`, calling a provided function `fn` for each element in the
 * list.
 *
 * `fn` receives one argument: *(value)*.
 *
 * Note: `R.forEach` does not skip deleted or unassigned indices (sparse arrays), unlike
 * the native `Array.prototype.forEach` method. For more details on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
 *
 * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns the original
 * array. In some libraries this function is named `each`.
 *
 * @func
 * @memberOf R
 * @category List
 * @sig (a -> *) -> [a] -> [a]
 * @param {Function} fn The function to invoke. Receives one argument, `value`.
 * @param {Array} list The list to iterate over.
 * @return {Array} The original list.
 * @example
 *
 *      var printXPlusFive = function(x) { console.log(x + 5); };
 *      R.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]
 *      //-> 6
 *      //-> 7
 *      //-> 8
 */
module.exports = _curry2(function forEach(fn, list) {
  return _hasMethod('forEach', list) ? list.forEach(fn) : _forEach(fn, list);
});

},{"./internal/_curry2":13,"./internal/_forEach":16,"./internal/_hasMethod":18}],8:[function(_dereq_,module,exports){
var _curry2 = _dereq_('./internal/_curry2');


/**
 * Returns true if its arguments are identical, false otherwise. Values are
 * identical if they reference the same memory. `NaN` is identical to `NaN`;
 * `0` and `-0` are not identical.
 *
 * @func
 * @memberOf R
 * @category Relation
 * @sig a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      var o = {};
 *      R.identical(o, o); //=> true
 *      R.identical(1, 1); //=> true
 *      R.identical(1, '1'); //=> false
 *      R.identical([], []); //=> false
 *      R.identical(0, -0); //=> false
 *      R.identical(NaN, NaN); //=> true
 */
module.exports = _curry2(function identical(a, b) {
  // SameValue algorithm
  if (a === b) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return a !== 0 || 1 / a === 1 / b;
  } else {
    // Step 6.a: NaN == NaN
    return a !== a && b !== b;
  }
});

},{"./internal/_curry2":13}],9:[function(_dereq_,module,exports){
var _curry1 = _dereq_('./internal/_curry1');
var _identity = _dereq_('./internal/_identity');


/**
 * A function that does nothing but return the parameter supplied to it. Good as a default
 * or placeholder function.
 *
 * @func
 * @memberOf R
 * @category Function
 * @sig a -> a
 * @param {*} x The value to return.
 * @return {*} The input value, `x`.
 * @example
 *
 *      R.identity(1); //=> 1
 *
 *      var obj = {};
 *      R.identity(obj) === obj; //=> true
 */
module.exports = _curry1(_identity);

},{"./internal/_curry1":12,"./internal/_identity":19}],10:[function(_dereq_,module,exports){
/**
 * Basic, right-associative composition function. Accepts two functions and returns the
 * composite function; this composite function represents the operation `var h = f(g(x))`,
 * where `f` is the first argument, `g` is the second argument, and `x` is whatever
 * argument(s) are passed to `h`.
 *
 * This function's main use is to build the more general `compose` function, which accepts
 * any number of functions.
 *
 * @private
 * @category Function
 * @param {Function} f A function.
 * @param {Function} g A function.
 * @return {Function} A new function that is the equivalent of `f(g(x))`.
 * @example
 *
 *      var double = function(x) { return x * 2; };
 *      var square = function(x) { return x * x; };
 *      var squareThenDouble = _compose(double, square);
 *
 *      squareThenDouble(5); //≅ double(square(5)) => 50
 */
module.exports = function _compose(f, g) {
  return function() {
    return f.call(this, g.apply(this, arguments));
  };
};

},{}],11:[function(_dereq_,module,exports){
var arity = _dereq_('../arity');


/*
 * Returns a function that makes a multi-argument version of compose from
 * either _compose or _composeP.
 */
module.exports = function _createComposer(composeFunction) {
  return function() {
    var fn = arguments[arguments.length - 1];
    var length = fn.length;
    var idx = arguments.length - 2;
    while (idx >= 0) {
      fn = composeFunction(arguments[idx], fn);
      idx -= 1;
    }
    return arity(length, fn);
  };
};

},{"../arity":2}],12:[function(_dereq_,module,exports){
/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0) {
      return f1;
    } else if (a != null && a['@@functional/placeholder'] === true) {
      return f1;
    } else {
      return fn(a);
    }
  };
};

},{}],13:[function(_dereq_,module,exports){
var _curry1 = _dereq_('./_curry1');


/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry2(fn) {
  return function f2(a, b) {
    var n = arguments.length;
    if (n === 0) {
      return f2;
    } else if (n === 1 && a != null && a['@@functional/placeholder'] === true) {
      return f2;
    } else if (n === 1) {
      return _curry1(function(b) { return fn(a, b); });
    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true &&
                          b != null && b['@@functional/placeholder'] === true) {
      return f2;
    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true) {
      return _curry1(function(a) { return fn(a, b); });
    } else if (n === 2 && b != null && b['@@functional/placeholder'] === true) {
      return _curry1(function(b) { return fn(a, b); });
    } else {
      return fn(a, b);
    }
  };
};

},{"./_curry1":12}],14:[function(_dereq_,module,exports){
var arity = _dereq_('../arity');


/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @return {array} An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 */
module.exports = function _curryN(length, received, fn) {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length &&
          (received[combinedIdx] == null ||
           received[combinedIdx]['@@functional/placeholder'] !== true ||
           argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (result == null || result['@@functional/placeholder'] !== true) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0 ? fn.apply(this, combined) : arity(left, _curryN(length, combined, fn));
  };
};

},{"../arity":2}],15:[function(_dereq_,module,exports){
var _has = _dereq_('./_has');
var identical = _dereq_('../identical');
var keys = _dereq_('../keys');
var type = _dereq_('../type');

// The algorithm used to handle cyclic structures is
// inspired by underscore's isEqual
module.exports = function _eqDeep(a, b, stackA, stackB) {
  var typeA = type(a);
  if (typeA !== type(b)) {
    return false;
  }

  if (typeA === 'Boolean' || typeA === 'Number' || typeA === 'String') {
    return typeof a === 'object' ?
      typeof b === 'object' && identical(a.valueOf(), b.valueOf()) :
      identical(a, b);
  }

  if (identical(a, b)) {
    return true;
  }

  if (typeA === 'RegExp') {
    // RegExp equality algorithm: http://stackoverflow.com/a/10776635
    return (a.source === b.source) &&
           (a.global === b.global) &&
           (a.ignoreCase === b.ignoreCase) &&
           (a.multiline === b.multiline) &&
           (a.sticky === b.sticky) &&
           (a.unicode === b.unicode);
  }

  if (Object(a) === a) {
    if (typeA === 'Date' && a.getTime() !== b.getTime()) {
      return false;
    }

    var keysA = keys(a);
    if (keysA.length !== keys(b).length) {
      return false;
    }

    var idx = stackA.length - 1;
    while (idx >= 0) {
      if (stackA[idx] === a) {
        return stackB[idx] === b;
      }
      idx -= 1;
    }

    stackA[stackA.length] = a;
    stackB[stackB.length] = b;
    idx = keysA.length - 1;
    while (idx >= 0) {
      var key = keysA[idx];
      if (!_has(key, b) || !_eqDeep(b[key], a[key], stackA, stackB)) {
        return false;
      }
      idx -= 1;
    }
    stackA.pop();
    stackB.pop();
    return true;
  }
  return false;
};

},{"../identical":8,"../keys":26,"../type":29,"./_has":17}],16:[function(_dereq_,module,exports){
module.exports = function _forEach(fn, list) {
  var idx = 0;
  while (idx < list.length) {
    fn(list[idx]);
    idx += 1;
  }
  // i can't bear not to return *something*
  return list;
};

},{}],17:[function(_dereq_,module,exports){
module.exports = function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

},{}],18:[function(_dereq_,module,exports){
var _isArray = _dereq_('./_isArray');


/**
 * Private function that determines whether or not a provided object has a given method.
 * Does not ignore methods stored on the object's prototype chain. Used for dynamically
 * dispatching Ramda methods to non-Array objects.
 *
 * @private
 * @param {String} methodName The name of the method to check for.
 * @param {Object} obj The object to test.
 * @return {Boolean} `true` has a given method, `false` otherwise.
 * @example
 *
 *      var person = { name: 'John' };
 *      person.shout = function() { alert(this.name); };
 *
 *      _hasMethod('shout', person); //=> true
 *      _hasMethod('foo', person); //=> false
 */
module.exports = function _hasMethod(methodName, obj) {
  return obj != null && !_isArray(obj) && typeof obj[methodName] === 'function';
};

},{"./_isArray":21}],19:[function(_dereq_,module,exports){
module.exports = function _identity(x) { return x; };

},{}],20:[function(_dereq_,module,exports){
var equals = _dereq_('../equals');


module.exports = function _indexOf(list, item, from) {
  var idx = 0;
  if (typeof from === 'number') {
    idx = from < 0 ? Math.max(0, list.length + from) : from;
  }
  while (idx < list.length) {
    if (equals(list[idx], item)) {
      return idx;
    }
    idx += 1;
  }
  return -1;
};

},{"../equals":6}],21:[function(_dereq_,module,exports){
/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
module.exports = Array.isArray || function _isArray(val) {
  return (val != null &&
          val.length >= 0 &&
          Object.prototype.toString.call(val) === '[object Array]');
};

},{}],22:[function(_dereq_,module,exports){
module.exports = function _map(fn, list) {
  var idx = 0, result = [];
  while (idx < list.length) {
    result[idx] = fn(list[idx]);
    idx += 1;
  }
  return result;
};

},{}],23:[function(_dereq_,module,exports){
module.exports = function _quote(s) {
  return '"' + s.replace(/"/g, '\\"') + '"';
};

},{}],24:[function(_dereq_,module,exports){
/**
 * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
 */
module.exports = (function() {
  var pad = function pad(n) { return (n < 10 ? '0' : '') + n; };

  return typeof Date.prototype.toISOString === 'function' ?
    function _toISOString(d) {
      return d.toISOString();
    } :
    function _toISOString(d) {
      return (
        d.getUTCFullYear() + '-' +
        pad(d.getUTCMonth() + 1) + '-' +
        pad(d.getUTCDate()) + 'T' +
        pad(d.getUTCHours()) + ':' +
        pad(d.getUTCMinutes()) + ':' +
        pad(d.getUTCSeconds()) + '.' +
        (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z'
      );
    };
}());

},{}],25:[function(_dereq_,module,exports){
var _indexOf = _dereq_('./_indexOf');
var _map = _dereq_('./_map');
var _quote = _dereq_('./_quote');
var _toISOString = _dereq_('./_toISOString');
var keys = _dereq_('../keys');


module.exports = function _toString(x, seen) {
  var recur = function recur(y) {
    var xs = seen.concat([x]);
    return _indexOf(xs, y) >= 0 ? '<Circular>' : _toString(y, xs);
  };

  switch (Object.prototype.toString.call(x)) {
    case '[object Arguments]':
      return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';
    case '[object Array]':
      return '[' + _map(recur, x).join(', ') + ']';
    case '[object Boolean]':
      return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();
    case '[object Date]':
      return 'new Date(' + _quote(_toISOString(x)) + ')';
    case '[object Null]':
      return 'null';
    case '[object Number]':
      return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
    case '[object String]':
      return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);
    case '[object Undefined]':
      return 'undefined';
    default:
      return (typeof x.constructor === 'function' && x.constructor.name !== 'Object' &&
              typeof x.toString === 'function' && x.toString() !== '[object Object]') ?
             x.toString() :  // Function, RegExp, user-defined types
             '{' + _map(function(k) { return _quote(k) + ': ' + recur(x[k]); }, keys(x).sort()).join(', ') + '}';
  }
};

},{"../keys":26,"./_indexOf":20,"./_map":22,"./_quote":23,"./_toISOString":24}],26:[function(_dereq_,module,exports){
var _curry1 = _dereq_('./internal/_curry1');
var _has = _dereq_('./internal/_has');


/**
 * Returns a list containing the names of all the enumerable own
 * properties of the supplied object.
 * Note that the order of the output array is not guaranteed to be
 * consistent across different JS platforms.
 *
 * @func
 * @memberOf R
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own properties.
 * @example
 *
 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
 */
module.exports = (function() {
  // cover IE < 9 keys issues
  var hasEnumBug = !({toString: null}).propertyIsEnumerable('toString');
  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString',
                            'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var contains = function contains(list, item) {
    var idx = 0;
    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }
      idx += 1;
    }
    return false;
  };

  return typeof Object.keys === 'function' ?
    _curry1(function keys(obj) {
      return Object(obj) !== obj ? [] : Object.keys(obj);
    }) :
    _curry1(function keys(obj) {
      if (Object(obj) !== obj) {
        return [];
      }
      var prop, ks = [], nIdx;
      for (prop in obj) {
        if (_has(prop, obj)) {
          ks[ks.length] = prop;
        }
      }
      if (hasEnumBug) {
        nIdx = nonEnumerableProps.length - 1;
        while (nIdx >= 0) {
          prop = nonEnumerableProps[nIdx];
          if (_has(prop, obj) && !contains(ks, prop)) {
            ks[ks.length] = prop;
          }
          nIdx -= 1;
        }
      }
      return ks;
    });
}());

},{"./internal/_curry1":12,"./internal/_has":17}],27:[function(_dereq_,module,exports){
var _curry1 = _dereq_('./internal/_curry1');


/**
 * Accepts a function `fn` and returns a function that guards invocation of `fn` such that
 * `fn` can only ever be called once, no matter how many times the returned function is
 * invoked.
 *
 * @func
 * @memberOf R
 * @category Function
 * @sig (a... -> b) -> (a... -> b)
 * @param {Function} fn The function to wrap in a call-only-once wrapper.
 * @return {Function} The wrapped function.
 * @example
 *
 *      var addOneOnce = R.once(function(x){ return x + 1; });
 *      addOneOnce(10); //=> 11
 *      addOneOnce(addOneOnce(50)); //=> 11
 */
module.exports = _curry1(function once(fn) {
  var called = false, result;
  return function() {
    if (called) {
      return result;
    }
    called = true;
    result = fn.apply(this, arguments);
    return result;
  };
});

},{"./internal/_curry1":12}],28:[function(_dereq_,module,exports){
var _curry1 = _dereq_('./internal/_curry1');
var _toString = _dereq_('./internal/_toString');


/**
 * Returns the string representation of the given value. `eval`'ing the output
 * should result in a value equivalent to the input value. Many of the built-in
 * `toString` methods do not satisfy this requirement.
 *
 * If the given value is an `[object Object]` with a `toString` method other
 * than `Object.prototype.toString`, this method is invoked with no arguments
 * to produce the return value. This means user-defined constructor functions
 * can provide a suitable `toString` method. For example:
 *
 *     function Point(x, y) {
 *       this.x = x;
 *       this.y = y;
 *     }
 *
 *     Point.prototype.toString = function() {
 *       return 'new Point(' + this.x + ', ' + this.y + ')';
 *     };
 *
 *     R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'
 *
 * @func
 * @memberOf R
 * @category String
 * @sig * -> String
 * @param {*} val
 * @return {String}
 * @example
 *
 *      R.toString(42); //=> '42'
 *      R.toString('abc'); //=> '"abc"'
 *      R.toString([1, 2, 3]); //=> '[1, 2, 3]'
 *      R.toString({foo: 1, bar: 2, baz: 3}); //=> '{"bar": 2, "baz": 3, "foo": 1}'
 *      R.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date("2001-02-03T04:05:06.000Z")'
 */
module.exports = _curry1(function toString(val) { return _toString(val, []); });

},{"./internal/_curry1":12,"./internal/_toString":25}],29:[function(_dereq_,module,exports){
var _curry1 = _dereq_('./internal/_curry1');


/**
 * Gives a single-word string description of the (native) type of a value, returning such
 * answers as 'Object', 'Number', 'Array', or 'Null'.  Does not attempt to distinguish user
 * Object types any further, reporting them all as 'Object'.
 *
 * @func
 * @memberOf R
 * @category Type
 * @sig (* -> {*}) -> String
 * @param {*} val The value to test
 * @return {String}
 * @example
 *
 *      R.type({}); //=> "Object"
 *      R.type(1); //=> "Number"
 *      R.type(false); //=> "Boolean"
 *      R.type('s'); //=> "String"
 *      R.type(null); //=> "Null"
 *      R.type([]); //=> "Array"
 *      R.type(/[A-z]/); //=> "RegExp"
 */
module.exports = _curry1(function type(val) {
  return val === null      ? 'Null'      :
         val === undefined ? 'Undefined' :
         Object.prototype.toString.call(val).slice(8, -1);
});

},{"./internal/_curry1":12}],30:[function(_dereq_,module,exports){
var curry = _dereq_('ramda/src/curry');
var toString = _dereq_('ramda/src/toString');

var util = _dereq_('./internal/util');


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


Either.equals = Either.prototype.equals = util.getEquals(Either);

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

Either.Left = function(value) {
  return new _Left(value);
};


module.exports = Either;

},{"./internal/util":38,"ramda/src/curry":4,"ramda/src/toString":28}],31:[function(_dereq_,module,exports){
var once = _dereq_('ramda/src/once');
var forEach = _dereq_('ramda/src/forEach');
var toString = _dereq_('ramda/src/toString');
var curry = _dereq_('ramda/src/curry');

var util = _dereq_('./internal/util');

function jail(handler, f){
  return function(a){
    try{
      return f(a);
    } catch(err) {
      handler(err);
    }
  };
}

// `f` is a function that takes two function arguments: `reject` (failure) and `resolve` (success)
function Future(f) {
  if (!(this instanceof Future)) {
    return new Future(f);
  }
  this._fork = f;
}

Future.prototype['@@type'] = 'ramda-fantasy/Future';

Future.prototype.fork = function(reject, resolve) {
  this._fork(reject, jail(reject, resolve));
};

// functor
Future.prototype.map = function(f) {
  return this.chain(function(a) { return Future.of(f(a)); });
};

// apply
Future.prototype.ap = function(m) {
  var self = this;

  return new Future(function(rej, res) {
    var applyFn, val;
    var doReject = once(rej);

    var resolveIfDone = jail(doReject, function() {
      if (applyFn != null && val != null) {
        return res(applyFn(val));
      }
    });

    self._fork(doReject, function(fn) {
      applyFn = fn;
      resolveIfDone();
    });

    m._fork(doReject, function(v) {
      val = v;
      resolveIfDone();
    });

  });

};

// applicative
Future.of = function(x) {
  // should include a default rejection?
  return new Future(function(_, resolve) { return resolve(x); });
};

Future.prototype.of = Future.of;

// chain
//  f must be a function which returns a value
//  f must return a value of the same Chain
//  chain must return a value of the same Chain
//:: Future a, b => (b -> Future c) -> Future c
Future.prototype.chain = function(f) {  // Sorella's:
  return new Future(function(reject, resolve) {
    return this._fork(
      function(a) { return reject(a); },
      jail(reject, function(b) { return f(b)._fork(reject, resolve); })
    );
  }.bind(this));
};

// chainRec
//
// Heavily influenced by the Aff MonadRec instance
// https://github.com/slamdata/purescript-aff/blob/51106474122d0e5aec8e3d5da5bb66cfe8062f55/src/Control/Monad/Aff.js#L263-L322
Future.chainRec = Future.prototype.chainRec = function(f, a) {
  return Future(function(reject, resolve) {
    return function go(acc) {
      // isSync could be in three possable states
      // * null - unresolved status
      // * true - synchronous future
      // * false - asynchronous future
      var isSync = null;
      var state = util.chainRecNext(acc);
      var onResolve = function(v) {
        // If the `isSync` is still unresolved, we have observed a
        // synchronous future. Otherwise, `isSync` will be `false`.
        if (isSync === null) {
          isSync = true;
          // Store the result for further synchronous processing.
          state = v;
        } else {
          // When we have observed an asynchronous future, we use normal
          // recursion. This is safe because we will be on a new stack.
          (v.isNext ? go : resolve)(v.value);
        }
      };
      while (state.isNext) {
        isSync = null;
        f(util.chainRecNext, util.chainRecDone, state.value).fork(reject, onResolve);
        // If the `isSync` has already resolved to `true` by our `onResolve`, then
        // we have observed a synchronous future. Otherwise it will still be `null`.
        if (isSync === true) {
          continue;
        } else {
          // If the status has not resolved yet, then we have observed an
          // asynchronous or failed future so update status and exit the loop.
          isSync = false;
          return;
        }
      }
      resolve(state.value);
    }(a);
  });
};

// chainReject
// Like chain but operates on the reject instead of the resolve case.
//:: Future a, b => (a -> Future c) -> Future c
Future.prototype.chainReject = function(f) {
  return new Future(function(reject, resolve) {
    return this._fork(
      jail(reject, function(a) { return f(a)._fork(reject, resolve); }),
      function(b) { return resolve(b); }
    );
  }.bind(this));
};

// monad
// A value that implements the Monad specification must also implement the Applicative and Chain specifications.
// see above.

Future.prototype.bimap = function(errFn, successFn) {
  var self = this;
  return new Future(function(reject, resolve) {
    self._fork(
      jail(reject, function(err) { reject(errFn(err)); }),
      jail(reject, function(val) { resolve(successFn(val)); })
    );
  });
};

Future.reject = function(val) {
  return new Future(function(reject) {
    reject(val);
  });
};

Future.prototype.toString = function() {
  return 'Future(' + toString(this._fork) + ')';
};

Future.cache = function(f) {
  var status = 'IDLE';
  var listeners = [];
  var cachedValue;

  var handleCompletion = curry(function(newStatus, cb, val) {
    status = newStatus;
    cachedValue = val;
    cb(val);
    forEach(function(listener) {
      listener[status](cachedValue);
    }, listeners);
  });

  function addListeners(reject, resolve) {
    listeners.push({ REJECTED: reject, RESOLVED: resolve } );
  }

  function doResolve(reject, resolve) {
    status = 'PENDING';
    return f._fork(
      handleCompletion('REJECTED', reject),
      handleCompletion('RESOLVED', resolve)
    );
  }

  return new Future(function(reject, resolve) {

    switch(status) {
      case 'IDLE': doResolve(reject, resolve); break;
      case 'PENDING': addListeners(reject, resolve); break;
      case 'REJECTED': reject(cachedValue); break;
      case 'RESOLVED': resolve(cachedValue); break;
    }

  });
};

module.exports = Future;

},{"./internal/util":38,"ramda/src/curry":4,"ramda/src/forEach":7,"ramda/src/once":27,"ramda/src/toString":28}],32:[function(_dereq_,module,exports){
var compose = _dereq_('ramda/src/compose');
var toString = _dereq_('ramda/src/toString');

var util = _dereq_('./internal/util');

module.exports = IO;

function IO(fn) {
  if (!(this instanceof IO)) {
    return new IO(fn);
  }
  this.fn = fn;
}

IO.prototype['@@type'] = 'ramda-fantasy/IO';

// `f` must return an IO
IO.prototype.chain = function(f) {
  var io = this;
  return new IO(function() {
    var next = f(io.fn.apply(io, arguments));
    return next.fn.apply(next, arguments);
  });
};

//chainRec
IO.chainRec = IO.prototype.chainRec = function(f, i) {
  return new IO(function() {
    var state = util.chainRecNext(i);
    while (state.isNext) {
      state = f(util.chainRecNext, util.chainRecDone, state.value).fn();
    }
    return state.value;
  });
};

IO.prototype.map = function(f) {
  var io = this;
  return new IO(compose(f, io.fn));
};

// `this` IO must wrap a function `f` that takes an IO (`thatIo`) as input
// `f` must return an IO
IO.prototype.ap = function(thatIo) {
  return this.chain(function(f) {
    return thatIo.map(f);
  });
};

IO.runIO = function(io) {
  return io.runIO.apply(io, [].slice.call(arguments, 1));
};

IO.prototype.runIO = function() {
  return this.fn.apply(this, arguments);
};

IO.prototype.of = function(x) {
  return new IO(function() { return x; });
};

IO.of = IO.prototype.of;

IO.prototype.toString = function() {
  return 'IO(' + toString(this.fn) + ')';
};

},{"./internal/util":38,"ramda/src/compose":3,"ramda/src/toString":28}],33:[function(_dereq_,module,exports){
var toString = _dereq_('ramda/src/toString');

var util = _dereq_('./internal/util');


/**
 * A data type that holds a value and exposes a monadic api.
 */

/**
 * Constructs a new `Identity[a]` data type that holds a single
 * value `a`.
 * @param {*} a Value of any type
 * @sig a -> Identity[a]
 */
function Identity(x) {
  if (!(this instanceof Identity)) {
    return new Identity(x);
  }
  this.value = x;
}

Identity.prototype['@@type'] = 'ramda-fantasy/Identity';

/**
 * Applicative specification. Creates a new `Identity[a]` holding the value `a`.
 * @param {*} a Value of any type
 * @returns Identity[a]
 * @sig a -> Identity[a]
 */
Identity.of = function(x) {
  return new Identity(x);
};
Identity.prototype.of = Identity.of;

/**
 * Functor specification. Creates a new `Identity[a]` mapping function `f` onto
 * `a` returning any value b.
 * @param {Function} f Maps `a` to any value `b`
 * @returns Identity[b]
 * @sig @Identity[a] => (a -> b) -> Identity[b]
 */
Identity.prototype.map = function(f) {
  return new Identity(f(this.value));
};

/**
 * Apply specification. Applies the function inside the `Identity[a]`
 * type to another applicative type.
 * @param {Applicative[a]} app Applicative that will apply its function
 * @returns Applicative[b]
 * @sig (Identity[a -> b], f: Applicative[_]) => f[a] -> f[b]
 */
Identity.prototype.ap = function(app) {
  return app.map(this.value);
};

/**
 * Chain specification. Transforms the value of the `Identity[a]`
 * type using an unary function to monads. The `Identity[a]` type
 * should contain a function, otherwise an error is thrown.
 *
 * @param {Function} fn Transforms `a` into a `Monad[b]`
 * @returns Monad[b]
 * @sig (Identity[a], m: Monad[_]) => (a -> m[b]) -> m[b]
 */
Identity.prototype.chain = function(fn) {
  return fn(this.value);
};

// chainRec
Identity.chainRec = Identity.prototype.chainRec = function(f, i) {
  var state = util.chainRecNext(i);
  while (state.isNext) {
    state = f(util.chainRecNext, util.chainRecDone, state.value).get();
  }
  return Identity(state.value);
};

/**
 * Returns the value of `Identity[a]`
 *
 * @returns a
 * @sig (Identity[a]) => a
 */
Identity.prototype.get = function() {
  return this.value;
};

// equality method to enable testing
Identity.prototype.equals = util.getEquals(Identity);

Identity.prototype.toString = function() {
  return 'Identity(' + toString(this.value) + ')';
};

module.exports = Identity;

},{"./internal/util":38,"ramda/src/toString":28}],34:[function(_dereq_,module,exports){
var toString = _dereq_('ramda/src/toString');
var curry = _dereq_('ramda/src/curry');

var util = _dereq_('./internal/util.js');

function Maybe(x) {
  return x == null ? _nothing : Maybe.Just(x);
}

Maybe.prototype['@@type'] = 'ramda-fantasy/Maybe';

function Just(x) {
  this.value = x;
}
util.extend(Just, Maybe);

Just.prototype.isJust = true;
Just.prototype.isNothing = false;

function Nothing() {}
util.extend(Nothing, Maybe);

Nothing.prototype.isNothing = true;
Nothing.prototype.isJust = false;

var _nothing = new Nothing();

Maybe.Nothing = function() {
  return _nothing;
};

Maybe.Just = function(x) {
  return new Just(x);
};

Maybe.of = Maybe.Just;

Maybe.prototype.of = Maybe.Just;

Maybe.isJust = function(x) {
  return x.isJust;
};

Maybe.isNothing = function(x) {
  return x.isNothing;
};

Maybe.maybe = curry(function(nothingVal, justFn, m) {
  return m.reduce(function(_, x) {
    return justFn(x);
  }, nothingVal);
});

// functor
Just.prototype.map = function(f) {
  return this.of(f(this.value));
};

Nothing.prototype.map = util.returnThis;

// apply
// takes a Maybe that wraps a function (`app`) and applies its `map`
// method to this Maybe's value, which must be a function.
Just.prototype.ap = function(m) {
  return m.map(this.value);
};

Nothing.prototype.ap = util.returnThis;

// applicative
// `of` inherited from `Maybe`


// chain
//  f must be a function which returns a value
//  f must return a value of the same Chain
//  chain must return a value of the same Chain
Just.prototype.chain = util.baseMap;

Nothing.prototype.chain = util.returnThis;


//chainRec
Maybe.chainRec = Maybe.prototype.chainRec = function(f, i) {
  var res, state = util.chainRecNext(i);
  while (state.isNext) {
    res = f(util.chainRecNext, util.chainRecDone, state.value);
    if (Maybe.isNothing(res)) {
      return res;
    }
    state = res.value;
  }
  return Maybe.Just(state.value);
};


//
Just.prototype.datatype = Just;

Nothing.prototype.datatype = Nothing;

// monad
// A value that implements the Monad specification must also implement the Applicative and Chain specifications.
// see above.

// equality method to enable testing
Just.prototype.equals = util.getEquals(Just);

Nothing.prototype.equals = function(that) {
  return that === _nothing;
};

Maybe.prototype.isNothing = function() {
  return this === _nothing;
};

Maybe.prototype.isJust = function() {
  return this instanceof Just;
};

Just.prototype.getOrElse = function() {
  return this.value;
};

Nothing.prototype.getOrElse = function(a) {
  return a;
};

Just.prototype.reduce = function(f, x) {
  return f(x, this.value);
};

Nothing.prototype.reduce = function(f, x) {
  return x;
};

Just.prototype.toString = function() {
  return 'Maybe.Just(' + toString(this.value) + ')';
};

Nothing.prototype.toString = function() {
  return 'Maybe.Nothing()';
};

module.exports = Maybe;

},{"./internal/util.js":38,"ramda/src/curry":4,"ramda/src/toString":28}],35:[function(_dereq_,module,exports){
var compose = _dereq_('ramda/src/compose');
var identity = _dereq_('ramda/src/identity');
var toString = _dereq_('ramda/src/toString');
var always = _dereq_('ramda/src/always');


function Reader(run) {
  if (!(this instanceof Reader)) {
    return new Reader(run);
  }
  this.run = run;
}

Reader.run = function(reader) {
  return reader.run.apply(reader, [].slice.call(arguments, 1));
};

Reader.prototype['@@type'] = 'ramda-fantasy/Reader';

Reader.prototype.chain = function(f) {
  var reader = this;
  return new Reader(function(r) {
    return f(reader.run(r)).run(r);
  });
};

Reader.prototype.ap = function(a) {
  return this.chain(function(f) {
    return a.map(f);
  });
};

Reader.prototype.map = function(f) {
  return this.chain(function(a) {
    return Reader.of(f(a));
  });
};

Reader.prototype.of = function(a) {
  return new Reader(function() {
    return a;
  });
};
Reader.of = Reader.prototype.of;

Reader.ask = Reader(identity);

Reader.prototype.toString = function() {
  return 'Reader(' + toString(this.run) + ')';
};

Reader.T = function(M) {
  var ReaderT = function ReaderT(run) {
    if (!(this instanceof ReaderT)) {
      return new ReaderT(run);
    }
    this.run = run;
  };

  ReaderT.lift = compose(ReaderT, always);

  ReaderT.ask = ReaderT(M.of);

  ReaderT.prototype.of = ReaderT.of = function(a) {
    return ReaderT(function() {
      return M.of(a);
    });
  };

  ReaderT.prototype.chain = function(f) {
    var readerT = this;
    return ReaderT(function(e) {
      var m = readerT.run(e);
      return m.chain(function(a) {
        return f(a).run(e);
      });
    });
  };

  ReaderT.prototype.map = function(f) {
    return this.chain(function(a) {
      return ReaderT.of(f(a));
    });
  };

  ReaderT.prototype.ap = function(a) {
    var readerT = this;
    return ReaderT(function(e) {
      return readerT.run(e).ap(a.run(e));
    });
  };

  ReaderT.prototype.toString = function() {
    return 'ReaderT[' + M.name + '](' + toString(this.run) + ')';
  };

  return ReaderT;
};

module.exports = Reader;

},{"ramda/src/always":1,"ramda/src/compose":3,"ramda/src/identity":9,"ramda/src/toString":28}],36:[function(_dereq_,module,exports){
var curry = _dereq_('ramda/src/curry');

var Identity = _dereq_('./Identity');
var Tuple = _dereq_('./Tuple');
var util = _dereq_('./internal/util');


function T(M) {
  function StateT(run) {
    if (!(this instanceof StateT)) {
      return new StateT(run);
    }
    this._run = run;
  }
  StateT.prototype.run = function(s) {
    return this._run(s);
  };
  StateT.prototype.eval = function(s) {
    return Tuple.fst(this.run(s));
  };
  StateT.prototype.exec = function(s) {
    return Tuple.snd(this.run(s));
  };
  StateT.prototype.chain = function(f) {
    var state = this;
    return StateT(function(s) {
      return state._run(s).chain(function(t) {
        return f(Tuple.fst(t))._run(Tuple.snd(t));
      });
    });
  };
  StateT.of = StateT.prototype.of = function(a) {
    return StateT(function (s) {
      return M.of(Tuple(a, s));
    });
  };
  StateT.prototype.ap = util.deriveAp(StateT);
  StateT.prototype.map = util.deriveMap(StateT);
  StateT.tailRec = curry(function(stepFn, init) {
    return StateT(function(s) {
      return M.tailRec(function(t) {
        return stepFn(Tuple.fst(t))._run(Tuple.snd(t)).chain(function (t_) {
          return M.of(Tuple.fst(t_).bimap(
            function(a) { return Tuple(a, Tuple.snd(t_)); },
            function(b) { return Tuple(b, Tuple.snd(t_)); }
          ));
        });
      }, Tuple(init, s));
    });
  });
  StateT.lift = function(ma) {
    return StateT(function(s) {
      return ma.chain(function(a) {
        return M.of(Tuple(a, s));
      });
    });
  };
  StateT.get = StateT(function(s) {
    return M.of(Tuple(s, s));
  });
  StateT.gets = function(f) {
    return StateT(function(s) {
      return M.of(Tuple(f(s), s));
    });
  };
  StateT.put = function(s) {
    return StateT(function(_) {
      return M.of(Tuple(void _, s));
    });
  };
  StateT.modify = function(f) {
    return StateT(function(s) {
      return M.of(Tuple(void 0, f(s)));
    });
  };

  return StateT;
}

var State = T(Identity);
State.T = T;
State.prototype.run = function(s) {
  return this._run(s).value;
};

module.exports = State;

},{"./Identity":33,"./Tuple":37,"./internal/util":38,"ramda/src/curry":4}],37:[function(_dereq_,module,exports){
var toString = _dereq_('ramda/src/toString');
var equals = _dereq_('ramda/src/equals');


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
      throw new TypeError(toString(x) + ' must be a semigroup to perform this operation');
    }
  });
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
  return that instanceof _Tuple && equals(this[0], that[0]) && equals(this[1], that[1]);
};

_Tuple.prototype.toString = function() {
  return 'Tuple(' + toString(this[0]) + ', ' + toString(this[1]) + ')';
};

module.exports = Tuple;

},{"ramda/src/equals":6,"ramda/src/toString":28}],38:[function(_dereq_,module,exports){
var _equals = _dereq_('ramda/src/equals');


module.exports = {

  baseMap: function(f) {
    return f(this.value);
  },

  getEquals: function(constructor) {
    return function equals(that) {
      return that instanceof constructor && _equals(this.value, that.value);
    };
  },

  extend: function(Child, Parent) {
    function Ctor() {
      this.constructor = Child;
    }
    Ctor.prototype = Parent.prototype;
    Child.prototype = new Ctor();
    Child.super_ = Parent.prototype;
  },

  identity: function(x) { return x; },

  notImplemented: function(str) {
    return function() {
      throw new Error(str + ' is not implemented');
    };
  },

  notCallable: function(fn) {
    return function() {
      throw new Error(fn + ' cannot be called directly');
    };
  },

  returnThis: function() { return this; },

  chainRecNext: function(v) {
    return { isNext: true, value: v };
  },

  chainRecDone: function(v) {
    return { isNext: false, value: v };
  },

  deriveAp: function (Type) {
    return function(fa) {
      return this.chain(function (f) {
        return fa.chain(function (a) {
          return Type.of(f(a));
        });
      });
    };
  },

  deriveMap: function (Type) {
    return function (f) {
      return this.chain(function (a) {
        return Type.of(f(a));
      });
    };
  }

};

},{"ramda/src/equals":6}],39:[function(_dereq_,module,exports){
var curryN = _dereq_('ramda/src/curryN');

module.exports = curryN(3, function lift2(f, a1, a2) {
  return a1.map(f).ap(a2);
});

},{"ramda/src/curryN":5}],40:[function(_dereq_,module,exports){
var curryN = _dereq_('ramda/src/curryN');

module.exports = curryN(4, function lift3(f, a1, a2, a3) {
  return a1.map(f).ap(a2).ap(a3);
});

},{"ramda/src/curryN":5}],"/index.js":[function(_dereq_,module,exports){
module.exports = {
  Either: _dereq_('./src/Either'),
  Future: _dereq_('./src/Future'),
  Identity: _dereq_('./src/Identity'),
  IO: _dereq_('./src/IO'),
  lift2: _dereq_('./src/lift2'),
  lift3: _dereq_('./src/lift3'),
  Maybe: _dereq_('./src/Maybe'),
  Reader: _dereq_('./src/Reader'),
  State: _dereq_('./src/State'),
  Tuple: _dereq_('./src/Tuple')
};

},{"./src/Either":30,"./src/Future":31,"./src/IO":32,"./src/Identity":33,"./src/Maybe":34,"./src/Reader":35,"./src/State":36,"./src/Tuple":37,"./src/lift2":39,"./src/lift3":40}]},{},[])("/index.js")
});