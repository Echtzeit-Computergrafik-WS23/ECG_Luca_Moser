"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shallowCopy = exports.assert = exports.throwError = exports.logWarning = exports.logInfo = void 0;
// =============================================================================
// Logging
// =============================================================================
/** Logs a message to the console if DEBUG is true.
 * @param message Message to log if DEBUG is true.
 *  Is a function to avoid evaluating the condition if DEBUG is false.
 */
// @ts-ignore: Unused function
function logInfo(message) {
    if (DEBUG) {
        console.log(message());
    }
}
exports.logInfo = logInfo;
/** Logs a warning to the console if DEBUG is true.
 * @param message Message to log if DEBUG is true.
 *  Is a function to avoid evaluating the condition if DEBUG is false.
 */
// @ts-ignore: Unused function
function logWarning(message) {
    if (DEBUG) {
        console.warn(message());
    }
}
exports.logWarning = logWarning;
/** Throws an error with a detailed message if DEBUG is true,
 * otherwise throws a generic error.
 * @param message Error message to throw if DEBUG is true.
 *  Is a function to avoid evaluating the condition if DEBUG is false.
 */
// @ts-ignore: Unused function
function throwError(message) {
    if (DEBUG) {
        throw new Error(message());
    }
    else { // LATER: Add error ids for release mode.
        throw new Error("An error occurred.");
    }
}
exports.throwError = throwError;
/** Throws an error if the given condition is false.
 * @param condition Condition funtion producing a truth value and error message.
 *  Is a function to avoid evaluating the condition if DEBUG is false.
 */
// @ts-ignore: Unused function
function assert(condition) {
    if (DEBUG) {
        var _a = condition(), result = _a[0], message_1 = _a[1];
        if (!result) {
            throw new Error(message_1);
        }
    }
}
exports.assert = assert;
// =============================================================================
// Javascript
// =============================================================================
/** Return a shallow copy of the given value. */
function shallowCopy(value) {
    if (Array.isArray(value)) {
        return __spreadArray([], value, true);
    }
    else if (typeof value === "object") {
        return __assign({}, value);
    }
    else {
        return value;
    }
}
exports.shallowCopy = shallowCopy;
// =============================================================================
// Module variables
// =============================================================================
/** The development code contains more and detailled log messages.
 * During the final (uglify) build step, this debug flag is set to false,
 * and everything within `if(DEBUG){ ... }` blocks is removed.
 */
var DEBUG = true;
//# sourceMappingURL=dev.js.map