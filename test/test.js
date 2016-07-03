const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const expect = require('chai').expect;
const create = require('..');
const bemFsScheme = require('bem-fs-scheme');

const tmpDir = path.join(__dirname, 'tmp');

function createEntityHelper(entities, levels, techs, options) {
    return create(entities, levels, techs, options).then(() => {
        for (let entity of entities) {
            for (let tech of techs) {
                var fileName = bemFsScheme().path(entity, tech);

                if (!fs.existsSync(path.resolve(tmpDir, fileName))) {
                    throw new Error(`Error: ${fileName} was not created`);
                }
            }
        }
    });
}

describe('bem-tools-create', () => {
    beforeEach(() => mkdirp.sync(tmpDir));
    afterEach(() => rimraf.sync(tmpDir));

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
            it.skip('should create a block on default level', () => {
                // TODO: respect folder from config (now creates on cwd)
                var opts = {
                    config: { levels: {} },
                    fsRoot: tmpDir,
                    fsHome: tmpDir
                };

                var level = path.join(tmpDir, 'level1');

                mkdirp.sync(level);

                opts.config.levels[level] = {
                    default: true
                };

                return createEntityHelper([{ block: 'b' }], null, ['css'], opts);
            });

            it.skip('should create a block on cwd as a fallback', () => {
                // TODO: implement
            });
        });

        it.skip('should create a block using custom template', () => {
            // TODO: implement
        });
    });
});
