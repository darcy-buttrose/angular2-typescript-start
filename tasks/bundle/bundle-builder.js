var path = require('path');
var gutil = require('gulp-util');
var utils = require('../utils/utils');
var notify = require('../utils/notify');

module.exports = function(options) {

   options = options || {};
   options.entryJs = options.entryJs || "index.js";
   options.entryCss = options.entryCss || "index.css";

   return function(gulp) {
      gulp.task('clean-scripts', function(cb) {
         var del = require('del');

         del('build/build.js', function (err) {
            gutil.log("Deleted " + 'build/build.js');
            cb(err);
         });
      });

      gulp.task('traceur', function (cb) {
         var Duo = require("duo");
         var typescript = require('duo-typescript');
         var debower = require('duo-debower');
         var traceur = require('duo-traceur');

         var duo = new Duo(process.cwd())

         duo
         .entry(options.entryJs)
         //  .include('$traceurRuntime', require.resolve("traceur/bin/traceur-runtime"))
         //.usePackage(debower({"gulpMode": true}))
         .plugin(debower({"gulpMode": true}))
         .development(true)
         //.use(typescript({ sourceMap: true, target: 'es6', mapRoot: 'build/' }))
         //.use(traceur({"types": true, "annotations": true}))
         .use(typescript())
         .run(function(err, src) {
            if (err) {
               console.log(err);
               cb();
            }
            else {
               var filename = 'build/build.js';
               utils.ensureWriteFile(filename, src, function(err) {
                  if (err) throw err;
                  gutil.log('Generated ' + filename);
                  cb();
               });
            }
         });
      });

      gulp.task('bundle-scripts', ['clean-scripts'], function (cb) {
         var Duo = require("duo");
         var typescript = require('duo-typescript');
         var debower = require('duo-debower');
         var traceur = require('duo-traceur');

         var duo = new Duo(process.cwd())

         duo
         .entry(options.entryJs)
         //.usePackage(debower({"gulpMode": true}))
         .plugin(debower({"gulpMode": true}))
         .development(true)
         //.use(typescript({ sourceMap: true, target: 'es6', mapRoot: 'build/' }))
         .use( traceur({
            "asyncFunctions": true,
            "atscript": true,
            "memberVariables": true,
            "types": true,
            "annotations": true,
            "experimental": true,
            "modules": "commonjs"
         })
      )
      .use(typescript())
      .run(function(err, src) {
         if (err) {
            console.log(err);
            cb();
         }
         else {
            var filename = 'build/build.js';
            utils.ensureWriteFile(filename, src, function(err) {
               if (err) throw err;
               gutil.log('Generated ' + filename);
               cb();
            });
         }
      });
   });

   gulp.task('clean-styles', function(cb) {
      var del = require('del');

      del('build/build.css', function (err) {
         gutil.log("Deleted " + 'build/build.css');
         cb(err);
      });
   });

   gulp.task('bundle-styles', ['clean-styles', 'bundle-scripts'], function (cb) {
      var Duo = require("duo");
      var debower = require('duo-debower');
      //var sass = require('duo-sass')
      var duo = new Duo(process.cwd());

      duo
      .entry(options.entryCss)
      //.usePackage(debower({"gulpMode": true, "generateMain": true}))
      .plugin(debower({"gulpMode": true}))
      .run(function(err, src) {
         if (err) {
            gutil.log(err);
            cb(err);
         }
         else {
            var filename = 'build/build.css';
            utils.ensureWriteFile(filename, src, function(err) {
               if (err) throw err;
               gutil.log('Generated ' + filename);
               cb();
            });
         }
      });
   });

   var watchOpts =  {
      read: false,
      debounceDelay: 1000,
      interval: 500
   };

   gulp.task('watch', [ 'bundle-scripts', 'bundle-styles' ], function () {
      var duoJson = require('../../components/duo.json');
      var csslist = Object.keys(duoJson).filter(function(key) {
         console.log(path.extname(key));
         return path.extname(key) == '.css';
      });
      var jslist = Object.keys(duoJson).filter(function(key) {
         return path.extname(key) != '.css';
      });
      gulp.watch(jslist, watchOpts, [ 'bundle-scripts' ]);
      gulp.watch(csslist, watchOpts, [ 'bundle-styles' ]);
   });

   gulp.task('bundle', ['bundle-scripts', 'bundle-styles']);
   gulp.task('default', ['bundle']);
}
}
