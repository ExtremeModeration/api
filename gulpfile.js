/**
 * Created by steve on 1/10/15.
 */

var gulp = require('gulp'),
    bower = require('gulp-bower'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass');

gulp.task('bower', function(){
    return bower({cmd: 'install'});
});

gulp.task('css', function(){
    return gulp.src('assets/scss/*.scss')
        .pipe(sass())
        .pipe(concat('main.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('start', ['css'], function(){
  nodemon({
    script: 'server.js'
  });
});

gulp.task('default', ['css']);
