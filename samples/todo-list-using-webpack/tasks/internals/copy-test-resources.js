var gulp = require('gulp');

gulp.task('copy-test-resources', function () {
    gulp.src([
        './test/*.html'
    ]).pipe(gulp.dest('build/test'));
});