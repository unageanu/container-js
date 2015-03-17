'use strict';

var gulp    = require('gulp');
var jasmine = require('gulp-jasmine');

gulp.task('test', ['build-test'], function(done) {
    return gulp.src('build/test/all-specs.js')
        .pipe(jasmine());
});