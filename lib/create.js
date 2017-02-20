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

// TODO: move to bem-config as getLevelByPath()
function getLevelByCwd(levelList, cwd) {
    return levelList.filter(function(level) {
        return cwd.indexOf(level) === 0;
    }).sort().reverse()[0];
}

// TODO: унести куда-то
function parseEntityByShortcut(str, context, options) {
    var possibleDelims = ['elemDelim', 'modDelim', 'modValDelim'];
    var delim2entityField = {
        elemDelim: 'elem',
        modDelim: 'modName',
        modValDelim: 'modVal'
    };

    var delims = possibleDelims.filter(function(delim) {
        return str.indexOf(naming[delims[i]] === 0;
    });

    // TODO: резолвим неоднозначность по контексту
    // учесть кейс, если элементы _, а модификаторы __
    if (delims.length > 1) {

    }

    var entityWithoutContext = {};
    var entityField = delim2entityField[delims[0]];
    entityWithoutContext[entityField] = str.replace(delims[0], '');

    return Object.assing({}, context, entityWithoutContext);
}



module.exports = function create(entities, levels, techs, options) {
    options || (options = {});
    techs || (techs = []);
    var config = bemConfig(options),
        cwd = path.resolve(options.cwd || '');

    if (!levels || !levels.length) {
        var levelsMap = config.levelMapSync(),
            levelList = Object.keys(levelsMap);

        var defaultLevels = levelList.filter(function(level) {
            return levelsMap[level].default;
        });

        // TODO: можно вычислять раньше и тогда предыдущие вычисления делать ondemand
        var levelByCwd = getLevelByCwd(levelList, cwd);

        levels = levelByCwd || (defaultLevels.length ? defaultLevels : cwd);
    }

    Array.isArray(entities) || (entities = [entities]);
    Array.isArray(levels) || (levels = [levels]);

    return Promise.all(entities.map(function(input) {
        var isFileGlob = typeof input === 'string';

        return Promise.all((isFileGlob ? braceExpansion(input) : [input]).map(function(filepathOrInput) {
            var currentLevels = levels;

            // TODO: проверить, что здесь не теряется levelByCwd и когда переданное до слеша
            // не мапится в левел 1 к 1
            if (typeof filepathOrInput === 'string') {
                var currentLevel = path.dirname(filepathOrInput);
                currentLevel !== '.' && (currentLevels = [currentLevel]);
            }

            return Promise.all(currentLevels.map(function(relLevel) {
                // TODO: похоже, здесь тоже нужно пытаться вычислять levelByCwd
                var root = config.rootSync(),
                    level = path.resolve(root || cwd, relLevel);

                return config.module('bem-tools')
                    .then(function(bemToolsConf) {
                        var pluginConf = bemToolsConf && bemToolsConf.plugins && bemToolsConf.plugins.create || {};

                        return config.level(level).then(function(levelOptions) {
                            levelOptions || (levelOptions = {});

                            var namingOpts = levelOptions.naming,
                                levelScheme = scheme(levelOptions.scheme),
                                buildPath = levelScheme.path,
                                entity = filepathOrInput,

                                pluginConfLevels = pluginConf.levels || {},
                                pluginConfLevel = pluginConfLevels[level] || {},
                                pluginConfLevelTechs = pluginConfLevel.techs,

                                pluginTechs = pluginConf.techs || [],
                                currentTechs = uniq([].concat(pluginConfLevelTechs || pluginTechs, techs)),
                                templatesOpts = Object.assign({}, pluginConf, pluginConfLevel);

                            if (isFileGlob) {
                                var file = path.basename(filepathOrInput),
                                    splitted = file.split('.'),
                                    entityStr = splitted[0];

                                entity = bemNaming(namingOpts).parse(entityStr);

                                if (!entity) {
                                    // TODO: попробовать восстановить сущность по контексту
                                    console.log('level', level);
                                    console.log('path.relative(level, cwd)', path.relative(level, cwd));
                                    var relPath = path.relative(level, cwd),
                                        contextEntity = levelScheme.parse(relPath).entity;

                                    console.log('contextEntity', contextEntity);



                                    entity = levelScheme.parse(path.join(relPath, entityStr)).entity || contextEntity;
                                    console.log('entity', entity);
                                }

                                if (splitted.slice(1).join('.')) {
                                    currentTechs = uniq(techs.concat(splitted.slice(1).join('.')));
                                }
                            }

                            options.onlyTech && (currentTechs = options.onlyTech);

                            return Promise.all(currentTechs.map(function(tech) {
                                var pathToFile = buildPath(entity, tech, { naming: namingOpts }),
                                    absPathToFile = path.join(path.resolve(level), pathToFile),
                                    template = getTemplate(tech, templatesOpts);

                                return createEntity(entity, absPathToFile, template, { naming: namingOpts });
                            }));
                        });
                    });
            }));

        }));
    })).then(flatten);
};

function flatten(arr) {
    return arr.reduce(function(acc, item) {
        return acc.concat(Array.isArray(item) ? flatten(item) : item);
    }, []);
}
