var fs = require('fs'),
    bemNaming = require('bem-naming');

module.exports = function(entity, fileName, template, options) {
    fs.exists(fileName, function(exists) {
        // TODO: handle errors
        exists || fs.writeFile(fileName, template(entity, bemNaming(options.naming)));
    });
};
