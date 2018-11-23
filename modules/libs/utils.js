export function isType(o, type) {
    return Object.prototype.toString.call(o).toLowerCase() === `[object ${type}]`;
}