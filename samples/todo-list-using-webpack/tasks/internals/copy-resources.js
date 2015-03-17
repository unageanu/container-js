var gulp = require('gulp');

gulp.task('copy-resources', function () {
    gulp.src([
        './src/html/**',
        './src/images/**',
        './src/css/**'
    ], { base: 'src' }).pipe(gulp.dest('build/app'));
});