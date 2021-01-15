const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('./prod');

module.exports = merge(config, {
  plugins: [new BundleAnalyzerPlugin()],
});
