'use strict';

var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: './dist',
        publicPath: '/assets/',
        filename: 'index.js',
        library: 'react-moment',
        libraryTarget: 'umd'
    },
    devServer: {
        port: 3003
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: require.resolve('babel-loader'),
            query: {
                presets: [
                    'babel-preset-es2015',
                    'babel-preset-stage-2',
                    'babel-preset-react'
                ].map(require.resolve)
            }
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};