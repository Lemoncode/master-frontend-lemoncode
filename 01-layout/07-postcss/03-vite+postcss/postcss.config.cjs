const postcssPresetEnv = require('postcss-preset-env');
const simpleVars = require('postcss-simple-vars');
const postcssMixins = require('postcss-mixins');
const postcssNested = require('postcss-nested');

module.exports = {
  plugins: [
    simpleVars(),
    postcssMixins(),
    postcssNested(),

    /* other plugins */
    /* remove autoprefixer if you had it here, it's part of postcss-preset-env */
    postcssPresetEnv({
      /* pluginOptions */
      stage: 1
    })
  ]
};
