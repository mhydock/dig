/// <binding AfterBuild='default' Clean='clean' />
/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript')
var sourcemaps = require('gulp-sourcemaps')

var outputDir = 'release';
var tsProject = ts.createProject('tsconfig.json', { outFile: 'game.js' });

gulp.task('clean', function () {
    return del([outputDir + '/**/*']);
});

gulp.task('scripts', function () {
    tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('scripts/js'));
});

gulp.task('watch', ['scripts'], function() {
    gulp.watch('scripts/*', ['scripts']);
});