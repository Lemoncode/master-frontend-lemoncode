const HtmlWebpackPlugin = require("html-webpack-plugin");
const helpers = require("./helpers");

module.exports = (env = {}) => ({
  entry: {
    [helpers.bundleName]: ["./standalone.entrypoint.tsx"],
  },
  output: {
    path: helpers.buildStandalonePath,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      hash: true,
      chunksSortMode: "manual",
      chunks: ["manifest", "vendor", helpers.bundleName],
    }),
  ],
});
