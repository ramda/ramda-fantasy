var fl = require('./fl.js');
var fixedAp = function(f) {
  return f.ap(this);
};

var patch = function(obj){
  return Object.keys(fl).forEach(function(key) {
    if (typeof obj[key] === 'function') {
      if (key === 'ap') {
        obj[fl[key]] = fixedAp;
      } else {
        obj[fl[key]] = obj[key];
      }
    }
  });
};

var patchAll = function(objs){
  return objs.forEach(patch);
};

module.exports = patchAll;
