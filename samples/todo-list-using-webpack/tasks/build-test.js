'use strict';

var gulp    = require('gulp');
var uglify  = require('gulp-uglify');
var webpack = require('gulp-webpack');
var config  = require('../config/webpack.js').test;

gulp.task('build-test', ['copy-test-resources'], function () {
    return gulp.src(config.entry)
        .pipe(webpack(config))
        .pipe(gulp.dest("./build/test"));
});