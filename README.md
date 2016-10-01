# bem-tools-create

## Usage
```js
const create = require('bem-tools-create');

create([
    { block: 'b1' },
    { block: 'b1', modName: 'm1', modVal: true },
    { block: 'b1', elem: 'e2' },
    { block: 'b1', elem: 'e2', modName: 'elemMod', modVal: true },
    { block: 'b1', modName: 'm1', modVal: 'v1' }
], ['level1', 'level2'], ['css', 'js', 'bemhtml.js']);
```
