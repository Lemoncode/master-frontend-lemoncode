const path = require("path");

module.exports = {
  entry: ["./src/students.js"],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, "./src"),
    port: 8080,
  },
};
