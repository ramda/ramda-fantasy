var assert = require('assert');
var Future = require('../src/Future');

Future.prototype.equals = function(b) {
  var isEqual;
  this.fork(function(e1) {
    b.fork(function(e2) {
      isEqual = e1 === e2;
    }, function() {
      assert.fail(null, e1, 'Futures not equal: f1 failed, f2 did not', '===');
    })
  }, function(v1) {
    b.fork(function() {
      assert.fail(null, v1, 'Futures not equal: f1 succeeded, f2 did not', '===');
    }, function(v2) {
      isEqual = v1 === v2;
    });
  });
  return isEqual;
};

describe('Future', function() {

    it('should equal another future', function() {
      var f1 = Future.of(2);
      var f2 = Future.of(2);
      assert.equal(true, f1.equals(f2));
    });

});
