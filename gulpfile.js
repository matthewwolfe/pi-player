const gulp = require('gulp');
const concat = require('gulp-concat');
const replace = require('gulp-replace');

require('dotenv').config();

gulp.task('compile-queue', function() {
  return gulp.src('./src/frontend/queue/**/*.js')
    .pipe(concat('queue.js'))
    .pipe(replace(/YOUTUBE_API_KEY/g, process.env.YOUTUBE_API_KEY))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('compile-search', function() {
  return gulp.src('./src/frontend/search/**/*.js')
    .pipe(concat('search.js'))
    .pipe(replace(/YOUTUBE_API_KEY/g, process.env.YOUTUBE_API_KEY))
    .pipe(gulp.dest('./dist/'));
});


gulp.task('compile', gulp.parallel('compile-search', 'compile-queue'));
