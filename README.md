ramda-fantasy
=============

[Fantasy Land][1] compatible types for easy integration with [Ramda][2].

## Project status
This project is in alpha status. The implementation of the Fantasy Land spec should be *mostly*
stable. Any methods outside of the Fantasy Land spec are subject to change. The types also have
not undergone thorough testing/use yet.

## Available types

| Name            | [Setoid][3]  | [Semigroup][4] | [Functor][5] | [Applicative][6] | [Monad][7] | [Foldable][8] | [ChainRec][16] |
| --------------- | :----------: | :------------: | :----------: | :--------------: | :--------: | :-----------: | :------------: |
| [Either][9]     |    **✔︎**     |                |     **✔︎**    |      **✔︎**       |   **✔︎**    |               |     **✔︎**      |
| [Future][10]    |              |                |     **✔︎**    |      **✔︎**       |   **✔︎**    |               |     **✔︎**      |
| [Identity][11]  |    **✔︎**     |                |     **✔︎**    |      **✔︎**       |   **✔︎**    |               |     **✔︎**      |
| [IO][12]        |              |                |     **✔︎**    |      **✔︎**       |   **✔︎**    |               |     **✔︎**      |
| [Maybe][13]     |    **✔︎**     |                |     **✔︎**    |      **✔︎**       |   **✔︎**    |     **✔︎**     |     **✔︎**      |
| [Reader][14]    |              |                |     **✔︎**    |      **✔︎**       |   **✔︎**    |               |                |
| [Tuple][15]     |    **✔︎**     |     **✔︎**      |     **✔︎**    |                  |            |               |                |


Access like so:
```
  var Either = require('ramda-fantasy').Either;
```

[1]: https://github.com/fantasyland/fantasy-land
[2]: https://github.com/ramda/ramda
[3]: https://github.com/fantasyland/fantasy-land#setoid
[4]: https://github.com/fantasyland/fantasy-land#semigroup
[5]: https://github.com/fantasyland/fantasy-land#functor
[6]: https://github.com/fantasyland/fantasy-land#applicative
[7]: https://github.com/fantasyland/fantasy-land#monad
[8]: https://github.com/fantasyland/fantasy-land#foldable
[9]: docs/Either.md
[10]: docs/Future.md
[11]: docs/Identity.md
[12]: docs/IO.md
[13]: docs/Maybe.md
[14]: docs/Reader.md
[15]: docs/Tuple.md
[16]: https://github.com/fantasyland/fantasy-land#chainrec
