var gulp = require('gulp');
var webserver = require('gulp-webserver');
var opn = require('opn');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var cleanCSS = require('gulp-clean-css');
var pug = require('gulp-pug');
var htmlmin = require('gulp-htmlmin');

var tmp = "tmp/"

//SASS
gulp.task('sass', function() {
    return gulp.src('stylesheets/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('stylesheets/'))

});

gulp.task('minify-css', function() {
    return gulp.src('stylesheets/main.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest(tmp))

});

//CONCATENATE .JS, UGLIFY IT
gulp.task('concat', function() {
    return gulp.src('js/*.js')
        .pipe(concat('main.js'))
        .pipe(plumber())
        .pipe(ngAnnotate({ add: true }))
        .pipe(gulp.dest(tmp))
        //NO MINIFICA CON COMPONENTES
        /*        .pipe(uglify({ mangle: true }))
                .pipe(rename('app.min.js'))
                .pipe(gulp.dest(tmp))*/
});


//PUG TO html
gulp.task('views', function buildHTML() {
    return gulp.src('pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe((gulp.dest('html')))
});

//HTML MINIFIED

gulp.task('minify-html', function() {
    return gulp.src('html/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(tmp));
});

//CHECK CHANGES 
gulp.task('watch', ['browserSync'], function() {
    gulp.watch('pug/*.pug', ['views']);
    gulp.watch('html/*.html', ['minify-html']);
    gulp.watch('js/*.js', ['concat']);
    gulp.watch('stylesheets/**/*.scss', ['sass']);
    gulp.watch('stylesheets/main.css', ['minify-css']);
    gulp.watch(tmp + '*.html', browserSync.reload);
    gulp.watch(tmp + '*.js', browserSync.reload);
    gulp.watch(tmp + '*.css', browserSync.reload);

});

//WEBSERVER WITH BROWSERSYNC
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: tmp
        },
    })
});

//OPENBROWSER
/*gulp.task('openbrowser', function() {
    opn('http://' + server.host + ':' + server.port);
});*/

gulp.task('default', function(callback) {
    runSequence(['concat', 'sass', 'minify-css', 'views', 'minify-html', 'browserSync', 'watch'],
        callback
    )
});