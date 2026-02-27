const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const helpers = require("./helpers");

module.exports = (env = {}) => {
  const { embedAssets = true } = env;

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
      // ⚠ Crítico para evitar colisión entre módulos de diferentes contenedores
      // remotos. Establece una especie de namespace para los modulos federados.
      uniqueName: helpers.projectName,
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
        name: "container",
        // filename: "quote-container.js",
        exposes: {
          "./widget": "./microapp.entrypoint",
        },
        shared: ["react", "react-dom/client", "@emotion/css"],
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
