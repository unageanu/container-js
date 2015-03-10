'use strict';
var gulp      = require('gulp');
var rimraf    = require('rimraf');
var requirejs = require('requirejs');
var Jasmine   = require('jasmine');
var exec      = require('child_process').exec;

gulp.task('default', ['minify'])

gulp.task('clean', function(cb) {
    rimraf('./dst', cb);
});

gulp.task('test', function(done) {
    requirejs.config({
        baseUrl: "src/js",
        paths: {
            "test"      : "../../test",
            "knockout"  : "./knockout-2.3.0",
            "container" : "../../../../minified/container"
        },
        nodeRequire: require
    });
    var jasmine = newJasmine(done);
    requirejs("test/all-specs");
    jasmine.execute();
});

gulp.task('minify', ['clean'], function(done) {
    var cmd = "node node_modules/requirejs/bin/r.js -o dist/build-config.json";
    exec(cmd, function(err, stdout, stderr){
        console.log(stdout);
        console.log(stderr);
        done(err);
    });
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
