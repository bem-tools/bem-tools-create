'use strict'

var path = require('path'),
    util = require('util'),
    mkdirp = require('mkdirp').sync,
    createEntity = require('./create-entity'),
    bemConfig = require('bem-config'),
    scheme = require('bem-fs-scheme'),
    getTemplate = require('./template'),
    uniq = require('uniq'),
    Promise = require('pinkie-promise');

module.exports = function create(entities, levels, techs, options) {
    options || (options = {});
    var config = bemConfig(options);

    if ((!levels || !levels.length) && config.merged.levels) {
        levels = Object.keys(config.merged.levels);
    }

    !Array.isArray(entities) && (entities = [entities]);
    !Array.isArray(levels) && (levels = [levels]);

    var promiseArray = [];
    entities.forEach(function(entity) {
        levels.forEach(function(level) {
            config.module('bem-tools').then(function(bemToolsConf) {
                config.level(level).then(function(levelOptions) {

                    var levelScheme = levelOptions ? levelOptions.scheme : undefined;
                    var buildPath = scheme(levelScheme).path;

                    var levelTechs = options.onlyTech ? [options.onlyTech] : uniq([].concat(
                        (bemToolsConf.plugins.create.techs || []), techs || [])
                    );

                    levelTechs.forEach(function(tech) {
                        var naming = levelOptions.naming,
                            pathToFile = buildPath(entity, tech, { naming: naming }),
                            absPathToFile = path.join(path.resolve(level), pathToFile),
                            folder = path.dirname(absPathToFile),
                            template = getTemplate(tech, bemToolsConf.plugins.create);

                        mkdirp(folder);

                        promiseArray.push(createEntity(entity, absPathToFile, template, { naming: naming }));
                    });
                });
            });
        });
    });

    return Promise.all(promiseArray);
};
