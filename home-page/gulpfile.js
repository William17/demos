var gulp = require('gulp');
var stylus = require('gulp-stylus');
var path = require('path');

var PATH = {
  src: path.join(__dirname, '/src'),
  dist: path.join(__dirname, '/dist')
};

gulp.task('copy', ['copy:html']);

gulp.task('copy:html', function() {
  return gulp.src(PATH.src + '/*.html')
      .pipe(gulp.dest(PATH.dist));
});

gulp.task('css', function() {
  return gulp.src(PATH.src + '/css/*.styl')
    .pipe(stylus())
    .on('error', function(err) {
      console.log(err);
      this.end();
    })
    .pipe(gulp.dest(PATH.dist + '/css/'));
});

gulp.task('js', function() {
  return gulp.src(PATH.src + '/js/**/*')
    .pipe(gulp.dest(PATH.dist + '/js/'));
});

gulp.task('clean', function() {
  return gulp.src(PATH.dist + '/*', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('build', ['copy', 'css', 'js']);