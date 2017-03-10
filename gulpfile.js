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
var Server = require('karma').Server;


var tmp = ".tmp/"

//SASS *
gulp.task('sass', function() {
    return gulp.src('app/main.scss')
        .pipe(sass())
        .pipe(rename({ dirname: '' }))
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(tmp))
});

gulp.task('minify-css', ['sass'], function() {
    return gulp.src('app/components/build/css/main.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(tmp))
});

gulp.task('concat-css', ['sass'], function() {
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
    return gulp.src(['app/app.module.js', 'app/components/**/*.js', '!app/**/*.spec.js'])
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
        .pipe((gulp.dest(tmp + 'views')))
});

//HTML MINIFIED

gulp.task('minify-html', ['views'], function() {
    return gulp.src(tmp + 'views/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(tmp + 'views'))

});

//INDEX MOVE
gulp.task('index', ['minify-html'], function() {
    gulp.src(tmp + 'views/index.html')
        .pipe(gulp.dest(tmp))
});
gulp.task('cleanFiles', ['index'], function() {
    gulp.src(tmp + 'views/index.html')
        .pipe(clean())
});
//MOVE ASSETS
gulp.task('fonts', function() {
    gulp.src('app/assets/fonts/*')
        .pipe(gulp.dest(tmp + 'fonts'))
});
gulp.task('assets', ['fonts'], function() {
    gulp.src('app/assets/images/*')
        .pipe(gulp.dest(tmp + 'images'))
});
/*gulp.task('', [''], function() {});*/
//CHECK CHANGES 
gulp.task('watch', ['browserSync'], function() {
    gulp.watch('app/**/*.pug', ['index']);
    gulp.watch('app/**/*.js', ['concat']);
    gulp.watch('app/**/*.scss', ['concat-css']);
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
    });
});


//BOWER FILES
gulp.task('bower', function() {
    return gulp.src([
            'app/bower_components/angular/angular.min.js',
            'app/bower_components/angular-route/angular-route.min.js',
            'app/bower_components/jquery/dist/jquery.min.js',
            'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
            'app/bower_components/angular-mocks/angular-mocks.js'
        ])
        .pipe(concat('bower.js'))
        .pipe(gulp.dest(tmp + 'js'));
});


//TEST
gulp.task('test', function(done) {
    return new Server({
        configFile: 'C:/Users/ALUO/Desktop/GestorContrasenas/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('default', function(callback) {
    runSequence(['bower', 'concat', 'concat-css', 'cleanFiles', 'assets', 'watch'],
        callback
    )
});