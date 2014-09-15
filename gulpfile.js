// Gulpfile for Pattern Library
// Renders .scss files, uses Pleeease.io, doesn't stop gulp on error (gulp-plumber),
// -- notifies you if there are errors in your code (gulp-notify),
// -- & uses Browser Sync for livereload capability.
// Put your Sass (.scss) files in an "scss" directory in the root.
// -----------------------------------------------------

// Load all the dependencies
var gulp = require('gulp'),
  scss = require('gulp-ruby-sass'),
  plumber = require('gulp-plumber'),
  notify = require("gulp-notify"),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  imagemin = require('gulp-imagemin'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  browserSync = require('browser-sync');

// Browser Sync
gulp.task('browser-sync', function() {
    browserSync.init(null);
});

// Extracting and renaming Normalize CSS file from Bower components
gulp.task('bower-css', function(){
  gulp.src([
    'bower_components/normalize-css/normalize.css'
  ])
    .pipe(rename({ prefix: '_'}))
    .pipe(rename({ extname: '.scss' }))
    .pipe(gulp.dest('scss/vendor'));
});

// SCSS task
// Compile Our Sass from the "scss" directory, run it through Pleeease and output it to "stylesheets".
// If there are any errors, gulp-notify will tell us
gulp.task('scss', function() {
  gulp.src('scss/*.scss')
    .pipe(scss({style: 'expanded'}))
    .pipe(autoprefixer('last 4 versions', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1','ios 6', 'android 4'))
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(gulp.dest('stylesheets'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('stylesheets'))
    .pipe(browserSync.reload({stream:true}));
});

// Extracting Bower JS component files
gulp.task('bower-js', function(){
  gulp.src([
    'bower_components/svgeezy/svgeezy.js'
  ])
    .pipe(gulp.dest('javascripts/vendor'));
});

// Javascript
gulp.task('js', function() {
  return gulp.src(['javascripts/*.js', 'javascripts/**.js', 'javascripts/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('javascripts'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('javascripts'))
    .pipe(browserSync.reload({stream:true}));
});

// Auto-reload Templates
gulp.task('reload', function () {
  gulp.src('views/**/*.html')
    .pipe(browserSync.reload({stream:true}));
});

// Compress Image Task
gulp.task('image', function(){
  gulp.src('images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('images/'));
});

// Watch HTML, YML, and CSS
gulp.task('watch', function () {
  gulp.watch(['**/*.html','**/*.yml'],['reload']);
  gulp.watch([
    'scss/*.scss',
    'scss/**/*.scss'
  ],
    ['scss']);
});

// Use Sass, watch, & Browser Sync in Default Task
gulp.task('default', ['bower-css', 'scss', 'image', 'js', 'watch', 'browser-sync']);