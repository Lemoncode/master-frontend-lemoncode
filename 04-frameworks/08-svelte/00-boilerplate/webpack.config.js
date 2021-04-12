const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  context: path.resolve(__dirname, "./src"),
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index.js",
  },
  devServer: {
    stats: "errors-only",
  },
  plugins: [
    new HtmlWebpackPlugin({
      scriptLoading: "blocking",
    }),
  ],
};
