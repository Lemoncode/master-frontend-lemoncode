const webpack = require("webpack");
const { merge } = require("webpack-merge");
const helpers = require("./helpers");
const configCommon = require("./webpack.common");

module.exports = (env = {}) =>
  merge(configCommon(env), {
    mode: "development",
    devtool: "eval-source-map",
    output: {
      filename: "[name].[contenthash].js",
    },
    devServer: {
      contentBase: [
        helpers.resolveFromRootPath("../microapp-clock/build/microapp/"),
        helpers.resolveFromRootPath("../microapp-quote/build/microapp/"),
      ],
      contentBasePublicPath: "/microapps",
      inline: true,
      host: "localhost",
      port: 3000,
      stats: "minimal",
      historyApiFallback: true,
      hot: true,
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
  });
