const { merge } = require("webpack-merge");
const helpers = require("./helpers");
const configCommon = require("./common");
const configStandalone = require("./standalone");

module.exports = (env = {}) =>
  merge(configCommon(env), configStandalone(env), {
    mode: "production",
    output: {
      // Nombre para los bundles de salida.
      filename: `[name]-${helpers.versionName}.js`,
      // Nombre para los assets de salida.
      assetModuleFilename: `assets/[name].[contenthash][ext]`,
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
