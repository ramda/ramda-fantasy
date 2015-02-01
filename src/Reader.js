module.exports = Reader;

function Reader(fn) {
    if (!(this instanceof Reader)) {
        return new Reader(fn);
    }
    this.fn = fn;
}

Reader.run = function(reader) {
    return reader.run.apply(reader, [].slice.call(arguments, 1));
};

Reader.prototype.run = function() {
    return this.fn.apply(this, arguments);
};

Reader.prototype.chain = function(f) {
    var reader = this;
    return new Reader(function() {
        return f(reader.fn()).fn();
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
    this.fn === that.fn ||
    Reader.run(this) === Reader.run(that);
};
