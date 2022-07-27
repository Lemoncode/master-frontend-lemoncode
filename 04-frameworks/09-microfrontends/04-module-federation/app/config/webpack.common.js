const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const helpers = require("./helpers");

module.exports = (env = {}) => {
  const { assetEmbedLimit = 5000 } = env;

  return {
    context: helpers.srcPath, // src
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    entry: ["regenerator-runtime/runtime", "./app.bootstrap.tsx"],
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
        // Generic rules for assets.
        {
          test: /\.(woff)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: assetEmbedLimit,
                outputPath: "assets",
                mimetype: "font/woff",
                name: "[name].[contenthash].[ext]",
              },
            },
          ],
        },
        {
          test: /\.(woff2)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: assetEmbedLimit,
                outputPath: "assets",
                mimetype: "font/woff2",
                name: "[name].[contenthash].[ext]",
              },
            },
          ],
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: assetEmbedLimit,
                outputPath: "assets",
                mimetype: "font/ttf",
                name: "[name].[contenthash].[ext]",
              },
            },
          ],
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: assetEmbedLimit,
                outputPath: "assets",
                mimetype: "font/otf",
                name: "[name].[contenthash].[ext]",
              },
            },
          ],
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: assetEmbedLimit,
                outputPath: "assets",
                mimetype: "image/svg+xml",
                name: "[name].[contenthash].[ext]",
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|ico|gif)?$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: assetEmbedLimit,
                outputPath: "assets",
                name: "[name].[contenthash].[ext]",
              },
            },
          ],
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
        shared: ["react", "react-dom", "react-router-dom", "emotion"],
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
