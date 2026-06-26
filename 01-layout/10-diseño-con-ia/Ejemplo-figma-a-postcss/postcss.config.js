import postcssImport from 'postcss-import';
import postcssMixins from 'postcss-mixins';
import postcssCustomMedia from 'postcss-custom-media';
import postcssNesting from 'postcss-nesting';
import autoprefixer from 'autoprefixer';

// El orden importa: import inlinea los parciales, luego mixins y custom-media
// resuelven sus tokens, después se aplana el nesting y por último autoprefixer.
export default {
  plugins: [
    postcssImport(),
    postcssMixins(),
    postcssCustomMedia(),
    postcssNesting(),
    autoprefixer(),
  ],
};
