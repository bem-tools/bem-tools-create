var fs = require('fs'),
    bemNaming = require('bem-naming'),
    Promise = require('pinkie-promise');

module.exports = function(entity, fileName, template, options) {
    var promise = new Promise(function(resolve, reject) {
        fs.exists(fileName, function(exists) {
            if (exists) return resolve();

            fs.writeFile(fileName, template(entity, bemNaming(options.naming)), function(err) {
                err ? reject(err) : resolve();
            });
        });
    });

    return promise;
};
