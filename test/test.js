var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    mockFsHelper = require(path.join(__dirname, 'lib', 'mock-fs-helper')),
    expect = require('chai').expect,

    create = require('..'),
    bemFsScheme = require('bem-fs-scheme'),

    nodeModules = mockFsHelper.duplicateFSInMemory(path.resolve('node_modules')),
    templatesDir = mockFsHelper.duplicateFSInMemory(path.resolve('lib', 'templates'));

describe('bem-tools-create', function() {

    afterEach(function () {
        mock.restore();
    });

    describe('default scheme and default naming', function() {
        function createEntityHelper(entities, levels, techs, done) {
            mock({
                node_modules: nodeModules,
                lib: {
                    templates: templatesDir
                }
            });

            create(entities, levels, techs)
                .then(function() {
                    entities.forEach(function(entity) {
                        techs.forEach(function(tech) {
                            var fileName = bemFsScheme().path(entity, tech);

                            fs.existsSync(fileName) || done(new Error(fileName + ' does not exists'));
                        });
                    });

                    done();
                }, done);
        }

        it('should create a block using `nested` scheme and default naming', function(done) {
            createEntityHelper([{ block: 'b' }], ['.'], ['css'], done);
        });

        it('should create an element using `nested` scheme and default naming', function(done) {
            createEntityHelper([{ block: 'b', elem: 'e' }], ['.'], ['css'], done);
        });

        it('should create an block modifier using `nested` scheme and default naming', function(done) {
            createEntityHelper([{ block: 'b', modName: 'm', modVal: 'v' }], ['.'], ['css'], done);
        });

        it('should create an element modifier using `nested` scheme and default naming', function(done) {
            createEntityHelper([{ block: 'b', elem: 'e', modName: 'em', modVal: 'ev' }], ['.'], ['css'], done);
        });

        it('should create a block with diffrent techs', function(done) {
            createEntityHelper([{ block: 'b' }], ['.'], ['css', 'deps.js'], done);
        });
    });
});
