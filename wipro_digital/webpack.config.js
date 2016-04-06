var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
 
module.exports = {
    entry: './app/app.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app/app.js'
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        }),
        new CopyWebpackPlugin([           
            { from: 'index.html', to: 'index.html' },
            { from: 'css/main.css', to: 'css/main.css' },
            { 
                from: 'node_modules/whatwg-fetch/fetch.js', 
                to: 'node_modules/whatwg-fetch/fetch.js'
            }
        ])
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ],
    }
};