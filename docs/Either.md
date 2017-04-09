# Either

The `Either` type is very similar to the `Maybe` type, in that it is often used
to represent the notion of failure in some way. The difference between the two
is that an error represented with an `Either` can hold some value (perhaps an
exception or error message), while `Maybe` can only indicate that absence of
some value.

While the `Either` type is often used to represent potential errors, there is
nothing restricting it to this purpose. It is therefore perhaps more appropriate
to simply think of `Either` as a representation of two possible types of values,
sometimes referred to as the _disjoint union_, or _coproduct_ of two types.

## Construction

The `Either` type consists of two constructors, `Left :: a -> Either a b` and
`Right :: b -> Either a b`. When an `Either` type is used to represent the
possibility of an error, `Left` is typically used to hold the error value and
`Right` holds the "successful" value (as a mnemonic, you can think of `Right` as
being _the right_ value).

It is worth highlighting that the types of the value stored in an `Left` does
not have to be the same type as that in the `Right` of the same `Either`. This
is the reason why it is documented as having two type parameters `Either a b`,
where `a` represents the type contained within the `Left` and `b` for the value
contained in the `Right`.

## Interaction

In order to satisfy a number of laws relating to the implemented interfaces,
only a single type parameter can be used as the argument of the various
functions. For this reason, `Either` is _right-biased_, meaning methods such as
`map`, `ap` and `chain` will only call the given function for a `Right` instance
while a `Left` will simply pass the instance straight through, ignoring the
provided function.

Aside from the transformation methods mentioned above, `Either.either` can also
be used to extract the value from an `Either` type, which takes a function to
handle the type of value within the `Left` and another function to handle the
type contained in the `Right`. Only one of these functions will be called
depending on the constructor containing the value.

## Reference

### Constructors

#### `Either.Left`
```hs
:: a -> Either a b
```
Constructs a `Left` instance of `Either`. This is often used to represent a
failure.

#### `Either.Right`
```hs
:: b -> Either a b
```
Constructs a `Right` instance of `Either`. This is often used to represent a
success where there is a possibility of failure.

### Static functions

#### `Either.either`
```hs
:: (a -> c) -> (b -> c) -> Either a b -> c
```
Used to extract the value out of an `Either` by providing a function to handle
the types of values contained in both `Left` and `Right`.

#### `Either.of`
```hs
:: b -> Either a b
```
Creates a pure instance of an `Either`. This is effectively a `Right`
constructor.

#### `Either.isLeft`
```hs
:: Either a b -> Boolean
```
Returns `true` if the given `Either` instance is a `Left`, otherwise `false`.

#### `Either.isRight`
```hs
:: Either a b -> Boolean
```
Returns `true` if the given `Either` instance is a `Right`, otherwise `false`.

### Instance methods

#### `either.map`
```hs
:: Either a b ~> (b -> c) -> Either a c
```
Modifies the value contained in a `Right` with the provided function. If the
instance is a `Left`, the value is left unmodified.

#### `either.ap`
```hs
:: Either a (b -> c) ~> Either a b -> Either a c
```
Applies the function contained in the instance of a `Right` to the value
contained in the provided `Right`, producing a `Right` containing the result. If
the instance is `Left`, the result will be the `Left` instance. If the
instance is `Right` and the provided either is `Left`, the result will be the
provided `Left`.

#### `either.chain`
```hs
:: Either a b ~> (b -> Either a c) -> Either a c
```
Applies the provided function to the value contained in a `Right` instance,
resulting in the return value of that function. If the instance is a `Left`, the
function is ignored and the `Left` instance is returned unmodified.

#### `either.extend`
```hs
:: Either a b ~> (Either a b -> c) -> Either a c
```
Applies the provided function to the `Right` instance, returning a `Right`
containing the result of the function application. If the instance is a `Left`,
the function is ignored and the `Left` instance is returned unmodified.

#### `either.bimap`
```hs
:: Either a b ~> (a -> c) -> (b -> d) -> Either c d
```
Transforms an `Either` by applying the first function to the contained value if
the instance is a `Left`, or the second function if the instance is a `Right`.

#### `either.equals`
```hs
:: Either a b ~> * -> Boolean
```
Determines whether the provided value is equal to this instance, ensuring both
are of the same constructor and both contain equal values.

#### `either.toString`
```hs
:: Either a b ~> () -> String
```
Returns a string representation of the `Either` instance.

#### `either.either`
```hs
:: Either a b ~> (a -> c) -> (b -> c) -> c
```
Used to extract the value out of the `Either` by providing a function to handle
the types of values contained in both `Left` and `Right`.
