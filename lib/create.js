'use strict';

var path = require('path'),
    bemConfig = require('bem-config'),
    scheme = require('bem-fs-scheme'),
    bemNaming = require('bem-naming'),
    braceExpansion = require('brace-expansion'),
    createEntity = require('./create-entity'),
    getTemplate = require('./template'),
    uniq = require('uniq'),
    Promise = require('pinkie-promise');

module.exports = function create(entities, levels, techs, options) {
    options || (options = {});
    techs || (techs = []);
    var config = bemConfig(options);

    if (!levels || !levels.length) {
        var levelsMap = config.levelMapSync();
        var defaultLevels = Object.keys(levelsMap).filter(function(level) {
            return levelsMap[level].default;
        });

        levels = defaultLevels.length ? defaultLevels : process.cwd();
    }

    Array.isArray(entities) || (entities = [entities]);
    Array.isArray(levels) || (levels = [levels]);

    return Promise.all(entities.map(function(input) {
        var isFileGlob = typeof input === 'string';

        return Promise.all((isFileGlob ? braceExpansion(input) : [input]).map(function(filepathOrInput) {
            var currentLevels = levels;

            if (typeof filepathOrInput === 'string'){
                var currentLevel = path.dirname(filepathOrInput);
                currentLevel !== '.' && (currentLevels = [currentLevel]);
            }

            return Promise.all(currentLevels.map(function(level) {
                return config.module('bem-tools')
                    .then(function(bemToolsConf) {
                        var pluginConf = bemToolsConf && bemToolsConf.plugins && bemToolsConf.plugins.create || {};

                        return config.level(level).then(function(levelOptions) {
                            levelOptions || (levelOptions = {});

                            var namingOpts = levelOptions.naming,
                                levelScheme = levelOptions.scheme,
                                buildPath = scheme(levelScheme).path,
                                pluginTechs = pluginConf.techs || [],
                                levelTechs = options.onlyTech ? techs : uniq([].concat(pluginTechs, techs)),
                                currentTechs = levelTechs,
                                entity = filepathOrInput;

                            if (isFileGlob) {
                                var file = path.basename(filepathOrInput),
                                    splitted = file.split('.');

                                entity = bemNaming(namingOpts).parse(splitted.shift());
                                if (splitted.join('.')) {
                                    currentTechs = [splitted.join('.')];
                                }
                            }

                            return Promise.all(currentTechs.map(function(tech) {
                                var pathToFile = buildPath(entity, tech, { naming: namingOpts }),
                                    absPathToFile = path.join(path.resolve(level), pathToFile),
                                    template = getTemplate(tech, pluginConf);

                                return createEntity(entity, absPathToFile, template, { naming: namingOpts });
                            }));
                        });
                    });
            }));

        }));
    })).then(function() {});
};
