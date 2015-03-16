'use strict';

var gulp      = require('gulp');
var exec      = require('child_process').exec;

gulp.task('minify', ['clean'], function(done) {
    var cmd = "node node_modules/requirejs/bin/r.js -o dist/build-config.json";
    exec(cmd, function(err, stdout, stderr){
        console.log(stdout);
        console.log(stderr);
        done(err);
    });
});