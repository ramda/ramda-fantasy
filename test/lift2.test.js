var lift2 = require('../src/lift2');
var Identity = require('../src/Identity');
var R = require('ramda');
var assert = require('assert');

describe('lift2', function() {

  var i1 = Identity.of(1);
  var i2 = Identity.of(2);

  it('lifts the values of two applys into a curried function', function() {
    var result = lift2(R.add, i1, i2);
    assert.equal(true, Identity.of(3).equals(result));
  });

  it('is itself curried', function() {
    var step1 = lift2(R.add);
    var step2 = step1(i1);
    var result = step2(i2);
    assert.equal(true, Identity.of(3).equals(result));
  });

});
