module.exports = Reader;

function Reader(run) {
    if (!(this instanceof Reader)) {
        return new Reader(run);
    }
    this.run = run;
}

Reader.run = function(reader) {
    return reader.run.apply(reader, [].slice.call(arguments, 1));
};

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

Reader.ask = Reader(function(a) {
    return a;
});

Reader.prototype.equals = function(that) {
    return this === that ||
    this.run === that.run ||
    Reader.run(this) === Reader.run(that);
};
