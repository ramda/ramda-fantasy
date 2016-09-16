var interfaces = {
  semigroup:      ['concat'],
  monoid:         ['concat', 'empty'],
  functor:        ['map'],
  apply:          ['map', 'ap'],
  applicative:    ['map', 'ap', 'of'],
  chain:          ['map', 'ap', 'chain'],
  chainRec:       ['map', 'ap', 'chain', 'chainRec'],
  monad:          ['map', 'ap', 'chain', 'of'],
  extend:         ['extend'],
  comonad:        ['extend', 'extract'],
  foldable:       ['reduce'],
  transformer:    ['lift']
};

var Identity = require('..').Identity;

function correctInterface(type) {
  return function(obj) {
    return interfaces[type].every(function(method) {
      return obj[method] && typeof obj[method] === 'function';
    });
  };
}

function identity(x) { return x; }

module.exports = function(eq) {
  return {
    semigroup: {
      iface: correctInterface('semigroup'),
      associative: function (a, b, c) {
        return eq(a.concat(b).concat(c), a.concat(b.concat(c)));
      }
    },

    functor: {
      iface: correctInterface('functor'),
      id: function (obj) {
        return eq(obj, obj.map(identity));
      },
      compose: function (obj, f, g) {
        return eq(
          obj.map(function (x) {
            return f(g(x));
          }),
          obj.map(g).map(f)
        );
      }
    },

    apply: {
      iface: correctInterface('apply'),
      compose: function (a, u, v) {
        return eq(
          a.ap(u.ap(v)),
          a.map(function (f) {
            return function (g) {
              return function (x) {
                return f(g(x));
              };
            };
          }).ap(u).ap(v)
        );
      }
    },

    applicative: {
      iface: correctInterface('applicative'),
      id: function (obj, obj2) {
        return eq(obj.of(identity).ap(obj2), obj2);
      },
      homomorphic: function (obj, f, x) {
        return eq(obj.of(f).ap(obj.of(x)), obj.of(f(x)));
      },
      interchange: function (obj1, obj2, x) {
        return eq(
          obj2.ap(obj1.of(x)),
          obj1.of(function (f) {
            return f(x);
          }).ap(obj2)
        );
      }
    },

    chain: {
      iface: correctInterface('chain'),
      associative: function (obj, f, g) {
        return eq(
          obj.chain(f).chain(g),
          obj.chain(function (x) {
            return f(x).chain(g);
          })
        );
      }
    },
    chainRec: {
      iface: correctInterface('chainRec'),
      equivalence: function (T, p, d, n, x) {
        return eq(
          T.chainRec(function(next, done, v) {
            return p(v) ? d(v).map(done) : n(v).map(next);
          }, x),
          (function step(v) {
            return p(v) ? d(v) : n(v).chain(step);
          }(x))
        );
      }
    },

    monad: {
      iface: correctInterface('monad')
    },

    extend: {
      iface: correctInterface('extend'),
      associative: function(obj, f, g) {
        return eq(
          obj.extend(g).extend(f),
          obj.extend(function(_obj) {
            return f(_obj.extend(g));
          })
        );
      }
    },

    comonad: {
      iface: correctInterface('comonad'),
      leftIdentity: function (obj) {
        return eq(obj.extend(function(_obj) { return _obj.extract(); }), obj);
      },
      rightIdentity: function (obj, f) {
        return eq(obj.extend(f).extract(), f(obj));
      }
    },

    foldable: {
      iface: correctInterface('foldable')
    },

    transformer: {
      iface: function (T) {
        return correctInterface('transformer')(T(Identity)) &&
          correctInterface('monad')(T(Identity)(identity));
      },
      id: function (transformer) {
        var T = transformer(Identity);
        return eq(T.lift(Identity.of(1)), T.of(1));
      },
      associative: function (transformer) {
        var T = transformer(Identity);
        var m = Identity(1);
        var f = function (x) {
          return Identity(x * x);
        };
        return eq(
          T.lift(m.chain(f)),
          T.lift(m).chain(function (x) {
            return T.lift(f(x));
          })
        );
      }
    }
  };
};
