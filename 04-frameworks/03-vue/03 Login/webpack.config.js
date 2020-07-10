const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const basePath = __dirname;

module.exports = (env, argv) => {
  const isDev = argv.mode !== 'production';
  return {
    context: path.join(basePath, 'src'),
    resolve: {
      extensions: ['.js', '.ts', '.vue'],
      alias: {
        vue: 'vue/dist/vue.runtime.esm.js',
      },
    },
    entry: {
      app: './main.ts',
      vendor: ['lc-form-validation', 'vue', 'vue-router', 'vuetify'],
      vendorStyles: ['../node_modules/vuetify/dist/vuetify.min.css'],
    },
    output: {
      path: path.join(basePath, 'dist'),
      filename: '[name].js',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            name: 'vendor',
            chunks: 'initial',
            enforce: true,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader',
        },
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/], // Add suffix to vue files to transpile ts scripts in vue files
              transpileOnly: true, // disable type checker - we will use it in fork plugin
            },
          },
        },
        {
          test: /\.css$/,
          use: [isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
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
        vue: true,
      }),
      new VueLoaderPlugin(),
      isDev &&
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ].filter(Boolean),
  };
};
