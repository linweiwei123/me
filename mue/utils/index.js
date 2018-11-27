export function isType(obj, type) {
    return Object.prototype.toString.call(obj).toLowerCase() === `[object ${type}]`;
}