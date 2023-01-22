const { merge } = require("webpack-merge");
const helpers = require("./helpers");
const configCommon = require("./webpack.common");

module.exports = (env = {}) =>
  merge(configCommon(env), {
    mode: "development",
    devtool: "eval-source-map",
    output: {
      // Nombre para los bundles de salida.
      filename: "[name].[contenthash].js",
      // Nombre para los assets de salida.
      assetModuleFilename: `assets/[name].[contenthash][ext]`,
    },
    devServer: {
      static: [
        {
          directory: helpers.resolveFromRootPath("../microapp-clock/build/microapp/"),
          publicPath: "/microapps",
        },
        {
          directory: helpers.resolveFromRootPath("../microapp-quote/build/microapp/"),
          publicPath: "/microapps",
        },
      ],
      host: "localhost",
      port: 3000,
      historyApiFallback: true,
      hot: true,
    },
  });
