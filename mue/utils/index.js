export function isType(obj, type) {
    return Object.prototype.toString.call(obj).toLowerCase() === `[object ${type}]`;
}

export function deepCopy(out) {
    out = out || {};

    for (var i = 1, len = arguments.length; i < len; ++i) {
        var obj = arguments[i];

        if (!obj) {
            continue;
        }

        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }

            // based on https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
            if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
                out[key] = deepExtend(out[key], obj[key]);
                continue;
            }

            out[key] = obj[key];
        }
    }

    return out;
};