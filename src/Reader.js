var compose = require('ramda/src/compose');
var identity = require('ramda/src/identity');
var toString = require('ramda/src/toString');
var always = require('ramda/src/always');
var Z = require('sanctuary-type-classes');

var patchAll = require('./internal/fl-patch.js');

function Reader(run) {
  if (!(this instanceof Reader)) {
    return new Reader(run);
  }
  this.run = run;
}

Reader.run = function(reader) {
  return reader.run.apply(reader, [].slice.call(arguments, 1));
};

Reader.prototype['@@type'] = 'ramda-fantasy/Reader';

Reader.prototype.chain = function(f) {
  var reader = this;
  return new Reader(function(r) {
    return f(reader.run(r)).run(r);
  });
};

Reader.prototype.ap = function(a) {
  return Z.chain(function(f) {
    return Z.map(f, a);
  }, this);
};

Reader.prototype.map = function(f) {
  return Z.chain(function(a) {
    return Z.of(Reader, f(a));
  }, this);
};

Reader.prototype.of = function(a) {
  return new Reader(function() {
    return a;
  });
};
Reader.of = Reader.prototype.of;

Reader.ask = Reader(identity);

Reader.prototype.toString = function() {
  return 'Reader(' + toString(this.run) + ')';
};

Reader.T = function(M) {
  var ReaderT = function ReaderT(run) {
    if (!(this instanceof ReaderT)) {
      return new ReaderT(run);
    }
    this.run = run;
  };

  ReaderT.lift = compose(ReaderT, always);

  ReaderT.ask = ReaderT(M.of);

  ReaderT.prototype.of = ReaderT.of = function(a) {
    return ReaderT(function() {
      return Z.of(M, a);
    });
  };

  ReaderT.prototype.chain = function(f) {
    var readerT = this;
    return ReaderT(function(e) {
      var m = readerT.run(e);
      return Z.chain(function(a) {
        return f(a).run(e);
      }, m);
    });
  };

  ReaderT.prototype.map = function(f) {
    return Z.chain(function(a) {
      return Z.of(ReaderT, f(a));
    }, this);
  };

  ReaderT.prototype.ap = function(a) {
    var readerT = this;
    return ReaderT(function(e) {
      return Z.ap(readerT.run(e), a.run(e));
    });
  };

  ReaderT.prototype.toString = function() {
    return 'ReaderT[' + M.name + '](' + toString(this.run) + ')';
  };

  patchAll([ReaderT, ReaderT.prototype]);

  return ReaderT;
};

patchAll([Reader, Reader.prototype]);

module.exports = Reader;
