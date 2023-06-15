(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {},
    };
    factory(mod.exports);
    global.myLib = mod.exports;
  }
})(this, function (exports) {
  function myFn() {
    console.log("I am UMD");
  }
  exports.myFn = myFn;
});
