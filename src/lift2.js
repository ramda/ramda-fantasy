var curryN = require('ramda/src/curryN');

module.exports = curryN(3, function lift2(f, a1, a2) {
  return a1.map(f).ap(a2);
});
