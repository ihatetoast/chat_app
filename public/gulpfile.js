var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('sass', function() {
  return gulp
    .src('styles/styles.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('es6', function() {
  return gulp
    .src('scripts/index.js')
    .pipe(babel())
    .pipe(gulp.dest('dist/js'));
});
