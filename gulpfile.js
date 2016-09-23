/// <binding AfterBuild='default' Clean='clean' />
/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript')
var sourcemaps = require('gulp-sourcemaps')

var tsProject = ts.createProject('tsconfig.json');
var outputDir = 'release';

gulp.task('clean', function () {
    return del([outputDir + '/**/*']);
});

gulp.task('scripts', function () {
    tsProject.src()
             .pipe(sourcemaps.init())
             .pipe(tsProject())
             .js
             .pipe(sourcemaps.write('../maps'))
             .pipe(gulp.dest(outputDir + '/scripts/js'));

    gulp.src('scripts/**/*.js')
        .pipe(gulp.dest(outputDir + '/scripts'));
});

gulp.task('watch', ['scripts'], function() {
    gulp.watch('scripts/*', ['scripts']);
});