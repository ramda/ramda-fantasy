var R = require('ramda');

function genFn(f, boundArgs, self) {
  function _Fn() {
    var args = boundArgs.concat(Array.prototype.slice.call(arguments, 0));
    if (args.length >= f.length) {
      return f.apply(self || this, args);
    } else {
      return genFn(f, args, self || this);
    }
  }

  var properties = R.merge(Fn.prototype, {
    '@@Fn/length': f['@@Fn/length'] || f.length,
    '@@Fn/name':   f['@@Fn/name'] || f.name || '?',
    '@@Fn/args':   boundArgs
  });

  return R.reduce(function(_Fn, prop) {
    _Fn[prop[0]] = prop[1];
    return _Fn;
  }, _Fn, R.toPairs(properties));
}

function Fn(f) {
  return genFn(f, []);
}

Fn.prototype.constructor = Fn;

// Semigroup
Fn.prototype.concat = Fn(function (g, x) {
  return this(x).concat(g(x));
});

// Monoid
Fn.prototype.empty = Fn.empty = Fn(function (x) {
  return x.empty();
});

// Functor
Fn.prototype.map = Fn(function (g, x) {
  return g(this(x));
});

// Monad
Fn.prototype.chain = Fn(function (g, x) {
  return g(this(x))(x);
});

// Applicative
Fn.prototype.of = Fn.of = Fn(function (x, _) {
  // jshint unused:false
  return x;
});

// Apply
Fn.prototype.ap = Fn(function (g, x) {
  return this(x)(g(x));
});

// Profunctor
Fn.prototype.dimap = Fn(function (fore, hind, x) {
  return hind(this(fore(x)));
});

// Semigroupoid
Fn.prototype.compose = Fn(function (g, x) {
  return this(g(x));
});

Fn.prototype.toString = Fn(function () {
  var remaining = this['@@Fn/length'] - this['@@Fn/args'].length;
  var placeholders = Array.apply(null, Array(remaining)).map(function () { return '_'; });
  var argsString = this['@@Fn/args'].concat(placeholders).join(', ');
  return 'Fn[' + this['@@Fn/name'] + '](' + argsString + ')';
});

module.exports = Fn;
