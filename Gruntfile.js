module.exports = function (grunt) {
    var path = require('path'),
        fs = require('fs');

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
      "sass": {
        "dist": {
          "files": [
            {
              "expand": true,
              "src": [
                "**/*.{scss, sass}",
                "!node_modules/**/*.{scss, sass}"
              ],
              "ext": ".css"
            }
          ]
        }
      },
      "browserify": {
        "dist": {
          "files": {
            "dist/phpepl.js": ["src/phpepl.js"]
          }
        }
      },
      "uglify": {
        "options": {
          "sourceMap": true,
          "sourceMapIncludeSources": true
        },
        "dist": {
          "files": {
            "dist/phpepl.js": ['dist/phpepl.js']
          }
        }
      },
      "watch": {
        "sass": {
          "files": [
            "**/*.scss",
            "!node_modules/**/*.scss",
            "!.git/**/*.scss",
            "!.sass-cache/**/*.scss",
            "!bower_components/**/*.scss",
            "!vendor/**/*.scss"
          ],
          "tasks": [
            "newer:sass"
          ]
        },
        "js": {
          "files": [
            "src/**/*.js"
          ],
          "tasks": [
            "browserify",
            "uglify"
          ]
        },
        "all": {
          "files": [
            "**/*",
            "!node_modules/**/*",
            "!.git/**/*",
            "!.sass-cache/**/*",
            "!bower_components/**/*",
            "!vendor/**/*"
          ],
          "tasks": [
            "noop"
          ],
          "options": {
            "cwd": "./",
            "spawn": false,
            "event": [
              "added"
            ]
          }
        }
      }
    });

    grunt.registerTask('default', ['watch']);

    // Handle new files with that have a new, supported preprocessor
    grunt.event.on('watch', function(action, filepath) {
      var ext = path.extname(filepath);

      // Ignore directories
      if (fs.lstatSync(filepath).isDirectory()) return;

      if (action === 'added') {
        // This is a special message that's parsed by YA
        // to determine if support for an additional preprocessor is necessary
        // Note: this allows us to avoid controlling grunt manually within YA
        console.log('EXTADDED:' + ext);

      // Note: we don't do anything for newly added .js files
      // A new js file can't be the root unless it's changed to require
      // the current root and saved/changed
      } else if (action === 'changed' || action === 'deleted') {
        if (ext === '.js') {
          // Ignore bundles
          if (/.+bundle.js/g.test(filepath)) return;

          // Notify YA to recompute the roots and
          // generate a configuration
          console.log('JSCHANGED:' + filepath);
        }
      }
    });

    // For watching entire directories but allowing
    // the grunt.event binding to take care of it
    grunt.registerTask('noop', function () {});
  }