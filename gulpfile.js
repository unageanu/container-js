'use strict';
var gulp      = require('gulp');
var rimraf    = require('rimraf');
var uglify    = require('gulp-uglify');
var rjs       = require('gulp-requirejs');
var requirejs = require('requirejs');
var Jasmine   = require('jasmine');

gulp.task('default', ['test.minified'])

gulp.task('clean', function(cb) {
    rimraf('./minified/container.js', cb);
});

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

gulp.task('minify', function() {
    rjs({
        baseUrl: 'src',
        name   : 'container',
        out    : 'container.js' 
    })
    .pipe(uglify())
    .pipe(gulp.dest('./minified'));
});

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

var newJasmine = function(done) {
    var jasmine = new Jasmine();
    jasmine.configureDefaultReporter({
        onComplete: function(pass){  
            done(pass ? null : new Error("test failed.")); 
        }
    });
    return jasmine;
};
