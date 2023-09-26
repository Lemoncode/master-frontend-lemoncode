const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const base = require('./base');
const helpers = require('./helpers');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: helpers.resolveFromRootPath('dist'),
    filename: '[name].js',
  },
  devServer: {
    port: 8080,
    hot: true,
    proxy: {
      '/api': 'http://localhost:8081',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [require.resolve('react-refresh/babel')],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new Dotenv({
      path: 'dev.env',
    }),
  ],
});
