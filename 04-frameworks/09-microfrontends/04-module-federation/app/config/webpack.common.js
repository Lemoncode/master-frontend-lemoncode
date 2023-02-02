const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const deps = require("../package.json").dependencies;
const helpers = require("./helpers");

module.exports = (env = {}) => {
  const { embedAssets = false } = env;

  return {
    context: helpers.srcPath, // src
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    entry: ["regenerator-runtime/runtime", "./app.bootstrap.ts"],
    cache: false,
    output: {
      path: helpers.buildPath,
      filename: `${helpers.bundleName}.js`,
      chunkFilename: `${helpers.bundleName}.[id].js`,
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
        // name: "AppContainer",
        remotes: {
          ClockContainer: "ClockContainer@http://localhost:3000/clock-container.js",
          QuoteContainer: "QuoteContainer@http://localhost:3000/quote-container.js",
        },
        shared: {
          react: {
            singleton: true,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
          "react-router-dom": {},
          "@emotion/css": {},
        },
      }),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "index.html",
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false,
        reportFilename: "report/report.html",
      }),
    ],
  };
};
