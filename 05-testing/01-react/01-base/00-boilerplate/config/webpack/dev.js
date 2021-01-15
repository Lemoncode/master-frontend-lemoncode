const merge = require('webpack-merge');
const base = require('./base');
const helpers = require('./helpers');

const hotReloadingEntries = ['react-hot-loader/patch'];

module.exports = merge.strategy({
  entry: 'prepend',
})(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  entry: {
    app: hotReloadingEntries,
  },
  output: {
    path: helpers.resolveFromRootPath('dist'),
    filename: '[name].js',
  },
  devServer: {
    inline: true,
    host: 'localhost',
    port: 8080,
    stats: 'minimal',
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]',
          esModule: false,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
});
