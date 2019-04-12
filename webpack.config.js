const path = require('path');

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'react-moment',
        libraryTarget: 'umd',
        globalObject: 'this'
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
      rules: [
          {
            include: /\.json$/,
            loader: require.resolve('json-loader')
          },
          {
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            loader: require.resolve('babel-loader'),
          }
        ]
    },
    resolve: {
      extensions: ['.json', '.js', '.jsx']
    }
};
