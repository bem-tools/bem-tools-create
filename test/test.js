var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    mockFsHelper = require(path.join(__dirname, 'lib', 'mock-fs-helper')),
    expect = require('chai').expect,

    create = require('..'),
    bemFsScheme = require('bem-fs-scheme'),

    nodeModules = mockFsHelper.duplicateFSInMemory(path.resolve('node_modules'));

describe('bem-tools-create', function() {

    afterEach(function () {
        mock.restore();
    });

    describe('default scheme and default naming', function() {
        function createEntityHelper(entities, levels, techs, done) {
            mock({
                node_modules: nodeModules
            });

            create(entities, levels, techs)
                .then(function() {
                    var fileName = bemFsScheme().path(entities[0], techs[0]);

                    fs.exists(fileName, function(exists) {
                        exists ? done() : done(new Error(' '));
                    });
                }, done);
        }

        it('should create a block using \'nested\' scheme and default naming', function(done) {
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
    });
});
