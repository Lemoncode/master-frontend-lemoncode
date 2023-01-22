const { merge } = require("webpack-merge");
const configCommon = require("./common");
const configStandalone = require("./standalone");

module.exports = (env = {}) =>
  merge(configCommon(env), configStandalone(env), {
    mode: "development",
    devtool: "eval-source-map",
    output: {
      // Nombre para los bundles de salida.
      filename: "[name].[contenthash].js",
      // Nombre para los assets de salida.
      assetModuleFilename: `assets/[name].[contenthash][ext]`,
    },
    devServer: {
      host: "localhost",
      port: 3001,
      historyApiFallback: true,
      hot: true,
    },
  });
