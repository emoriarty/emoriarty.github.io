var gulp = require('gulp'),
    sass = require('gulp-sass');

gulp.task('default', function() {
  console.log('I have configured a gulpfile');
});

gulp.task('sass', function() {
  gulp.src('./assets/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});