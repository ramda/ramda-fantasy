# Maybe

The `Maybe` type represents the possibility of some value or nothing. It is
often used where `null` traditionally would to represent the absence of a value.
The advantage of using a `Maybe` type over `null` is that it is both composable
and requires the developer to explicitly acknowledge the potential absence of a
value, helping to avoid the existence of null pointer exceptions.

## Construction

The `Maybe` type consists of two constructors, `Just :: a -> Maybe a` and
`Nothing :: () -> Maybe a`, representing the existence and absence of some type
`a` respectively.

```js
const M       = require('ramda-fantasy').Maybe;
const Just    = M.Just;
const Nothing = M.Nothing;

const safeDiv = R.curry((n, d) => d === 0 ? Nothing() : Just(n / d));
const lookup = R.curry((k, obj) => k in obj ? Just(obj[k]) : Nothing());
```

## Interaction

Once an instance of a `Maybe` type is obtained, there are a number of ways the
contained value can be accessed if it exists, while ensuring the `Nothing` case
is handled.

```js
// getOrElse :: Maybe a ~> a -> a -- provide a default value if Nothing
lookup('foo', { foo: 'bar' }).getOrElse('baz'); // 'bar'
lookup('foo', { abc: 'bar' }).getOrElse('baz'); // 'baz'

// maybe :: b -> (a -> b) -> Maybe a -> b -- transform the value if it exists
//                                        -- with the provided function,
//                                        -- otherwise return the default value
plus1or0 = M.maybe(0, R.inc);
plus1or0(safeDiv(42, 2)); // 22
plus1or0(safeDiv(42, 0)); // 0
```

It is quite often useful to transform the potential value of a `Maybe` while
deferring the extraction until later in the program. The two functions, `map`
and `chain`, exist to support this behaviour. Both of these functions are
somewhat similar in that neither can transform a `Nothing` into a `Just`, though
`chain` is considered more powerful as it allows a function to transform a
`Just` into a `Nothing`, while `map` can only transform the value contained
within a `Just`.

```js
// map :: Maybe a ~> (a -> b) -> Maybe b
safeDiv(42, 2).map(R.inc); // Maybe(22)
safeDiv(42, 0).map(R.inc); // Nothing

// chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
lookup('a', { a: { b: 'foo' }}).chain(lookup('b')); // Just('foo')
lookup('a', { a: {}}).chain(lookup('b'));           // Nothing
lookup('a', {}).chain(lookup('b'));                 // Nothing
```

## Reference

### Constructors

#### `Maybe.Just`
```hs
:: a -> Maybe a
```
Constructs a `Maybe` instance that represents the existence of some value.

#### `Maybe.Nothing`
```hs
:: () -> Maybe a
```
Constructs a `Maybe` instance that represents the absence of a value.

### Static functions

#### `Maybe.maybe`
```hs
:: b -> (a -> b) -> Maybe a -> b
```
Transforms the value of a `Just` with the provided function, or returns the
default value if a `Nothing` is received.

#### `Maybe.of`
```hs
:: a -> Maybe a
```
Produces a pure `Maybe` instance of a given value. Effectively the `Just`
constructor.

#### `Maybe.isJust`
```hs
:: Maybe a -> Boolean
```
Returns `true` if the given `Maybe` instance is a `Just`, otherwise `false`.

#### `Maybe.isNothing`
```hs
:: Maybe a -> Boolean
```
Returns `true` if the given `Maybe` instance is a `Nothing`, otherwise `false`.

#### `Maybe.toMaybe`
```hs
:: a? -> Maybe a
```
Returns `Nothing` for a `null`/`undefined` value, otherwise a `Just` of the
value for any other value.

### Instance methods

#### `maybe.getOrElse`
```hs
:: Maybe a ~> a -> a
```
Returns the value if the instance is a `Just`, otherwise the provided default
value will be returned.

#### `maybe.map`
```hs
:: Maybe a ~> (a -> b) -> Maybe b
```
Transforms the value of a `Just` with the provided function, returning a new
`Just`. If `Nothing` is received, `Nothing` will be returned.

#### `maybe.ap`
```hs
:: Maybe (a -> b) ~> Maybe a -> Maybe b
```
Applies the function contained in the first `Just` to the value of the second
`Just`, returning a `Just` of the result. If either of the arguments are
`Nothing`, the result will be `Nothing`.

#### `maybe.chain`
```hs
:: Maybe a ~> (a -> Maybe b) -> Maybe b
```
Returns the result of applying the provided function to the value contained in
the `Just` instance. If the instance is a `Nothing`, then a `Nothing` is
returned.

#### `maybe.reduce`
```hs
:: Maybe a ~> (b -> a -> b) -> b -> b
```
Returns the result of applying the provided function to the initial value and
the value of the `Just`. If the instance is a `Nothing`, then the initial value
is returned instead.

#### `maybe.equals`
```hs
:: Maybe a ~> * -> Boolean
```
Returns true if both the instance and the provided value are `Nothing`, or if
the instance is a `Just` and the provided value is a `Just`, where both
contained values are also considered equal as determined by `R.equals`.
Otherwise `false` is returned.

#### `maybe.toString`
```hs
:: Maybe a ~> () -> String
```
Returns a string representation of the instance.
