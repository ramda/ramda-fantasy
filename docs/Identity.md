# Identity

The `Identity` type is a very simple type that has no interesting side effects
and is effectively just a container of some value. So why does it exist? The
`Identity` type is often used as the base monad of a monad transformer when no
other behaviour is required. For example, `Reader.T(Identity)` is effectively
the same as an ordinary `Reader`.

## Construction

The `Identity` type consists of a single constructor.

```js
const Identity = require('ramda-fantasy').Identity;
const five = Identity(5);
```

Alternatively, as `Identity` implements the `Applicative` interface,
`Identity.of` could also be used.

## Interaction

An `Identity` instance can be transformed via the methods necessary to implement
`Functor`, `Ap` and `Chain` (see their corresponding reference below).

The value contained within an `Identity` instance can be accessed by calling the
`get` method of the instance.

## Reference

### Constructors

#### `Identity`
```hs
:: a -> Identity a
```

### Static functions

#### `Identity.of`
```hs
:: a -> Identity a
```

### Instance methods

#### `identity.map`
```hs
:: Identity a ~> (a -> b) -> Identity b
```
Transforms the value contained within the `Identity` instance with the provided
function.

#### `identity.ap`
```hs
:: Identity (a -> b) ~> Identity a -> Identity b
```
Transforms the value within the provided `Identity` instance using the function
contained withing the instance of this `Identity`.

#### `identity.chain`
```hs
:: Identity a ~> (a -> Identity b) -> Identity b
```
Produces a new `Identity` instance by applying the value of this `Identity` to
the provided function.
