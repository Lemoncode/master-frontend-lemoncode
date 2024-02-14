const { merge } = require("webpack-merge");
const configCommon = require("./webpack.common");

module.exports = (env = {}) =>
  merge(configCommon(env), {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
      host: "localhost",
      port: 3002,
      historyApiFallback: true,
      hot: true,
    },
  });
