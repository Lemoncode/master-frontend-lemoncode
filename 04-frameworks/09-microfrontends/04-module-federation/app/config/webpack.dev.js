const { merge } = require("webpack-merge");
const helpers = require("./helpers");
const configCommon = require("./webpack.common");

module.exports = (env = {}) =>
  merge(configCommon(env), {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
      static: [
        {
          directory: helpers.resolveFromRootPath("../microapp-clock/build/microapp/"),
        },
        {
          directory: helpers.resolveFromRootPath("../microapp-quote/build/microapp/"),
        },
      ],
      host: "localhost",
      port: 3000,
      historyApiFallback: true,
      hot: true,
    },
  });
