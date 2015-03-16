'use strict';

var gulp       = require('gulp');
var requirejs  = require('requirejs');
var Jasmine    = require('jasmine');

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

var newJasmine = function(done) {
    var jasmine = new Jasmine();
    jasmine.configureDefaultReporter({
        onComplete: function(pass){  
            done(pass ? null : new Error("test failed.")); 
        }
    });
    return jasmine;
};