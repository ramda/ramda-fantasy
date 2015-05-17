var lift3 = require('../src/lift3');
var Identity = require('../src/Identity');
var R = require('ramda');
var assert = require('assert');

describe('lift3', function() {

  var combine3 = R.curry(function(a, b, c) {
    return [a, b, c].join(' ');
  });

  var i1 = Identity.of('foo');
  var i2 = Identity.of('bar');
  var i3 = Identity.of('baz');

  it('lifts the values of three applys into a curried function', function() {
    var result = lift3(combine3, i1, i2, i3);
    assert.equal(true, Identity.of('foo bar baz').equals(result));
  });

  it('is itself curried', function() {
    var step1 = lift3(combine3);
    var step2 = step1(i1);
    var step3 = step2(i2);
    var result = step3(i3);
    assert.equal(true, Identity.of('foo bar baz').equals(result));
  });

});
