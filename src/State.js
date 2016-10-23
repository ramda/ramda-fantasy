var curry = require('ramda/src/curry');
var Z = require('sanctuary-type-classes');

var Identity = require('./Identity');
var Tuple = require('./Tuple');
var util = require('./internal/util');
var patchAll = require('./internal/fl-patch');

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
      return Z.chain(function(t) {
        return f(Tuple.fst(t))._run(Tuple.snd(t));
      }, state._run(s));
    });
  };
  StateT.of = StateT.prototype.of = function(a) {
    return StateT(function (s) {
      return Z.of(M,Tuple(a, s));
    });
  };
  StateT.prototype.ap = util.deriveAp(StateT);
  StateT.prototype.map = util.deriveMap(StateT);
  StateT.tailRec = curry(function(stepFn, init) {
    return StateT(function(s) {
      return M.tailRec(function(t) {
        return Z.chain(function (t_) {
          return Z.of(M,Z.bimap(
            function(a) { return Tuple(a, Tuple.snd(t_)); },
            function(b) { return Tuple(b, Tuple.snd(t_)); },
            Tuple.fst(t_)
          ));
        }, stepFn(Tuple.fst(t))._run(Tuple.snd(t)));
      }, Tuple(init, s));
    });
  });
  StateT.lift = function(ma) {
    return StateT(function(s) {
      return Z.chain(ma, function(a) {
        return Z.of(M, Tuple(a, s));
      });
    });
  };
  StateT.get = StateT(function(s) {
    return Z.of(M, Tuple(s, s));
  });
  StateT.gets = function(f) {
    return StateT(function(s) {
      return Z.of(M, Tuple(f(s), s));
    });
  };
  StateT.put = function(s) {
    return StateT(function(_) {
      return Z.of(M, Tuple(void _, s));
    });
  };
  StateT.modify = function(f) {
    return StateT(function(s) {
      return Z.of(M, Tuple(void 0, f(s)));
    });
  };

  patchAll([StateT, StateT.prototype]);

  return StateT;
}

var State = T(Identity);
State.T = T;
State.prototype.run = function(s) {
  return this._run(s).value;
};

patchAll([State, State.prototype]);

module.exports = State;
