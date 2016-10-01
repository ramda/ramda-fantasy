var compose = require('ramda/src/compose');
var identity = require('ramda/src/identity');
var toString = require('ramda/src/toString');
var always = require('ramda/src/always');


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
  return this.chain(function(f) {
    return a.map(f);
  });
};

Reader.prototype.map = function(f) {
  return this.chain(function(a) {
    return Reader.of(f(a));
  });
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
      return M.of(a);
    });
  };

  ReaderT.prototype.chain = function(f) {
    var readerT = this;
    return ReaderT(function(e) {
      var m = readerT.run(e);
      return m.chain(function(a) {
        return f(a).run(e);
      });
    });
  };

  ReaderT.prototype.map = function(f) {
    return this.chain(function(a) {
      return ReaderT.of(f(a));
    });
  };

  ReaderT.prototype.ap = function(a) {
    var readerT = this;
    return ReaderT(function(e) {
      return readerT.run(e).ap(a.run(e));
    });
  };

  ReaderT.prototype.toString = function() {
    return 'ReaderT[' + M.name + '](' + toString(this.run) + ')';
  };

  return ReaderT;
};

module.exports = Reader;
