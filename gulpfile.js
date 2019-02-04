const wiredep = require('wiredep').stream;
var exec = require('child_process').exec;
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var reload      = browserSync.reload;
var useref = require('gulp-useref');
var replace = require('gulp-replace');
 

var src = {
    scss: 'styles/*.scss',
    css:  'styles/',
    wp: 'functions.php',
    php: '*.php',
    all: '**/*.*'
};

gulp.task('concat', ['sass', 'scripts'], () => {
  return gulp.src(['./*.html', './*.php'])
    .pipe(useref({searchPath: ['.tmp', '.', '.']}))
    // .pipe(if('*.js', uglify()))
    // .pipe(if('*.css', cssnano({discardComments: true, safe: true, autoprefixer: false})))
    // .pipe(if('*.html', htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', () => {
  return gulp.src('scripts/**/*.js')
    // .pipe($.plumber())
    // .pipe($.sourcemaps.init())
    // .pipe($.babel())
    // .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});


gulp.task('wiredep', () => {
  gulp.src(src.wp)
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('./styles'));

  gulp.src(['./*.html', './*.php'])
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('.'));
});


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        proxy: "http://localhost/digicatt"
    });

    gulp.watch(src.scss, ['sass']).on('change', reload);
    gulp.watch(src.php).on('change', reload);
    // gulp.watch(src.all).on('change', reload);
});

// Compile sass into CSS
gulp.task('sass', function() {
    return gulp.src(src.scss)
        .pipe(sass({
        errLogToConsole: true,
        outputStyle: 'compressed'
        }))
        .pipe(gulp.dest(src.css))
        .pipe(reload({stream: true}));
});

// PHP-CS-FIXER (brew install php-cs-fix)

gulp.task('phpfix', function() {
    gulp.src("./*.php").on('change', function(event) {
        var command = "php-cs-fixer fix " + event.path + " --config-file=" + __dirname + "/.php_cs"
        exec(command);
        console.log("execute command: " + command);
    })
});


// gulp.task('default', ['wiredep', 'phpfix', 'serve']); 
gulp.task('default', ['wiredep', 'phpfix', 'serve']);