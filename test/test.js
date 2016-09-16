const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const expect = require('chai').expect;
const create = require('..');
const bemFsScheme = require('bem-fs-scheme');

const tmpDir = path.join(__dirname, 'tmp');
const initialCwd = process.cwd();

function createEntityHelper(entities, levels, techs, options) {
    return create(entities, levels, techs, options).then(() => {
        for (let entity of entities) {
            for (let tech of techs) {
                const fileName = bemFsScheme().path(entity, tech);

                if (!levels) {
                    if (options && options.defaults && options.defaults.levels) {
                        const lvls = options.defaults.levels;

                        Object.keys(lvls)
                            .filter(levelPath => {
                                return lvls[levelPath].default;
                            })
                            .forEach(levelPath => {
                                if (!fs.existsSync(path.resolve(tmpDir, levelPath, fileName))) {
                                    throw new Error(`Error: ${fileName} was not created`);
                                }
                            });
                    } else {
                        if (!fs.existsSync(path.resolve(process.cwd(), fileName))) {
                            throw new Error(`Error: ${fileName} was not created`);
                        }
                    }

                    return;
                }

                if (!fs.existsSync(path.resolve(tmpDir, fileName))) {
                    throw new Error(`Error: ${fileName} was not created`);
                }
            }
        }
    });
}

describe('bem-tools-create', () => {
    beforeEach(() => mkdirp.sync(tmpDir));
    afterEach(() => {
        rimraf.sync(tmpDir);
        process.chdir(initialCwd);
    });

    describe('default scheme and default naming', () => {
        function createDefaultEntityHelper(entities, levels, techs) {
            return createEntityHelper(entities, levels, techs);
        }

        it('should create a block using `nested` scheme and default naming', () => {
            return createDefaultEntityHelper([{ block: 'b' }], [tmpDir], ['css']);
        });

        it('should create an element using `nested` scheme and default naming', () => {
            return createDefaultEntityHelper([{ block: 'b', elem: 'e' }], [tmpDir], ['css']);
        });

        it('should create an block modifier using `nested` scheme and default naming', () => {
            return createDefaultEntityHelper([{ block: 'b', modName: 'm', modVal: 'v' }], [tmpDir], ['css']);
        });

        it('should create an element modifier using `nested` scheme and default naming', () => {
            return createDefaultEntityHelper([{ block: 'b', elem: 'e', modName: 'em', modVal: 'ev' }], [tmpDir], ['css']);
        });

        it('should create a block with diffrent techs', () => {
            return createDefaultEntityHelper([{ block: 'b' }], [tmpDir], ['css', 'deps.js']);
        });
    });

    describe('custom options', () => {
        describe('levels from config', () => {
            it('should create a block on default level', () => {
                const opts = {
                    defaults: { levels: {} },
                    fsRoot: tmpDir,
                    fsHome: tmpDir
                };

                ['level1', 'level2'].forEach(function(lvl) {
                    const level = path.join(tmpDir, lvl);

                    mkdirp.sync(level);

                    opts.defaults.levels[level] = { default: true };
                });

                return createEntityHelper([{ block: 'b' }], null, ['css'], opts);
            });

            it('should create a block on cwd as a fallback', () => {
                const fakeCwd = path.join(tmpDir, 'cwd');
                mkdirp.sync(fakeCwd);
                process.chdir(fakeCwd);

                return createEntityHelper([{ block: 'b' }], null, ['css'], {
                    fsRoot: tmpDir,
                    fsHome: tmpDir
                });
            });
        });

        it.skip('should create a block using custom template', () => {
            // TODO: implement
        });

        it.skip('should create blocks on custom levels', () => {
            // TODO: implement
        });

        it.skip('should create blocks in custom techs', () => {
            // TODO: implement
        });

        it.skip('should create blocks with custom naming', () => {
            // TODO: implement
        });

        it.skip('should create blocks with custom scheme', () => {
            // TODO: implement
        });
    });
});
