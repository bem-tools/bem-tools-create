var create = require('./lib/create');

create([
    { block: 'vitaly-harisov' },
    { block: 'vitaly-harisov', modName: 'm1', modVal: true },
    { block: 'vitaly', elem: 'e2' },
    { block: 'vitaly', elem: 'e2', modName: 'elemMod', modVal: true },
    { block: 'harisov', modName: 'm1', modVal: 'v1' }
], ['tmp', 'tmp2', 'path/to/level'], ['css', 'js', 'bemhtml.js']);
