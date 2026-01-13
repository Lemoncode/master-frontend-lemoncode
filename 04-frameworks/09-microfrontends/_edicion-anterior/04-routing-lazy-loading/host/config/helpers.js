const path = require("path");

const rootPath = path.resolve(__dirname, "..");
const resolveFromRootPath = (...args) => path.join(rootPath, ...args);

exports.projectName = process.env.npm_package_name;
exports.rootPath = rootPath;
exports.srcPath = resolveFromRootPath("src");
exports.buildPath = resolveFromRootPath("build");
exports.resolveFromRootPath = resolveFromRootPath;
