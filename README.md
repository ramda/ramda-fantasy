ramda-fantasy
=============

[Fantasy Land][1] compatible types for easy integration with [Ramda][2].


[1]: https://github.com/fantasyland/fantasy-land
[2]: https://github.com/ramda/ramda

## Project status
This project is in alpha status. The implementation of the Fantasy Land spec should be *mostly*
stable. Any methods outside of the Fantasy Land spec are subject to change. The types also have
not undergone thorough testing/use yet.

## Available types

 Name       | Setoid  | Semigroup | Functor | Applicative | Monad | Comonad  | Foldable |
 ---------- | :-----: | :-------: | :-----: | :---------: | :---: | :------: | :-------: |
 Either     |  **✔︎**  |           |  **✔︎**  |    **✔︎**    | **✔︎** |          |           |
 Future     |  **✔︎**  |           |  **✔︎**  |    **✔︎**    | **✔︎** |          |           |
 Identity   |  **✔︎**  |           |  **✔︎**  |    **✔︎**    | **✔︎** |          |           |
 IO         |  **✔︎**  |           |  **✔︎**  |    **✔︎**    | **✔︎** |          |           |
 Maybe      |  **✔︎**  |           |  **✔︎**  |    **✔︎**    | **✔︎** |          |   **✔︎**   |
 Reader     |  **✔︎**  |           |  **✔︎**  |    **✔︎**    | **✔︎** |          |           |
 Tuple      |  **✔︎**  |   **✔︎**   |  **✔︎**  |             |       |          |           |


Access like so:
```
  var Either = require('ramda-fantasy').Either;
```
