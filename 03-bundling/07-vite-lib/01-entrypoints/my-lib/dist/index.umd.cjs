(function (global, factory) {
  typeof exports == "object" && typeof module < "u"
    ? factory(exports)
    : typeof define == "function" && define.amd
    ? define(["exports"], factory)
    : ((global = typeof globalThis < "u" ? globalThis : global || self),
      factory((global.MyLib = {})));
})(this, function (exports) {
  function myFn() {
    console.log("I am UMD");
  }
  exports.myFn = myFn;
});
