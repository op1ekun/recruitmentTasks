var path = require('path');
var webpack = require('webpack');
 
module.exports = {
    entry: './lib/index.js',
    output: {
        path: path.join(__dirname, 'files'),
        filename: 'Framework.js'
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        }),
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