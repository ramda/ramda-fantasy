var R = require('ramda');
var jsv = require('jsverify');
var types = require('./types')(function(sA, sB) {
  return R.equals(sA.run(0), sB.run(0));
});

var Identity = require('..').Identity;
var State = require('..').State;
var Tuple = require('..').Tuple;

function tupleArb(firstArb, secondArb) {
  return jsv.pair(firstArb, secondArb).smap(
    function (pair) { return Tuple(pair[0], pair[1]); },
    function (t) { return [Tuple.fst(t), Tuple.snd(t)]; },
    R.toString
  );
}

function stateArb(evalArb, execArb) {
  return jsv.fn(tupleArb(evalArb, execArb)).smap(
    function (f) { return State(R.compose(Identity, f)); },
    function (s) { return s.run; }
  );
}

function identityArb(valueArb) {
  return valueArb.smap(
    Identity,
    function (i) { return i.value; },
    R.toString
  );
}

var fnNatArb = jsv.fn(jsv.nat);
var stateNatArb = stateArb(jsv.nat, jsv.nat);
var stateFnNatArb = stateArb(fnNatArb, jsv.nat);
var stateConstructorArb = jsv.fn(identityArb(tupleArb(jsv.nat, jsv.nat)));

describe('State', function() {
  it('returns a Tuple of the state and result via state.run', function () {
    jsv.assert(jsv.forall(jsv.nat, stateConstructorArb, function (s, fn) {
      return R.equals(State(fn).run(s), fn(s).value);
    }));
  });

  it('returns the result via state.eval', function () {
    jsv.assert(jsv.forall(jsv.nat, stateConstructorArb, function (s, fn) {
      return R.equals(State(fn).eval(s), Tuple.fst(fn(s).value));
    }));
  });

  it('returns the state via state.exec', function () {
    jsv.assert(jsv.forall(jsv.nat, stateConstructorArb, function (s, fn) {
      return R.equals(State(fn).exec(s), Tuple.snd(fn(s).value));
    }));
  });

  it('retrieves the current state via the State.get instance', function () {
    jsv.assert(jsv.forall(jsv.nat, function (s) {
      return R.equals(State.get.eval(s), s);
    }));
  });

  it('retrieves a transformed state via State.gets', function () {
    jsv.assert(jsv.forall(jsv.nat, jsv.fn(jsv.nat), function (s, fn) {
      return R.equals(State.gets(fn).eval(s), fn(s));
    }));
  });

  it('stores the given state via State.put', function () {
    jsv.assert(jsv.forall(jsv.nat, jsv.nat, function (s1, s2) {
      return R.equals(State.put(s1).exec(s2), s1);
    }));
  });

  it('modifies the stored state via State.modify', function () {
    jsv.assert(jsv.forall(jsv.nat, jsv.fn(jsv.nat), function (s, fn) {
      return State.modify(fn).exec(s) === fn(s);
    }));
  });

  it('is a Functor', function () {
    var fTest = types.functor;
    jsv.assert(jsv.forall(stateNatArb, fTest.iface));
    jsv.assert(jsv.forall(stateNatArb, fTest.id));
    jsv.assert(jsv.forall(stateNatArb, fnNatArb, fnNatArb, fTest.compose));
  });

  it('is an Apply', function () {
    var aTest = types.apply;
    jsv.assert(jsv.forall(stateFnNatArb, stateFnNatArb, stateNatArb, aTest.compose));
    jsv.assert(jsv.forall(stateNatArb, aTest.iface));
  });

  it('is an Applicative', function () {
    var aTest = types.applicative;
    jsv.assert(jsv.forall(stateNatArb, aTest.iface));
    jsv.assert(jsv.forall(stateNatArb, stateNatArb, aTest.id));
    jsv.assert(jsv.forall(stateNatArb, fnNatArb, jsv.nat, aTest.homomorphic));
    jsv.assert(jsv.forall(stateNatArb, stateFnNatArb, jsv.nat, aTest.interchange));
  });

  it('is a Chain', function () {
    var cTest = types.chain;
    var fnEArb = jsv.fn(stateNatArb);
    jsv.assert(jsv.forall(stateNatArb, cTest.iface));
    jsv.assert(jsv.forall(stateNatArb, fnEArb, fnEArb, cTest.associative));
  });

  it('is a Monad', function () {
    jsv.assert(jsv.forall(stateNatArb, types.monad.iface));
  });
});
