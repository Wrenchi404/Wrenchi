import { error, warn, log } from "../lib/Logger"

let oldConsoleLog = console.log;
console.log = (...args: any[]) => {
    oldConsoleLog(...log(...args));
}

let oldConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
    oldConsoleWarn(...warn(...args));
}

let oldConsoleError = console.error;
console.error = (...args: any[]) => {
    oldConsoleError(...error(...args));
}