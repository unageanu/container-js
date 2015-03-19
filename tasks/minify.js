'use strict';

var gulp      = require('gulp');
var uglify    = require('gulp-uglify');
var rjs       = require('gulp-requirejs');

gulp.task('minify', ["test"], function() {
    rjs({
        baseUrl: 'src',
        name   : 'container',
        out    : 'container.js' 
    })
    .pipe(uglify())
    .pipe(gulp.dest('./minified'));
});