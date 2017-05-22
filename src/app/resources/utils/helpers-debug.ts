export function debug(key, value) {
    window[key] = value;
}

export const l = console.log.bind(console);
export const g = console.log.bind(console);
export const w = console.warn.bind(console);
export const e = console.error.bind(console);


