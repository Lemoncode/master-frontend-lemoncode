const postcssPresetEnv = require('postcss-preset-env');
// const cssnano = require('cssnano');
// postcss.config.js
module.exports = {
  plugins: [
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
