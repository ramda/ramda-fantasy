# Future

The `Future` type is used to represent some future, often asynchronous,
action that may potentially fail. It is similar to the native JS `Promise` type,
however the computation of a `Promise` is executed immediately, while the
execution of a `Future` instance is delayed until explicitly requested.

## Construction

The `Future` type consists of a single constructor that accepts a function which
must accept the two continuation functions used to resolve or reject the
`Future` instance: `Future :: ((e -> (), a -> ()) -> ()) -> Future e a`.

```js
delayed = (ms, val) => Future((reject, resolve) =>
  ms > 1000 ? reject(Error('Delay too long'))
            : setTimeout(() => resolve(val), ms));
```

## Interaction

Once a `Future` instance has been created, the various methods attached to the
instance can be used to instruct further transformations to take place after
the `Future` has been resolved or rejected. It is important to note that nothing
is actually executed until the `fork` method is eventually called.

The `map`, `ap` and `chain` functions can be used to transform resolved values
of a `Future` instance, while `chainReject` can be used to transform or recover
from a rejected value.

```js
//:: String -> Future Error [String]
ls = path => Future((reject, resolve) =>
  fs.readdir(path, (err, files) => err ? reject(err) : resolve(files)));

//:: String -> Future Error String
cat = file => Future((reject, resolve) =>
  fs.readFile(file, 'utf8', (err, data) => err ? reject(err) : resolve(data)));

//:: String -> Future Error String
catDir = dir => ls(dir).chain(R.traverse(Future.of, cat)).map(R.join('\n'));
```

To execute a `Future` instance, the `fork` method must be called with an
`onRejected` and `onResolved` handler functions. If `fork` is called multiple
times, the action described by the `Future` instance will be invoked multiple
times. If desired, a `Future` instance can be given to `Future.cache` which
returns a new instance that ensures the action will only ever be invoked once,
with the cached resolved or rejected value being used for subsequent calls to
`fork`.

```js
catDir('./src').fork(err => console.error(err), data => console.log(data));
```

## Reference

### Constructors

#### `Future`
```hs
:: ((e -> (), a -> ()) -> ()) -> Future e a
```
Constructs a `Future` instance that represents some action that may possibly
fail.

### Static methods

#### `Future.of`
```hs
:: a -> Future e a
```
Creates a `Future` instance that resolves to the provided value.

#### `Future.reject`
```hs
:: e -> Future e a
```
Creates a `Future` instance that rejects with the provided value.

#### `Future.cache`
```hs
:: Future e a -> Future e a
```
Creates a new `Future` instance from the provided `Future` instance, where the
resolved or rejected value is cached for subsequent calls to `fork`.

### Instance methods

#### `future.fork`
```hs
:: Future e a ~> (e -> ()) -> (a -> ()) -> ()
```
Executes the actions described by the `Future` instance, calling the first
argument with the rejected value if the instance is rejected or the second
argument with the resolved value if the instance is resolved.

#### `future.map`
```hs
:: Future e a ~> (a -> b) -> Future e b
```
Transforms the resolved value of this `Future` instance with the given function.
If the instance is rejected, the provided function is not called.

#### `future.ap`
```hs
:: Future e (a -> b) ~> Future e a -> Future e b
```
Applies the resolved function of this `Future` instance to the resolved value of
the provided `Future` instance, producing a resolved `Future` instance of the
result. If either `Future` is rejected, then the returned `Future` instance will
be rejected with that value. When `fork` is called on the returned `Future`
instance, the actions of this `Future` instance and the provided `Future`
instance will be executed in parallel.

#### `future.chain`
```hs
:: Future e a ~> (a -> Future e b) -> Future e b
```
Calls the provided function with the resolved value of this `Future` instance,
returning the new `Future` instance. If either `Future` instance is rejected,
the returned `Future` instance will be rejected with that value.

#### `future.chainReject`
```hs
:: Future e a ~> (e -> Future e b) -> Future e b
```
If this `Future` instance is rejected, the provided function will be called with
the rejected value, where a new `Future` instance must be returned. This can
be used to recover from a rejected `Future` instance. If this `Future` instance
is resolved, the provided function will be ignored.

#### `future.bimap`
```hs
:: Future e a ~> (e -> f) -> (a -> b) -> Future f b
```
Uses the provided functions to transform this `Future` instance when it becomes
rejected or resolved, respectively.
