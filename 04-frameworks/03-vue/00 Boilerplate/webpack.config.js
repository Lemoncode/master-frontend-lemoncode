const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const basePath = __dirname;

module.exports = (env, argv) => {
  const isDev = argv.mode !== 'production';
  return {
    context: path.join(basePath, 'src'),
    resolve: {
      extensions: ['.js', '.ts'],
    },
    entry: {
      app: './main.ts',
    },
    output: {
      path: path.join(basePath, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader?limit=10000&mimetype=application/font-woff',
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
        },
      ],
    },
    devtool: isDev ? 'inline-source-map' : 'none',
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        hash: true,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new ForkTsCheckerWebpackPlugin({
        tsconfig: path.join(basePath, './tsconfig.json'),
      }),
      isDev &&
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ].filter(Boolean),
  };
};
