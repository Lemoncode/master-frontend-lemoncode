const { merge } = require("webpack-merge");
const configCommon = require("./common");
const configMicroapp = require("./microapp");

module.exports = (env = {}) =>
  // Indicar que siempre embeba los assets
  merge(configCommon({ ...env, embedAssets: true }), configMicroapp(env), {
    mode: "production",
  });
