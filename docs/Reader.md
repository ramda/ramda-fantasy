# Reader

The `Reader` type is used for providing a shared "environment" to computations.
It is often used as a way of providing configuration or injecting dependencies,
where the responsibility for these concerns is delegated to the outer edges of
an application. You can think of this in much of the same way as how a function
has access to arguments that are provided by the caller of the function. In
fact, the `Reader` type is effectively a wrapper type around a function to
provide the various monad and functor instances.

## Construction

A `Reader` type can be constructed via the single constructor function
`Reader r a :: (r -> a) -> Reader r a`. The function given to the constructor is
responsible for computing some value based on the environment it receives.

```js
const dbReader = Reader(env => env.dbConn);
```

A static `Reader` instance is also available via `Reader.ask` which passes its
environment straight through, providing access to the environment within
functions given to its `chain` method.

```js
const dbReader = Reader.ask.chain(env => Reader.of(configureDb(env.dbConn)));
```

To provided better support for nested monad types such as `Reader r (m a)` where
`m` is some monad type, a monad transformer can be constructed by passing the
nested monad type to the transformer constructor.

```js
// Reader.T :: Monad m => { of: a -> m a } -> ReaderT r m a
const ReaderTMaybe = Reader.T(Maybe);
```

This wires up the various methods available on a monad (`of`, `map`, `ap` and
`chain`) from the outer `ReaderT` instance to the inner monad type, removing the
need to "unpack" each layer of monad instances where the transformer instance is
interacted with.

The static `lift` method on a `ReaderT` type allows for an instance of the inner
monad type to be "lifted" into a `ReaderT` instance, similar to how `of` will
lift an ordinary value into an applicative instance.

```js
const maybe42R = ReaderTMaybe.lift(Just(42)); 
```

## Interaction

Code that requires access to the environment needs to exist within a `Reader`
type. To ensure that code is still composable, `Reader` implements the monad
specification and by extension, applicative and functor too. This allows for
various `Reader` instances to be composed with each other, while also being
able to lift plain functions to operate within the context of the `Reader` type.

```js
/**
 * Env        :: { dbConn: DbConnection, httpClientPool: HttpClientPool }
 * selectOne  :: String -> Table -> Object -> DbConnection -> Future Error DbRow
 * fetchImage :: URL -> HttpClientPool -> Future Error Image
 */

//:: String -> Reader Env (Future Error DbRow)
fetchUser = email => Reader(env =>
  selectOne('email = :email', Users, { email: email }, env.dbConn));

//:: String -> Reader Env (Future Error ImageData)
fetchUserImage = email => Reader.ask.chain(env =>
  fetchUser(email).map(futureUserRow => futureUserRow.chain(userRow =>
    fetchImage(userRow.imageURL, env.httpClientPool))));

//:: Future Error ImageData
fooImageFuture = fetchUserImage('foo@example.com').run({
  dbConn: initDb(),
  httpClientPool: initHttpClientPool
});
```

Alternatively, a `ReaderT` could be used to help declutter some of the nested
`chain` and `map` calls in the `fetchUserImage` function in the example above.

```js
//:: (Env -> Future e a) -> ReaderT Env (Future e) a
App = Reader.T(Future);

//:: String -> ReaderT Env (Future Error) DbRow
fetchUser = email => App(env =>
  selectOne('email = :email', Users, { email: email }, env.dbConn));

//:: String -> ReaderT Env (Future Error) ImageData
fetchUserImage = email => App.ask.chain(env =>
  fetchUser(email).chain(userRow =>
    App.lift(fetchImage(userRow.imageURL, env.httpClientPool))));
```

## Reference

### Constructors

#### `Reader`
```hs
:: (r -> a) -> Reader r a
```
Constructs a `Reader` instance that computes some value `a` using some
environment `r`.

#### `Reader.T`
```hs
:: Monad m => { of: a -> m a } -> (r -> m a) -> ReaderT r m a
```
Constructs a `ReaderT` instance that computes some value `a` within a monad `m`
using some environment `r`.

### Static properties

#### `Reader.ask`
```hs
:: Reader r r
```
A static `Reader` instance that just returns its environment.

#### `ReaderT.ask`
```hs
:: Monad m => ReaderT r m a
```
A static `ReaderT` instance that just returns its environment.

### Static functions

#### `Reader.of`
```hs
:: a -> Reader r a
```
Produces a pure `Reader` instance for the given value.

#### `ReaderT.of`
```hs
:: Monad m => a -> ReaderT r m a
```
Produces a pure `ReaderT` instance for the given value.

#### `ReaderT.lift`
```hs
:: Monad m => m a -> ReaderT r m a
```
Lifts a monad value into a `ReaderT` instance.

### Instance methods

#### `reader.run`
```hs
:: Reader r a ~> r -> a
```
Executes the `Reader` instance with the given environment `r`.

#### `readerT.run`
```hs
:: Monad m => ReaderT r m a ~> r -> m a
```
Executes the `ReaderT` instance with the given environment `r`.

#### `reader.map`
```hs
:: Reader r a ~> (a -> b) -> Reader r b
```
Transforms the result of the computation of the `Reader` instance with the given
function. 

#### `readerT.map`
```hs
:: Monad m => ReaderT r m a ~> (a -> b) -> ReaderT r m b
```
Transforms the result of the computation of the `ReaderT` instance with the
given function.

#### `reader.ap`
```hs
:: Reader r (a -> b) ~> Reader r a -> Reader r b
```
Applies the `a` in the given `Reader` instance to the function in this `Reader`
instance, producing a new `Reader` instance containing the result.

#### `readerT.ap`
```hs
:: Monad m => ReaderT r m (a -> b) ~> ReaderT r m a -> ReaderT r m b
```
Applies the `a` in the given `ReaderT` instance to the function in this
`ReaderT` instance, producing a new `ReaderT` instance containing the result.

#### `reader.chain`
```hs
:: Reader r a ~> (a -> Reader r b) -> Reader r b
```
Produces a new `Reader` instance by applying the provided function with the
value of this `Reader` instance. Both this instance and the instance returned by
the provided function will receive the same environment when run.

#### `readerT.chain`
```hs
:: Monad m => ReaderT r m a ~> (a -> ReaderT r m b) -> ReaderT r m b
```
Produces a new `ReaderT` instance by applying the provided function with the
value of this `ReaderT` instance. Both this instance and the instance returned
by the provided function will receive the same environment when run.
