'use strict';

var EOL = require('os').EOL;

module.exports = function(entity) {
    var elemPart = entity.elem ? ".elem('" + entity.elem + "')" : '',
        modVal = entity.modVal &&
            (typeof entity.modVal === 'boolean' ? entity.modVal : "'" + entity.modVal + "'") || '',
        modPart = entity.modName ? "." +
            (entity.elem ? 'elemMod' : 'mod') +
            "('" + entity.modName + "', " + modVal + ")" : '';

    return [
        "block('" + entity.block + "')" +
            (entity.modName && !entity.elem ? modPart : '') +
            (entity.elem ? elemPart : '') +
            (entity.elem && entity.modName ? modPart : '') +
            ".content()(function() {",
        "    return;",
        "});",
        ""
    ].join(EOL);
};
