ramda-fantasy
=============

[Fantasy Land][1] compatible types for easy integration with [Ramda][2].

## Project status
Ramda-Fantasy is no longer developed. There are a number of excellent libraries providing algebraic datatypes in JavaScript. The existing npm releases of Ramda-Fantasy will remain available indefinitely.

We recommend a number of alternative libraries such as [Sanctuary](https://github.com/sanctuary-js), [Folktale](http://folktale.origamitower.com/), [Fluture](https://github.com/fluture-js), and [Fantasy-Land](https://github.com/fantasyland).

Specifically, we suggest these replacements:

* Maybe: [sanctuary-js/sanctuary-maybe](https://github.com/sanctuary-js/sanctuary-maybe)
* Either: [sanctuary-js/sanctuary-either](https://github.com/sanctuary-js/sanctuary-either)
* Future: [fluture-js/Fluture](https://github.com/fluture-js/Fluture)
* State: [fantasyland/fantasy-states](https://github.com/fantasyland/fantasy-states)
* Tuple: [fantasyland/fantasy-tuples](https://github.com/fantasyland/fantasy-tuples)
* Reader: [fantasyland/fantasy-readers](https://github.com/fantasyland/fantasy-readers)
* IO: [fantasyland/fantasy-io](https://github.com/fantasyland/fantasy-io)
* Identity: [fantasyland/fantasy-identities](https://github.com/fantasyland/fantasy-identities)

## Available types

| Name            | [Setoid][3]  | [Semigroup][4] | [Functor][5] | [Applicative][6] | [Monad][7] | [Foldable][8] | [ChainRec][16] |
| --------------- | :----------: | :------------: | :----------: | :--------------: | :--------: | :-----------: | :------------: |
| [Either][9]     |    **✔︎**     |                |     **✔︎**    |      **✔︎**       |   **✔︎**    |               |     **✔︎**      |
| [Future][10]    |              |                |     **✔︎**    |      **✔︎**       |   **✔︎**    |               |     **✔︎**      |
| [Identity][11]  |    **✔︎**     |                |     **✔︎**    |      **✔︎**       |   **✔︎**    |               |     **✔︎**      |
| [IO][12]        |              |                |     **✔︎**    |      **✔︎**       |   **✔︎**    |               |     **✔︎**      |
| [Maybe][13]     |    **✔︎**     |     **✔︎**      |     **✔︎**    |      **✔︎**       |   **✔︎**    |     **✔︎**     |     **✔︎**      |
| [Reader][14]    |              |                |     **✔︎**    |      **✔︎**       |   **✔︎**    |               |                |
| [Tuple][15]     |    **✔︎**     |     **✔︎**      |     **✔︎**    |                  |            |               |                |
| [State][17]     |               |               |       **✔︎**   |    **✔︎**        |   **✔︎**    |               |       **✔︎**        |


Access like so:
```
  var Either = require('ramda-fantasy').Either;
```
## available translations
[Spanish](https://github.com/idcmardelplata/ramda-fantasy)

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
[17]: docs/State.md
