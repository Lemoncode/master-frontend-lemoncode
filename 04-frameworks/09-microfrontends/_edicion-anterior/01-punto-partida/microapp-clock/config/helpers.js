const path = require("path");

const rootPath = path.resolve(__dirname, "..");
const resolveFromRootPath = (...args) => path.join(rootPath, ...args);
const removeScopeInProjectName = (scopedName) => scopedName.replace(/@.+\//g, "");

exports.projectName = removeScopeInProjectName(process.env.npm_package_name); // @microapp/clock -> clock
exports.rootPath = rootPath;
exports.srcPath = resolveFromRootPath("src");
exports.buildPath = resolveFromRootPath("build");
exports.resolveFromRootPath = resolveFromRootPath;
