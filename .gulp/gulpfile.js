// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// var scripts = [
//     'js/sha256.js',
//     'js/subscription_manager.js',
//     'js/main.js'
// ];

// gulp.task('lint', function() {
//     return gulp.src(scripts)
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('../client/css'));
});

// gulp.task('scripts', function() {
//     return gulp.src(scripts)
//         .pipe(concat('main.js'))
//         .pipe(gulp.dest('../client/js'));
//         // .pipe(rename('all.min.js'))
//         // .pipe(uglify())
//         // .pipe(gulp.dest('dist'));
// });

// Watch Files For Changes
gulp.task('watch', function() {
    // gulp.watch('js/*.js', ['scripts']);
    gulp.watch('scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['sass', 'watch']);