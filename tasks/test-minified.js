'use strict';

var gulp       = require('gulp');
var requirejs  = require('requirejs');
var Jasmine    = require('jasmine');
var newJasmine = require('./lib/new-jasmine');

gulp.task('test.minified', ['minify'], function(done) {
    requirejs.config({
        baseUrl: "minified",
        paths: {
            "test" : "../test"
        },
        nodeRequire: require
    });
    var jasmine = newJasmine(done);
    requirejs("container");
    requirejs("test/all-specs");
    jasmine.execute();
});