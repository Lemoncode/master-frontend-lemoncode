const path = require("path");

const rootPath = path.resolve(__dirname, "..");
const resolveFromRootPath = (...args) => path.join(rootPath, ...args);
const removeScopeInBundleName = scopedName => scopedName.replace(/@.+\//g, "");
const capitalizeString = s => s.charAt(0).toUpperCase() + s.slice(1);
const pascalizeString = dashedName =>
  dashedName
    .replace("@", "")
    .replace("/", "-")
    .split("-")
    .map(capitalizeString)
    .join("");

exports.bundleName = removeScopeInBundleName(process.env.npm_package_name); // @microapp/quote -> quote
exports.bundleNamePascalCase = pascalizeString(process.env.npm_package_name); // @microapp/quote -> MicroappQuote
exports.versionName = JSON.stringify(process.env.npm_package_version).replace(/"/g, "");
exports.rootPath = rootPath;
exports.srcPath = resolveFromRootPath("src");
exports.buildStandalonePath = resolveFromRootPath("build", "standalone");
exports.buildMicroappPath = resolveFromRootPath("build", "microapp");
