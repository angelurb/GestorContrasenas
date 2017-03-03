var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var cleanCSS = require('gulp-clean-css');
var pug = require('gulp-pug');
var htmlmin = require('gulp-htmlmin');
var changed = require('gulp-changed');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');


var tmp = ".tmp/"

//SASS *
gulp.task('sass', function() {
    return gulp.src('app/main.scss')
        .pipe(sass())
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest('app/components/build/css'))
});

gulp.task('minify-css', ['sass'], function() {
    return gulp.src('app/components/build/css/main.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(tmp))
});

gulp.task('concat-css', ['minify-css'], function() {
    return gulp.src([
            'app/bower_components/bootstrap/dist/css/bootstrap.min.css',
            'app/bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
            '.tmp/main.css'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(tmp))
});
//CONCATENATE .JS, UGLIFY IT
gulp.task('concat', function() {
    return gulp.src(['app/app.module.js', 'app/components/**/*.js', '!app/components/build{,/**}'])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(tmp + 'js'))
});


//PUG TO html
gulp.task('views', function buildHTML() {
    return gulp.src('app/**/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(rename({ dirname: '' }))
        .pipe((gulp.dest('app/components/build/html')))
});

//HTML MINIFIED

gulp.task('minify-html', ['views'], function() {
    gulp.src('app/components/build/html/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(tmp + 'views'))
    gulp.src(tmp + 'views/index.html').pipe(gulp.dest(tmp));
});


//CHECK CHANGES 
gulp.task('watch', ['browserSync'], function() {
    gulp.watch('app/components/**/*.pug', ['minify-html']);
    gulp.watch('app/components/**/*.js', ['concat']);
    gulp.watch('app/components/**/*.scss', ['concat-css']);
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


//BOWER FILES
gulp.task('bower', function() {
    return gulp.src([
            'app/bower_components/angular/angular.min.js',
            'app/bower_components/angular-route/angular-route.min.js',
            'app/bower_components/jquery/dist/jquery.min.js',
            'app/bower_components/bootstrap/dist/js/bootstrap.min.js'
        ])
        .pipe(concat('bower.js'))
        .pipe(gulp.dest(tmp + 'js'));
});

gulp.task('default', function(callback) {
    runSequence(['bower', 'concat', 'concat-css', 'minify-html', 'watch'],
        callback
    )
});