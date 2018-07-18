var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var webpack = require('webpack');
var rimraf = require('rimraf');

var paths = require('./paths');


// -- Stylesheet -- Mattijs Schotsmans
gulp.task('style', function() {
  return gulp.src(paths.style.src)
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(paths.style.build));
});


// -- Javascript using Webpack -- Daan Hegger
gulp.task('script', function(done) {
  webpack(require('./webpack.config.js'), function(err, stats) {
    if (err) {
      console.log(err.toString());
    }
    // console.log(stats.toString());
    done();
  });
});

// -- Javascript using Webpack -- Daan Hegger
gulp.task('script:tree', function() {
  return gulp.src('src/script/tree.js')
    .pipe(gulp.dest('build'));
});


// -- HTML, just copy to build -- Daan Hegger
gulp.task('html', function() {
  return gulp.src(paths.html.src, {base: './src'})
    .pipe(gulp.dest(paths.html.build));
});


// -- Clean build folder -- Daan Hegger
gulp.task('clean', function(done) {
  rimraf('build', done);
});


// -- Default -- Daan Hegger
gulp.task('default', gulp.series('clean', 'style', 'script', 'script:tree', 'html'));


// -- Watch -- Daan Hegger
gulp.task('watch', gulp.series('default', function(done) {

  gulp.watch(paths.html.watch, gulp.series('html'));
  gulp.watch(paths.style.watch, gulp.series('style'));
  gulp.watch(paths.scripts.watch, gulp.series('script'));
  gulp.watch('src/script/tree.js', gulp.series('script:tree'));

  done();

}));
