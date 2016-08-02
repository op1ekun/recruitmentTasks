module.exports = function karmaConfig(config) {

    config.set({

        basePath: '',
        port: 9876,
        frameworks: [
            'mocha',
        ],

        // client: {
        //     mocha: {
        //         timeout: 5000,
        //     },
        // },

        colors: true,
        logLevel: config.LOG_ERROR, // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        autoWatch: true,
        singleRun: true,

        browsers: [
            'PhantomJS',
            'Chrome',
        ],

        reporters: [
            'spec',
        ],

        files: [
            'node_modules/chai/chai.js',
            'node_modules/chai-spies/chai-spies.js',
            'node_modules/babel-polyfill/dist/polyfill.js',
            'js/mosaic.js',
            'tests/**/*.spec.js',
        ],

        preprocessors: {
            'tests/**/*.spec.js': [
                'webpack',
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
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-webpack',
            'karma-spec-reporter',
        ],
    });
};
