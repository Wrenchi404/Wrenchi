import { red, yellow, cyan, green, blue } from "colorette"

function getTime() {
    let date = new Date();
    let IST = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    let time = IST.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "IST"
    })

    return `${green(
        `[${IST.getHours()}:${IST.getMinutes()}}]`
    )} | ${cyan(time)} | `;
}

function log(...args) {
    return [getTime() + blue("[INFO]: "), ...args];
}

function warn(...args) {
    return [getTime() + yellow("[WARN]: "), ...args];
}

function error(...args) {
    return [getTime() + red("[ERROR]: "), ...args];
}

export {
    log,
    warn,
    error
}