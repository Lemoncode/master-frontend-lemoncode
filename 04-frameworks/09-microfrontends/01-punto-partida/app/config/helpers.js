const path = require("path");

const rootPath = path.resolve(__dirname, "..");
const resolveFromRootPath = (...args) => path.join(rootPath, ...args);

exports.bundleName = process.env.npm_package_name;
exports.versionName = JSON.stringify(process.env.npm_package_version).replace(/"/g, "");
exports.rootPath = rootPath;
exports.srcPath = resolveFromRootPath("src");
exports.buildPath = resolveFromRootPath("build");
exports.resolveFromRootPath = resolveFromRootPath;
