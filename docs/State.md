# State

The `State` type can be used to store some state along with a computation.

## Construction

`State` instances should be obtained via the `get`, `gets`, `put`, and `modify`
static properties on the `State` object. These instances describe the different
ways to access and modify the stateful computation that will eventually be
evaluated and are described in further detail below.

A `State` transformer is also available via `State.T` which can be used to
extend some monad with stateful behaviour.

## Interaction

`State` instances are primarily interacted with and composed via the `chain`
method of the various static instances available on the `State` type object. To
access the current state, `State.get` is a static instance that can be used to
provide the state to the `chain`, `ap` and `map`. Similarly, `State.gets(fn)`
can provide the state transformed by the provided `fn` function. To change the
state of the computation, `State.put(newValue)` can be used to replace the
existing state with `newValue`. The current state can also be transformed by
providing a transformation function to `State.modify(transformFn)`.

Once a `State` instance is defined, an initial seed state can be provided to
either the `eval` or `exec` methods to evaluate the computation and return the
result of the computation or the final state, respectively. Alternatively, the
`run` method can be called to return both the result and the final state within
a `Tuple` instance.

```js
// An example deterministic pseudorandom number generator
// see: https://en.wikipedia.org/wiki/Linear_congruential_generator

// type RNG a = State Integer a

// rng :: RNG Float
const rng = State.get.chain(seed => {
  const newSeed = (seed * 1103515245 + 12345) & 0x7FFFFFFF;
  const randVal = (newSeed >>> 16) / 0x7FFF;
  return State.put(newSeed).map(_ => randVal);
});

rng.eval(42); // From initial seed of 42: 0.5823236793115024
rng.eval(42); // Repeating produces the same value: 0.5823236793115024
rng.exec(42); // `exec` returns the next seed: 1250496027
rng.eval(1250496027); // A different seed: 0.5198217719046602

// Chain together to pass the new seed to the next RNG
// pair :: RNG a -> RNG (Tuple a a)
const pair = rng => rng.chain(a => rng.chain(b => State.of(Tuple(a, b))));

pair(rng).eval(42); // Tuple(0.5823236793115024, 0.5198217719046602)

// Map to produce transformed random values from 1 to 6
// rollDie :: RNG Integer
const rollDie = rng.map(n => Math.ceil(n * 6));

// rollDice :: RNG (Tuple Integer Integer)
const rollDice = pair(rollDie);
rollDice.eval(123); // Tuple(2, 5)
```

## Reference

### Constructors

#### `State`
```hs
:: (s -> Identity (Tuple a s)) -> State s a
```
Constructs a `State` instance that represent a pure computation from some state
to a new state and a result. Note this constructor requires the given function
to return an `Identity` instance. It is generally recommended to use the static
properties and methods provided on the `State` object rather than using this
constructor.

#### `State.T`
```hs
:: Monad m => { of :: a -> m a } -> (s -> m (Tuple a s)) -> StateT s m a
```
Constructs a `StateT` instance that represent a computation from some state to a
new state and a result in the context of some other monad. It is generally
recommended to use the static properties and methods provided on the `State`
object rather than using this constructor.

### Static properties

#### `State.get`
```hs
:: State s s
```
A static `State` instance that retrieves the current state.

#### `StateT.get`
```hs
:: Monad m => StateT s m s
```
A static `StateT` instance that retrieves the current state.

### Static methods

#### `State.gets`
```hs
:: (s -> a) -> State s a
```
Returns a `State` instance the retrieves the current state transformed by the
given function.

#### `StateT.gets`
```hs
:: Monad m => (s -> a) -> StateT s m a
```
Returns a `State` instance the retrieves the current state transformed by the
given function.

#### `State.put`
```hs
:: s -> State s a
```
Returns a `State` instance the stores the provided state.

#### `StateT.put`
```hs
:: Monad m => s -> StateT s m a
```
Returns a `StateT` instance the stores the provided state

#### `State.modify`
```hs
:: (s -> s) -> State s a
```
Returns a `State` instance the modifies the stored state with the provided
function.

#### `StateT.modify`
```hs
:: Monad m => (s -> s) -> StateT s m a
```
Returns a `StateT` instance the modifies the stored state with the provided
function.

#### `State.of`
```hs
:: a -> State s a
```
Returns a `State` instance that will evaluate to the provided value.

#### `StateT.of`
```hs
:: Monad m => a -> StateT s m a
```
Returns a `StateT` instance that will evaluate to the provided value.

#### `StateT.lift`
```hs
:: Moand m => m a -> StateT s m a
```
Lifts the given monad into a `StateT` instance.

### Instance methods

#### `state.run`
```hs
:: State s a ~> s -> Tuple a s
```
Runs the `State` instance, seeded by the provided value and returns the final
state along with the result in a `Tuple`.

#### `stateT.run`
```hs
:: Monad m => StateT s m a ~> s -> m Tuple(a, s)
```
Runs the `StateT` instance, seeded by the provided value and returns the final
state along with the result in a `Tuple` within the underlying monad type of the
transformer.

#### `state.eval`
```hs
:: State s a ~> s -> a
```
Runs the `State` instance, seeded by the provided value and returns the result.

#### `stateT.eval`
```hs
:: Monad m => StateT s m a ~> s -> m a
```
Runs the `StateT` instance, seeded by the provided value and returns the result
in the context of the underlying monad type of the transformer.

#### `state.exec`
```hs
:: State s a ~> s -> s
```
Runs the `State` instance, seeded by the provided value and returns the final
state.

#### `stateT.exec`
```hs
:: Monad m => StateT s m a ~> s -> m s
```
Runs the `StateT` instance, seeded by the provided value and returns the final
state in the context of the underlying monad type of the transformer.

#### `state.map`
```hs
:: State s a ~> (a -> b) -> State s b
```
Transforms the eventual result of the `State` instance with the provided
function.

#### `stateT.map`
```hs
:: Monad m => StateT s m a ~> (a -> b) -> StateT s m b
```
Transforms the eventual result of the `StateT` instance with the provided
function.

#### `state.ap`
```hs
:: State s (a -> b) ~> State s a -> State s b
```
Applies the resulting function of this `State` instance to the result of the
provided `State` instance to produce a new `State` instance.

#### `stateT.ap`
```hs
:: Monad m => StateT s m (a -> b) ~> StateT s m a -> StateT s m b
```
Applies the resulting function of this `StateT` instance to the result of the
provided `StateT` instance to produce a new `StateT` instance.

#### `state.chain`
```hs
:: State s a ~> (a -> State s b) -> State s b
```
Creates a new `State` instance by applying the given function to the result of
this `State` instance.

#### `stateT.chain`
```hs
:: StateT s m a ~> (a -> StateT s m b) -> StateT s m b
```
Creates a new `StateT` instance by applying the given function to the result of
this `StateT` instance.
