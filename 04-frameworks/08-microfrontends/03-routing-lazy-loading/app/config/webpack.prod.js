const { merge } = require("webpack-merge");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const helpers = require("./helpers");
const configCommon = require("./webpack.common");

module.exports = (env = {}) =>
  merge(configCommon(env), {
    mode: "production",
    output: {
      filename: `[name]-${helpers.versionName}.js`,
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendorGroup: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            enforce: true,
          },
        },
      },
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false,
        reportFilename: "report/report.html",
      }),
    ],
  });
