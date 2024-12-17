(function(global, factory) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    // CJS
    console.log("[UMD] Serving in format CommonJS");
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    // AMD
    console.log("[UMD] Serving in format AMD");
    define("my-lib", factory);
  } else {
    // Global VAR
    console.log("[UMD] Serving in format global VAR");
    global.MyLib = factory();
  }
})(globalThis || self || global || this, function factory() {
  function myFn() {
    console.log("I am UMD");
  }

  return {
    myFn,
  };
});
