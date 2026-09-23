const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const helpers = require("./helpers");

module.exports = (env = {}) => {
  const { embedAssets = false } = env;

  return {
    context: helpers.srcPath, // src
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    entry: {
      app: ["./bootstrap.entrypoint.tsx"],
    },
    output: {
      // Ruta para depositar los artefactos de salida.
      path: helpers.buildPath,
      // Nombre para los bundles de salida.
      filename: `${helpers.projectName}-[name].js`,
      // Nombre para los assets de salida.
      assetModuleFilename: "assets/[name].[ext]",
    },
    module: {
      rules: [
        // Generic rule for source code.
        {
          test: /\.(jsx?|tsx?)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        // Generic rule for vendor css. NO CSS Modules.
        {
          test: /\.css$/,
          include: /node_modules/,
          use: [{ loader: "style-loader" }, { loader: "css-loader" }],
        },
        // Generic rule for assets.
        {
          test: /\.(jpe?g|svg|png|gif|ico|eot|ttf|woff|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
          type: embedAssets ? "asset/inline" : "asset/resource",
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        // name: "container",
        remotes: {
          clock: "container@http://localhost:3001/clock-container.js",
          quote: "container@http://localhost:3002/quote-container.js",
        },
        shared: ["react", "react-dom/client", "react-router-dom", "@emotion/css"],
      }),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "index.html",
        hash: true,
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: process.env.WEBPACK_SERVE ? "disabled" : "static",
        openAnalyzer: false,
        reportFilename: "report/report.html",
      }),
    ],
  };
};
