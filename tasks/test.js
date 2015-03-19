'use strict';

var gulp       = require('gulp');
var requirejs  = require('requirejs');
var newJasmine = require('./lib/new-jasmine');

gulp.task('test', function(done) {
    requirejs.config({
        baseUrl: "src",
        paths: {
            "test" : "../test"
        },
        nodeRequire: require
    });
    var jasmine = newJasmine(done);
    requirejs("test/all-specs");
    jasmine.execute();
});