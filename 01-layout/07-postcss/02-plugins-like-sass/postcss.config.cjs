const postcssPresetEnv = require('postcss-preset-env');
const postcssImport = require('postcss-import');
const simpleVars = require('postcss-simple-vars');
const mixins = require('postcss-mixins');
const postcssNested = require('postcss-nested');
// const cssnano = require('cssnano');
// postcss.config.cjs
module.exports = {
  plugins: [
    postcssImport(),
    simpleVars(),
    mixins(),
    postcssNested(),
    postcssPresetEnv({
      stage: 1
    })
    // cssnano({
    //   preset: [
    //     'default',
    //     {
    //       calc: false // Disable calc optimizations to avoid conflicts with relative color syntax
    //     }
    //   ]
    // })
  ]
};
