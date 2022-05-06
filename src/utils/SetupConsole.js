import { error, log, warn } from "../lib/Logger.js"

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