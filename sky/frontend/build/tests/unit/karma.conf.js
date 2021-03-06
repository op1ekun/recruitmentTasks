// Karma configuration
// Generated on Sat Apr 05 2014 17:18:06 GMT+0200 (Romance Daylight Time)
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../../../../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'node_modules/angular/angular.min.js',
        'node_modules/angular-ui-router/release/angular-ui-router.min.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'frontend/src/common/app.js',
        'frontend/src/**/*.tmpl',
        'frontend/src/**/*.js',
        'frontend/test/**/*.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'frontend/src/**/*.js': [ 'coverage' ],
        'frontend/src/**/*.tmpl': [ 'ng-html2js' ],
    },

    coverageReporter: {
        reporters: [
            {
                type: 'text-summary'
            },
            {
                type: 'html'
            }
        ]
    },

    ngHtml2JsPreprocessor: {
        stripPrefix: 'frontend/',
        moduleName: 'partials' 
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    plugins: [
        'karma-chrome-launcher',
        'karma-phantomjs-launcher',
        'karma-spec-reporter',
        'karma-jasmine',
        'karma-coverage',
        'karma-ng-html2js-preprocessor'
    ],

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
        'Chrome',
        // 'PhantomJS'
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
