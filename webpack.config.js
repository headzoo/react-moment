'use strict';

module.exports = {
    entry: './src/index.js',
    output: {
        path: './dist',
        filename: 'index.js',
        library: 'react-moment',
        libraryTarget: 'umd'
    },
    externals: [
        {
            'react': {
                root: 'react',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react'
            },
            'moment': {
                root: 'moment',
                commonjs2: 'moment',
                commonjs: 'moment',
                amd: 'moment'
            }
        }
    ],
    module: {
        loaders: [
          {
            include: /\.json$/,
            loader: require.resolve('json-loader')
          },
          {
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
          }
        ]
    },
    resolve: {
      extensions: ['', '.json', '.js', '.jsx']
    }
};