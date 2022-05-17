const { error, log, warn } = require("../lib/Logger");

let oldConsoleLog = console.log;
console.log = (...args) => {
    oldConsoleLog(...log(...args));
}

let oldConsoleWarn = console.warn;
console.warn = (...args) => {
    oldConsoleWarn(...warn(...args));
}

let oldConsoleError = console.error;
console.error = (...args) => {
    oldConsoleError(...error(...args));
}