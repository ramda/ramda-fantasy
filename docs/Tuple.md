# Tuple

A `Tuple` is a simple data type that represents two types of values at the same
time. It is typically used to pass two values around without needing to
introduce some adhoc data type, such as the accumulating state of an operation
along with the previous result, or coupling an ID along with a set of values.

Note that while other libraries and languages may offer tuples of varying sizes,
the `Tuple` currently offered here is restricted to holding two values.

## Construction

`Tuple` consists of a single constructor that accepts the two values to store in
the tuple `Tuple :: a -> b -> Tuple a b`. It is worth highlighting that the two
values associated with the `Tuple` may be completely different types.

## Interaction

The values of a `Tuple` instance can be accessed by passing the `Tuple` to
`Tuple.fst` or `Tuple.snd` for the first and second values respectively.

## Reference

### Constructors

#### `Tuple`
```hs
:: (a, b) -> Tuple a b
```

### Static functions

#### `Tuple.fst`
```hs
:: Tuple a b -> a
```
Returns the first element of a given `Tuple`.

#### `Tuple.snd`
```hs
:: Tuple a b -> b
```
Returns the second element of a given `Tuple`.

### Instance methods

#### `tuple.concat`
```hs
:: (Semigroup a, Semigroup b) => Tuple a b ~> Tuple a b -> Tuple a b
```
Joins the `Tuple` instance with the given `Tuple` by concatenating the first
elements of each `Tuple` to produce the first element of the returned `Tuple`
and the second elements concatenated together to produce the returned second
element. To ensure the elements can be concatenated together, both types of the
`Tuple` elements _must_ satisfy the `Semigroup` spec.

#### `tuple.map`
```hs
:: Tuple a b ~> (b -> c) -> Tuple a c
```
Transforms the second element of the `Tuple` instance by applying the given
function over the value.

#### `tuple.ap`
```hs
:: Semigroup a => Tuple a (b -> c) ~> Tuple a b -> Tuple a c
```
Transforms the second element of the given `Tuple` by applying the function held
in the second element of the `Tuple` instance. As this leaves both of the first
elements unmodified, the two must be combined in some way to produce a single
value to be stored in the first element of the returned `Tuple`. This is done by
requiring that the type of value in the first element satsifies the `Semigroup`
spec, with the resulting value determined by concatenating the two values
together.

#### `tuple.equals`
```hs
:: Tuple a b ~> * -> Boolean
```
Determines whether the given `Tuple` is equal to the `Tuple` instance. This is
determined by comparing the equality of values of the first element of each
`Tuple`, then comparing the values of the second element of each.

#### `tuple.toString`
```hs
:: Tuple a b ~> () -> String
```
Returns a string representation of the `Tuple` instance.
