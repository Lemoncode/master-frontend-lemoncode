const { merge } = require("webpack-merge");
const helpers = require("./helpers");
const configCommon = require("./common");
const configStandalone = require("./standalone");

module.exports = (env = {}) =>
  merge(configCommon(env), configStandalone(env), {
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
  });
