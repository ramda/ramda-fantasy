var R = require('ramda');

module.exports = R.curryN(4, function liftA2(f, a1, a2, a3) {
  return a1.map(f).ap(a2).ap(a3);
});
