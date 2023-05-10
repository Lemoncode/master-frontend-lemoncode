const oldConsole = console.log;

console.log = (...args) => {
  setTimeout(oldConsole.bind(console, ...args), 0);
}
