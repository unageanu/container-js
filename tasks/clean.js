'use strict';

var gulp      = require('gulp');
var rimraf    = require('rimraf');

gulp.task('clean', function(cb) {
    rimraf('./minified/container.js', cb);
});