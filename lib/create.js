'use strict'

var path = require('path'),
    util = require('util'),
    mkdirp = require('mkdirp').sync,
    createEntity = require('./create-entity'),
    Config = require('bem-config'),
    scheme = require('bem-fs-scheme'),
    getTemplate = require('./template'),
    Promise = require('pinkie-promise');

module.exports = function create(entities, levels, techs, options) {
    options || (options = {});
    var config = new Config(options);

    if ((!levels || !levels.length) && config.merged.levels) {
        levels = Object.keys(config.merged.levels);
    }

    !Array.isArray(entities) && (entities = [entities]);
    !Array.isArray(levels) && (levels = [levels]);

    var promiseArray = [];

    entities.forEach(function(entity) {
        levels.forEach(function(level) {
            var levelOptions = config.getLevel(level) || {},
                createOptions = config.getPlugin('create') || {},
                buildPath = scheme(levelOptions.scheme).path;

            techs = [].concat(options.onlyTechs ? [] : (createOptions.techs || []), techs || []);

            techs.forEach(function(tech) {
                var naming = levelOptions.naming,
                    pathToFile = buildPath(entity, tech, { naming: naming }),
                    absPathToFile = path.join(path.resolve(level), pathToFile),
                    folder = path.dirname(absPathToFile),
                    template = getTemplate(tech, createOptions);

                mkdirp(folder);

                promiseArray.push(createEntity(entity, absPathToFile, template, { naming: naming }));
            });
        });
    });

    return Promise.all(promiseArray);
};
