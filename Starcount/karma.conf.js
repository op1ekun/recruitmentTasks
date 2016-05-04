const path = require('path');

module.exports = function karmaConfig(config) {

    config.set({

        basePath: '',
        port: 9876,
        frameworks: [
            'mocha',
        ],

        colors: true,
        logLevel: config.LOG_ERROR, // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        autoWatch: true,
        singleRun: true,

        browsers: [
            // 'Chrome',
            'PhantomJS',
        ],

        reporters: [
            'spec',
            'coverage',
        ],

        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            'lib/tests/**/*.spec.js',
        ],

        preprocessors: {
            'lib/tests/**/*.spec.js': [
                'webpack',
                'sourcemap',
            ],
        },

        coverageReporter: {
            reporters: [
                {
                    type: 'text-summary',
                },
                {
                    type: 'html',
                },
            ],
        },

        webpack: {
            isparta: {
                // these babel options will be passed only to isparta and not to babel-loader
                babel: {
                    presets: ['es2015'],
                },
            },
            module: {
                preLoaders: [
                    // instrument only testing sources with Istanbul
                    {
                        test: /\.js$/,
                        include: path.resolve('lib/'),
                        exclude: /\.spec.js$/,
                        loader: 'isparta',
                    },
                ],
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /(node_modules)/,
                        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
                        query: {
                            presets: [
                                'es2015',
                            ],
                        },
                    },
                ],
            },

            devtool: 'inline-source-map',
        },

        webpackMiddleware: {
            // Get rid of bundle now invalid followed by bundle is now valid messages
            noInfo: true,
        },

        plugins: [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-mocha',
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-spec-reporter',
            'karma-coverage',
        ],
    });
};
