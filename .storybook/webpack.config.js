// Extend Storybook's webpack config for TypeScript sources and legacy deps.
// https://storybook.js.org/docs/configurations/custom-webpack-config/

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve('ts-loader'),
        options: {
          transpileOnly: true,
        },
      },
    ],
  });

  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
