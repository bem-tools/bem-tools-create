'use strict'

var path = require('path'),
    mkdirp = require('mkdirp').sync,
    createEntity = require('./create-entity'),
    bemConfig = require('bem-config'),
    scheme = require('bem-fs-scheme'),
    getTemplate = require('./template'),
    uniq = require('uniq'),
    get = require('lodash.get'),
    Promise = require('pinkie-promise');

module.exports = function create(entities, levels, techs, options) {
    options || (options = {});
    techs || (techs = []);
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

                var pluginConf = get(bemToolsConf, 'plugins.create') || {};

                config.level(level).then(function(levelOptions) {
                    var levelScheme = get(levelOptions, 'scheme');
                    var buildPath = scheme(levelScheme).path;
                    var pluginTechs = get(pluginConf) || [];
                    var levelTechs = get(options, 'onlyTech') || uniq([].concat(pluginTechs, techs));

                    levelTechs.forEach(function(tech) {
                        var naming = get(levelOptions, 'naming') || '',
                            pathToFile = buildPath(entity, tech, { naming: naming }),
                            absPathToFile = path.join(path.resolve(level), pathToFile),
                            folder = path.dirname(absPathToFile),
                            template = getTemplate(tech, pluginConf);

                        mkdirp(folder);

                        promiseArray.push(createEntity(entity, absPathToFile, template, { naming: naming }));
                    });
                });
            });
        });
    });

    return Promise.all(promiseArray);
};
