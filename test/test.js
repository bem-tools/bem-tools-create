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

    it('should create a block', function(done) {
        mock({
            node_modules: nodeModules
        });

        create([{ block: 'b1' }], ['.'], ['css'])
            .then(function() {
                fs.exists('b1/b1.css', function(exists) {
                    exists ? done() : done(new Error(' '));
                });
            }, done);
    });
});
