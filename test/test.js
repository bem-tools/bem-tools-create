var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    mockFsHelper = require(path.join(__dirname, 'lib', 'mock-fs-helper')),
    expect = require('chai').expect,

    create = require('..'),

    nodeModules = mockFsHelper.duplicateFSInMemory(path.resolve('node_modules'));

describe('bem-tools-create', function() {

    afterEach(function () {
        mock.restore();
    });

    describe('default scheme and default naming', function() {
        it('should create a block using \'nested\' scheme and default naming', function(done) {
            mock({
                node_modules: nodeModules
            });

            create([{ block: 'b' }], ['.'], ['css'])
                .then(function() {
                    fs.exists('b/b.css', function(exists) {
                        exists ? done() : done(new Error(' '));
                    });
                }, done);
        });

        it('should create an element using \'nested\' scheme and default naming', function(done) {
            mock({
                node_modules: nodeModules
            });

            create([{ block: 'b', elem: 'e' }], ['.'], ['css'])
                .then(function() {
                    fs.exists('b/__e/b__e.css', function(exists) {
                        exists ? done() : done(new Error(' '));
                    });
                }, done);
        });

        it('should create an block modifier using \'nested\' scheme and default naming', function(done) {
            mock({
                node_modules: nodeModules
            });

            create([{ block: 'b', modName: 'm', modVal: 'v' }], ['.'], ['css'])
                .then(function() {
                    fs.exists('b/_m/b_m_v.css', function(exists) {
                        exists ? done() : done(new Error(' '));
                    });
                }, done);
        });

        it('should create an element modifier using \'nested\' scheme and default naming', function(done) {
            mock({
                node_modules: nodeModules
            });

            create([{ block: 'b', elem: 'e', modName: 'em', modVal: 'ev'}], ['.'], ['css'])
                .then(function() {
                    fs.exists('b/__e/_em/b__e_em_ev.css', function(exists) {
                        exists ? done() : done(new Error(''));
                    });
                }, done);
        });
    });
});
