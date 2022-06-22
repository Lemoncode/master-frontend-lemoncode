const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const base = require('./base');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    filename: '[name].js',
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [require.resolve('react-refresh/babel')],
          },
        },
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: 'dev.env',
    }),
    new ReactRefreshWebpackPlugin(),
  ],
});
