// includes
var gulp = require('gulp'); 
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var del = require('del');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('gulp-buffer');
var swig = require('gulp-swig');
var browserSync = require('browser-sync');

// clean up tasks
gulp.task('clean-html', function(done) {
    del(['build/*.html'], done);
});

gulp.task('clean-js', function(done) {
    del(['build/js'], done);
});

gulp.task('clean-css', function(done) {
    del(['build/css'], done);
});

// create html from partials using swig
gulp.task('html', ['clean-html'], function () {
    return gulp.src('src/partials/*.html')
        .pipe(buffer())
        .pipe(swig({ defaults: { cache: false } }))
        .pipe(gulp.dest('build'));
});

// lint
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// browserify
gulp.task('js', ['clean-js', 'lint'], function() {
    return browserify('src/js/app.js')
        .bundle()
        .pipe(source('all.js'))
        .pipe(gulp.dest('./build/js/'))
        .pipe(buffer())
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'));
});

// sass
gulp.task('sass', ['clean-css'], function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build/css'));
});

//browser-sync will reload when compiled versions change
gulp.task('browser-sync', function() {
    return browserSync.init(['./build/*.html', './build/css/*.css', './build/js/*.js'], {
        server: {
            baseDir: './build'
        }
    });
});

// default task when you run 'gulp'
gulp.task('default', ['clean-html', 'clean-js', 'clean-css', 'html', 'lint', 'js', 'sass', 'browser-sync'], function() {
    // watch and recompile
    gulp.watch('src/partials/*.html', ['clean-html', 'html', browserSync.reload]);
    gulp.watch('src/js/*.js', ['clean-js', 'lint', 'js', browserSync.reload]);
    gulp.watch('src/scss/*.scss', ['clean-css', 'sass', browserSync.reload]);
});
