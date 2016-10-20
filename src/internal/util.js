var _equals = require('ramda/src/equals');
var Z = require('sanctuary-type-classes');

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
      return Z.chain(function (f) {
        return Z.chain(function (a) {
          return Z.of(Type, f(a));
        }, fa);
      }, this);
    };
  },

  deriveMap: function (Type) {
    return function (f) {
      return Z.chain(function (a) {
        return Z.of(Type, f(a));
      }, this);
    };
  }

};
