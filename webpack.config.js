'use strict';

var path = require("path");

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname),
        publicPath: '/',
        filename: 'demo.js'
    },
    devServer: {
      port: 6601,
      contentBase: path.resolve(__dirname),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules)/,
          loader: require.resolve('babel-loader'),
          query: {
            presets: [
              'babel-preset-es2015',
              'babel-preset-stage-2',
              'babel-preset-react'
            ].map(require.resolve)
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    }
};