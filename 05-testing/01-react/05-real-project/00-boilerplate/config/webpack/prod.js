const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const base = require('./base');

module.exports = merge(base, {
  mode: 'production',
  output: {
    filename: 'js/[name].[chunkhash].js',
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: 'prod.env',
    }),
  ],
});
