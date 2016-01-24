# IO

The `IO` type is used to store a function that describes some computation with
side effects, such as reading some data from a file, printing logging
information to the console, or mutating the elements in the DOM. Describing
actions in this way allows for `IO` instances to be composed and passed around
while keeping functions pure and maintaining referential transparency.

## Construction

The `IO` type consists of a single constructor which accepts a nullary function
that describes the action to be performed, resulting in an `IO` of the value
eventually returned from the action `IO :: (() -> a) -> IO a`.

```js
//:: IO [String]
argsIO = IO(() => R.tail(process.argv));

//:: String -> IO String
readFile = filename => IO(() => fs.readFileSync(filename, 'utf8'));

//:: String -> IO ()
stdoutWrite = data => IO(() => process.stdout.write(data));
```

It is important to note that upon construction of an `IO` instance, the action
will not be executed until the `runIO` method is called.

## Interaction

An `IO` instance implements the monad specification, allowing the results of the
actions to be transformed or chained together. The `runIO` method can then be
called to finally execute the action. Execution of an `IO` instance is
recommended to be delegated to the outer edges of an application, to the point
where an application will consist of a single `IO` instance at the entry point.

```js
// Read each file provided in the arguments of the running application, echoing
// their contents to stdout after transforming the text to uppercase characters
//:: String -> IO ()
loudCat = argsIO.chain(R.traverse(IO.of, readFile))
                .map(R.join('\n'))
                .map(R.toUpper)
                .chain(stdoutWrite);

loudCat.runIO();
```

## Reference

### Constructors

#### `IO`
```hs
:: (() -> a) -> IO a
```
Constructs an `IO` instance that represents some action that may possibly have
side effects.

### Static methods

#### `IO.runIO`
```hs
:: IO a -> a
```
Executes the action described by the given `IO` instance. This is also available
as an instance method.

#### `IO.of`
```hs
:: a -> IO a
```
Produces an `IO` instance that results in the given value.

### Instance methods

#### `io.runIO`
```hs
:: IO a ~> () -> a
```
Executes the action described by this `IO` instance. This is also available as a
static method.

#### `io.map`
```hs
:: IO a ~> (a -> b) -> IO b
```
Transforms the result of this `IO` instance with the provided function.

#### `io.ap`
```hs
:: IO (a -> b) ~> IO a -> IO b
```
Produces a new `IO` instance that when executed, applies the function resulting
from the action in this `IO` instance to the value resulting from the action in
the given `IO` instance.

#### `io.chain`
```hs
:: IO a ~> (a -> IO b) -> IO b
```
Produces an `IO` instance that when executed, will apply the given function to
the result of the action in this `IO` instance and then execute the resulting
`IO` action.
