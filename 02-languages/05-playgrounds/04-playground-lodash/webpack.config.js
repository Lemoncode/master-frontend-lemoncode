const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  context: path.join(__dirname, 'src'),
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.ts']
  },
  entry: ['./log.js', './index.js'],
  devServer: {
    port: 3000,
    hot: true,
    clientLogLevel: 'silent',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html'
    })
  ]
};
