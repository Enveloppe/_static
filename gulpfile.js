import gulp from "gulp";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import cleanCSS from "gulp-clean-css";

gulp.task('scripts', function() {
    return gulp.src("js/*.js")
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../docs/_static/js'));
    }
);


gulp.task("styles", function() {
    return gulp.src("css/*.css")
        .pipe(concat("styles.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest("../docs/_static/css"));
});


gulp.task('default', gulp.parallel('scripts', 'styles'));
