var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var browserify = require("browserify");
var watchify = require("watchify");
var babel = require("babelify");
var webserver = require("gulp-webserver");

function compile(watch) {
    var bundler = watchify(
        browserify("./src/index.js", { debug: true }).transform(babel)
    );

    function rebundle() {
        bundler
            .bundle()
            .on("error", function (err) {
                console.error(err);
                this.emit("end");
            })
            .pipe(source("build.js"))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest("./build"));
    }

    if (watch) {
        bundler.on("update", function () {
            console.log("-> bundling...");
            rebundle();
        });
    }

    rebundle();
}

function watch() {
    return compile(true);
}

gulp.task("build", function () {
    return compile();
});

gulp.task("watch", function () {
    return watch();
});

gulp.task("webserver", function () {
    gulp.src(".").pipe(
        webserver({
            livereload: true,
            open: true,
            host: "0.0.0.0",
        })
    );
});

gulp.task("default", gulp.parallel("watch", "webserver"));
