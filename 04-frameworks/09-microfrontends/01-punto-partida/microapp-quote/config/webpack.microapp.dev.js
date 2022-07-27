const { merge } = require("webpack-merge");
const configCommon = require("./common");
const configMicroapp = require("./microapp");

module.exports = (env = {}) =>
  // Indicar al url-loader que siempre embeba los assets
  merge(configCommon({ ...env, assetEmbedLimit: true }), configMicroapp(env), {
    mode: "development",
    devtool: "eval-source-map",
    optimization: {
      minimize: false, // Desactivar minificacion
    },
  });
