module.exports = function (grunt) {
  var path = require('path'),
      fs = require('fs');

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    cacheBust: {
      options: {
        rename: false
      },
      assets: {
        files: [{
          src: ['index.html']
        }]
      }
    },
    sass: {
      options: {
        style: 'compressed'
      },
      dist: {
        files: [
          {
            expand: true,
            src: [
              "**/*.{scss, sass}",
              "!node_modules/**/*.{scss, sass}"
            ],
            ext: ".css"
          }
        ]
      }
    },
    browserify: {
      options: {
        exclude: [
          'js/vendor/jquery-2.1.3.min.js',
          'js/vendor/moment.min.js'
        ]
      },
      dist: {
        files: {
          "dist/phpepl.js": ["js/phpepl.js"]
        }
      }
    },
    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true
      },
      dist: {
        files: {
          "dist/phpepl.js": ['dist/phpepl.js']
        }
      }
    },
    watch: {
      sass: {
        files: [
          "**/*.scss",
          "!node_modules/**/*.scss",
          "!.git/**/*.scss",
          "!.sass-cache/**/*.scss",
          "!bower_components/**/*.scss",
          "!vendor/**/*.scss"
        ],
        tasks: [
          "newer:sass"
        ]
      },
      js: {
        files: [
          "js/**/*.js",
          "!js/vendor/**/*.js"
        ],
        tasks: [
          "browserify",
          "uglify",
          'cacheBust'
        ]
      }
    }
  });

  grunt.registerTask('default', ['watch']);
}