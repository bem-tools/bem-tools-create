'use strict'

var path = require('path'),
    util = require('util'),
    mkdirp = require('mkdirp').sync,
    createEntity = require('./create-entity'),
    config = require('bem-config'),
    scheme = require('bem-fs-scheme'),
    getTemplate = require('./template');

module.exports = function create(entities, levels, techs, options) {
    options = config(options).extended;
    !Array.isArray(entities) && (entities = [entities]);
    !Array.isArray(levels) && (levels = [levels]);
    !Array.isArray(techs) && (techs = [techs]);

    entities.forEach(entity => {
        levels.forEach(level => {
            var levelOptions = util._extend({}, options);
            util._extend(levelOptions, options.levels[level]);

            var buildPath = scheme(levelOptions.scheme).path;

            techs.forEach(tech => {
                var naming = levelOptions.naming,
                    pathToFile = buildPath(entity, tech, { naming: naming }),
                    absPathToFile = path.join(path.resolve(level), pathToFile),
                    folder = path.dirname(absPathToFile),
                    template = getTemplate(tech, levelOptions);

                mkdirp(folder);

                // TODO:
                // 1. provide callback when all entities are created
                // 2. handle error
                createEntity(entity, absPathToFile, template, { naming: naming });
            });
        });
    });
};
