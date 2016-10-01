var curryN = require('ramda/src/curryN');

module.exports = curryN(4, function lift3(f, a1, a2, a3) {
  return a1.map(f).ap(a2).ap(a3);
});
