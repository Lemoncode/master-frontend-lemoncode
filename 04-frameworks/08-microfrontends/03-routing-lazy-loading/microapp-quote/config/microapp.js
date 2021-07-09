const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const helpers = require("./helpers");

module.exports = (env = {}) => ({
  entry: {
    [helpers.bundleName]: ["./microapp.entrypoint.tsx"],
  },
  output: {
    path: helpers.buildMicroappPath,
    filename: `[name].js`,
    // Esta es la forma mas sencilla de exportar la librería al hacer microfrontends
    // aunque no la más compatible de cara a consumirla para otros usos.
    library: {
      type: "var",
      name: helpers.bundleNamePascalCase,
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${helpers.rootPath}/package.json`,
          to: `${helpers.buildMicroappPath}/package.json`,
        },
        {
          from: `${helpers.srcPath}/microapp.d.ts`,
          to: `${helpers.buildMicroappPath}/${helpers.bundleName}.d.ts`,
        },
      ],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "report/report.html",
    }),
  ],
});
