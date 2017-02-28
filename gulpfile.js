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
var replaceName = require('gulp-replace-name');
var mainBowerFiles = require('main-bower-files');
var changed = require('gulp-changed');
var clean = require('gulp-clean');

var tmp = "tmp/"

//SASS *
gulp.task('sass', function() {
    return gulp.src('components/**/main.scss')
        .pipe(sass())
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest('components/build/css'))
});

gulp.task('minify-css', ['sass'], function() {
    return gulp.src('components/**/main.css')
        .pipe(concat('main.css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest(tmp))
});

//CONCATENATE .JS, UGLIFY IT
gulp.task('concat', function() {
    return gulp.src(['components/**/*.js', '!components/build{,/**}'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(tmp + 'js'))
        //NO MINIFICA CON COMPONENTES
        /*        .pipe(uglify({ mangle: true }))
                .pipe(rename('app.min.js'))
                .pipe(gulp.dest(tmp))*/
});


//PUG TO html
gulp.task('views', function buildHTML() {
    return gulp.src('components/**/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(rename({ dirname: '' }))
        .pipe((gulp.dest('components/build/html')))
});

//HTML MINIFIED

gulp.task('minify-html', ['views'], function() {
    return gulp.src('components/build/html/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(replaceName(/\.template\.html/g, '.html'))
        .pipe(gulp.dest(tmp));
});

//CHECK CHANGES 
gulp.task('watch', ['browserSync'], function() {
    gulp.watch('components/**/*.pug', ['minify-html']);
    gulp.watch('components/**/*.js', ['concat']);
    gulp.watch('components/**/*.scss', ['minify-css']);
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
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('components/build/bower'));
});

gulp.task('concatbower', function() {
    return gulp.src('components/build/bower/*.js')
        .pipe(concat('bower.js'))
        .pipe(gulp.dest(tmp + 'js'));
});


gulp.task('default', function(callback) {
    runSequence(['bower', 'concat', 'minify-css', 'minify-html', 'watch'],
        callback
    )
});