const gulp = require('gulp');
const concat = require('gulp-concat');

gulp.task('compile', function() {
  return gulp.src('./src/frontend/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./dist/'));
});
