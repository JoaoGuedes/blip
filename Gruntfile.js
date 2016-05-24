'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');

    var browserifyOptions = {
        browserifyOptions: {
            debug: true
        },
        transform: ['babelify'],
        require: [
            './app/js/controllers/list.js:List',
        ]
    },
        browserifyFiles = {
            'dist/js/bundle.js': ['app/js/*.js', '!app/js/**/*.spec.js']
        };

    grunt.initConfig({
        watch   : {
            options : {
                livereload: true
            },
            css : {
                files   : 'app/styles/**/*.scss',
                tasks   : ['sass']
            },
            html: {
                files   : 'app/public/**/*',
                tasks   : ['copy:html']
            },
            js  : {
                files: ['app/js/**/*.js'],
                tasks: ['browserify']
            },
            src : {
                files: 'app/config.js',
                tasks: ['copy:js']
            },
            test: {
                files: ['app/js/**/*.spec.js'],
                tasks: ['mochaTest']
            }
        },
        sass         : {
            dist     : {
                options: {
                    loadPath: ['app/bower_components/skeleton-sass/', 'app/bower_components/weather-icons/sass'],
                    style: 'compressed'
                },
                files: {
                    'dist/css/styles.css': 'app/styles/styles.scss'
                }
            }
        },
        copy         : {
            html     : {
                files: [{
                    expand  : true,
                    filter  : 'isFile',
                    cwd     : 'app/public',
                    src     : ['**/*'],
                    dest    : 'dist/'
                }]
            },
            js      : {
                files: {
                    'dist/js/config.js': 'app/config.js',
                    'dist/js/vendor/promise.min.js': 'app/bower_components/promise-polyfill/promise.min.js',
                    'dist/js/vendor/rivets.bundled.min.js': 'app/bower_components/rivets/dist/rivets.bundled.min.js'
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'dist/'
                }
            }
        },
        browserify: {
            dist: {
                options: Object.assign(Object.create(browserifyOptions), { plugin: ['minifyify'] }),
                files: browserifyFiles
            },
            dev: {
                options: browserifyOptions,
                files: browserifyFiles
            }
        },
        clean        : {
            options  : {
                force: true
            },
            dist     : ['./dist']
        },
        mochaTest    : {
            test     : {
                options: {
                    reporter: 'spec',
                    require: 'babel-register',
                    timeout: 5000
                },
                src  : ['app/js/**/*.spec.js']
            }
        }
    });

    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('serve', ['connect', 'watch']);
    grunt.registerTask('dev', ['clean', 'copy', 'browserify:dev', 'sass', 'connect', 'watch']);
    grunt.registerTask('build', ['clean', 'copy', 'browserify:dist', 'sass']);

};
