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
var browserSync = require('browser-sync');

// clean up tasks
gulp.task('clean-js', function(done) {
    del(['build/js'], done);
});

gulp.task('clean-css', function(done) {
    del(['build/css'], done);
});

// lint
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// sass
gulp.task('sass', ['clean-css'], function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build/css'));
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

//browser-sync will reload when compiled versions change
gulp.task('browser-sync', function() {
    return browserSync.init(['*.html', './build/css/*.css', './build/js/*.js'], {
        server: {
            baseDir: './'
        }
    });
});

// default task when you run 'gulp'
gulp.task('default', ['clean-js', 'clean-css', 'lint', 'sass', 'js', 'browser-sync'], function() {
    // watch and recompile
    gulp.watch('src/js/*.js', ['clean-js', 'lint', 'js', browserSync.reload]);
    gulp.watch('src/scss/*.scss', ['clean-css', 'sass', browserSync.reload]);
});
