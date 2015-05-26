/**
 * Created by Darcy on 26/05/2015.
 */
module.exports = function(options) {

    var path = require('path');

    options = options || {};

    return function(gulp) {
        gulp.task('test', function (cb) {
            var jasmine = require('gulp-jasmine');

            gulp.src('test/*-spec.js')
                .pipe(jasmine())
                .on('end', cb);
        });
    }
}
