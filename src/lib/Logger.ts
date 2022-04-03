import { red, yellow, blue, green, cyan } from "colorette"

export function getTime() {
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
        `[${IST.getHours()}:${IST.getMinutes()}:${IST.getSeconds()}]`
    )} | ${cyan(time)} | `;
}

export function log(...args: any[]) {
    return [getTime() + blue("[INFO]: "), ...args];
}

export function warn(...args: any[]) {
    return [getTime() + yellow("[WARN]: "), ...args];
}

export function error(...args: any[]) {
    return [getTime() + red("[ERROR]: "), ...args];
}