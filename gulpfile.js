var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');

gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false,
        open: false
    });
});

gulp.task('scss', () => {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
        //.pipe(cleancss({level:{1:{specialCommenta:0}}})) //(opt.)
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});

//Minimizing common.js
gulp.task('common-js', () => {
	return gulp.src([
		'app/js/common.js',
		])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

//Concat of minimize .js files
gulp.task('js', ['common-js'], () => {
	return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
		'app/js/common.min.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	//.pipe(uglify()) // Minimize all js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', ['scss', 'js', 'browser-sync'], () => {
    gulp.watch('app/scss/**/*.scss', ['scss']);
    gulp.watch(['app/**/*.js','app/js/common.js'], ['js']);
    gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('default', ['watch']);