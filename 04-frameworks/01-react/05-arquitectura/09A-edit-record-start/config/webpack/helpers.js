const path = require('path');

const rootPath = path.resolve(__dirname, '../../');

exports.resolveFromRootPath = (...args) => path.join(rootPath, ...args);
