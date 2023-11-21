"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.epsilon = exports.range = exports.radians = exports.isPowerOf2 = exports.hex = exports.degrees = exports.clamp = exports.mat4 = exports.mat3 = exports.vec3 = exports.vec2 = void 0;
// =============================================================================
// Module state
// =============================================================================
var epsilon = 0.000001;
exports.epsilon = epsilon;
// =============================================================================
// Module functions
// =============================================================================
/** Radians from degrees.
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
function radians(degrees) { return degrees * Math.PI / 180; }
exports.radians = radians;
/** Degrees from radians.
 * @param radians Angle in radians
 * @returns Angle in degrees
 */
function degrees(radians) { return radians * 180 / Math.PI; }
exports.degrees = degrees;
/** Clamp a value between a minimum and maximum.
 * @param x Value to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @returns Clamped value
 */
function clamp(x, min, max) { return Math.min(Math.max(x, min), max); }
exports.clamp = clamp;
/** Python-like integer range function.
 * @param start Start value (or stop if stop is undefined).
 * @param stop Stop value
 * @param step Step per iteration. Defaults to 1.
 * @returns Iterable range object
 */
function range(start, stop, step) {
    var sign;
    if (step === void 0) { step = 1; }
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                start = Math.round(start);
                if (stop === undefined) {
                    stop = start;
                    start = 0;
                }
                else {
                    stop = Math.round(stop);
                }
                step = Math.max(1, Math.round(Math.abs(step)));
                sign = Math.sign(stop - start) || 1;
                _a.label = 1;
            case 1:
                if (!(Math.sign(stop - start) !== -sign)) return [3 /*break*/, 3];
                return [4 /*yield*/, start];
            case 2:
                _a.sent();
                start += step * sign;
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
exports.range = range;
/** Convert a number to a hexadecimal string.
 * @param value Number to convert
 * @returns Hexadecimal string
 */
function hex(value) {
    return value.toString(16).padStart(2, '0');
}
exports.hex = hex;
/** Returns true if the given value is a power of 2. */
function isPowerOf2(value) {
    return Number.isInteger(value) && (value & (value - 1)) === 0;
}
exports.isPowerOf2 = isPowerOf2;
// =============================================================================
// Vec2
// =============================================================================
var vec2 = {
    zero: function () { return [0, 0]; },
    one: function () { return [1, 1]; },
    random: function (scale) {
        if (scale === void 0) { scale = 1; }
        return vec2.scale(vec2.normalize([Math.random(), Math.random()]), scale);
    },
    create: function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        return [x, y];
    },
    clone: function (v) { return [v[0], v[1]]; },
    copy: function (out, v) { out[0] = v[0]; out[1] = v[1]; return out; },
    add: function (out, v) { out[0] += v[0]; out[1] += v[1]; return out; },
    subtract: function (out, v) { out[0] -= v[0]; out[1] -= v[1]; return out; },
    multiply: function (out, v) { out[0] *= v[0]; out[1] *= v[1]; return out; },
    divide: function (out, v) { out[0] /= v[0]; out[1] /= v[1]; return out; },
    scale: function (out, s) { out[0] *= s, out[1] *= s; return out; },
    dot: function (a, b) { return a[0] * b[0] + a[1] * b[1]; },
    cross: function (a, b) { return a[0] * b[1] - a[1] * b[0]; },
    lengthSquared: function (v) { return vec2.dot(v, v); },
    length: function (v) { return Math.hypot(v[0], v[1]); },
    normalize: function (out) { return vec2.scale(out, 1 / vec2.length(out)); },
    distanceSquared: function (a, b) { return vec2.lengthSquared(vec2.subtract(vec2.clone(a), b)); },
    distance: function (a, b) { return vec2.length(vec2.subtract(vec2.clone(a), b)); },
    lerp: function (out, v, t) { return vec2.add(vec2.scale(out, 1 - t), vec2.scale(vec2.clone(v), t)); },
    ceil: function (out) { out[0] = Math.ceil(out[0]); out[1] = Math.ceil(out[1]); return out; },
    floor: function (out) { out[0] = Math.floor(out[0]); out[1] = Math.floor(out[1]); return out; },
    round: function (out) { out[0] = Math.round(out[0]); out[1] = Math.round(out[1]); return out; },
    min: function (out, b) { out[0] = Math.min(out[0], b[0]); out[1] = Math.min(out[1], b[1]); return out; },
    max: function (out, b) { out[0] = Math.max(out[0], b[0]); out[1] = Math.max(out[1], b[1]); return out; },
    clamp: function (out, min, max) { return vec2.min(vec2.max(out, min), max); },
    negate: function (out) { return vec2.scale(out, -1); },
    inverse: function (out) { out[0] = 1 / out[0]; out[1] = 1 / out[1]; return out; },
    angle: function (v) { return Math.atan2(v[1], v[0]); },
    rotate: function (out, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var x = out[0];
        var y = out[1];
        out[0] = x * c - y * s;
        out[1] = x * s + y * c;
        return out;
    },
    transformMat2: function (v, m) { return [v[0] * m[0] + v[1] * m[2], v[0] * m[1] + v[1] * m[3]]; },
    equals: function (a, b) { return Math.abs(a[0] - b[0]) <= epsilon && Math.abs(a[1] - b[1]) <= epsilon; },
};
exports.vec2 = vec2;
Object.freeze(vec2);
// =============================================================================
// Vec3
// =============================================================================
var vec3 = {
    zero: function () { return [0, 0, 0]; },
    one: function () { return [1, 1, 1]; },
    random: function (scale) {
        if (scale === void 0) { scale = 1; }
        return vec3.scale(vec3.normalize([Math.random(), Math.random(), Math.random()]), scale);
    },
    create: function (x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        return [x, y, z];
    },
    clone: function (v) { return [v[0], v[1], v[2]]; },
    copy: function (out, v) { out[0] = v[0]; out[1] = v[1]; out[2] = v[2]; return out; },
    add: function (out, v) { out[0] += v[0]; out[1] += v[1]; out[2] += v[2]; return out; },
    subtract: function (out, v) { out[0] -= v[0]; out[1] -= v[1]; out[2] -= v[2]; return out; },
    multiply: function (out, v) { out[0] *= v[0]; out[1] *= v[1]; out[2] *= v[2]; return out; },
    divide: function (out, v) { out[0] /= v[0]; out[1] /= v[1]; out[2] /= v[2]; return out; },
    scale: function (out, s) { out[0] *= s; out[1] *= s; out[2] *= s; return out; },
    dot: function (a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; },
    cross: function (out, b) {
        var ax = out[0], ay = out[1], az = out[2];
        var bx = b[0], by = b[1], bz = b[2];
        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    },
    lengthSquared: function (v) { return vec3.dot(v, v); },
    length: function (v) { return Math.hypot(v[0], v[1], v[2]); },
    normalize: function (out) {
        var len = vec3.length(out);
        return len ? vec3.scale(out, 1 / len) : out;
    },
    distanceSquared: function (a, b) { return vec3.lengthSquared(vec3.subtract(vec3.clone(a), b)); },
    distance: function (a, b) { return vec3.length(vec3.subtract(vec3.clone(a), b)); },
    lerp: function (out, v, t) { return vec3.add(vec3.scale(out, 1 - t), vec3.scale(vec3.clone(v), t)); },
    ceil: function (out) { out[0] = Math.ceil(out[0]); out[1] = Math.ceil(out[1]); out[2] = Math.ceil(out[2]); return out; },
    floor: function (out) { out[0] = Math.floor(out[0]); out[1] = Math.floor(out[1]); out[2] = Math.floor(out[2]); return out; },
    round: function (out) { out[0] = Math.round(out[0]); out[1] = Math.round(out[1]); out[2] = Math.round(out[2]); return out; },
    min: function (out, v) { out[0] = Math.min(out[0], v[0]); out[1] = Math.min(out[1], v[1]); out[2] = Math.min(out[2], v[2]); return out; },
    max: function (out, v) { out[0] = Math.max(out[0], v[0]); out[1] = Math.max(out[1], v[1]); out[2] = Math.max(out[2], v[2]); return out; },
    clamp: function (out, min, max) { return vec3.min(vec3.max(out, min), max); },
    negate: function (out) { return vec3.scale(out, -1); },
    inverse: function (out) { out[0] = 1 / out[0]; out[1] = 1 / out[1]; out[2] = 1 / out[2]; return out; },
    angle: function (a, b) { return Math.acos(vec3.dot(a, b) / (vec3.length(a) * vec3.length(b))); },
    rotateX: function (out, angle) {
        var y = out[1], z = out[2];
        var c = Math.cos(angle), s = Math.sin(angle);
        out[1] = y * c - z * s;
        out[2] = y * s + z * c;
        return out;
    },
    rotateY: function (out, angle) {
        var x = out[0], z = out[2];
        var c = Math.cos(angle), s = Math.sin(angle);
        out[0] = x * c + z * s;
        out[2] = -x * s + z * c;
        return out;
    },
    rotateZ: function (out, angle) {
        var x = out[0], y = out[1];
        var c = Math.cos(angle), s = Math.sin(angle);
        out[0] = x * c - y * s;
        out[1] = x * s + y * c;
        return out;
    },
    transformMat3: function (out, m) {
        var x = out[0], y = out[1], z = out[2];
        out[0] = x * m[0] + y * m[3] + z * m[6];
        out[1] = x * m[1] + y * m[4] + z * m[7];
        out[2] = x * m[2] + y * m[5] + z * m[8];
        return out;
    },
    transformMat4: function (out, m) {
        var x = out[0], y = out[1], z = out[2];
        out[0] = x * m[0] + y * m[4] + z * m[8] + m[12];
        out[1] = x * m[1] + y * m[5] + z * m[9] + m[13];
        out[2] = x * m[2] + y * m[6] + z * m[10] + m[14];
        return out;
    },
    equals: function (a, b) { return Math.abs(a[0] - b[0]) <= epsilon && Math.abs(a[1] - b[1]) <= epsilon && Math.abs(a[2] - b[2]) <= epsilon; },
};
exports.vec3 = vec3;
Object.freeze(vec3);
// =============================================================================
// Mat3
// =============================================================================
var mat3 = {
    identity: function () { return ([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ]); },
    clone: function (m) { return ([
        m[0], m[1], m[2],
        m[3], m[4], m[5],
        m[6], m[7], m[8]
    ]); },
    fromMat2: function (m) { return ([
        m[0], m[1], 0,
        m[2], m[3], 0,
        0, 0, 1
    ]); },
    fromMat4: function (m) { return ([
        m[0], m[1], m[2],
        m[4], m[5], m[6],
        m[8], m[9], m[10]
    ]); },
    copy: function (out, m) {
        for (var i = 0; i < 9; i++)
            out[i] = m[i];
        return out;
    },
    transpose: function (out) {
        var a01 = out[1], a02 = out[2], a12 = out[5];
        out[1] = out[3];
        out[2] = out[6];
        out[3] = a01;
        out[5] = out[7];
        out[6] = a02;
        out[7] = a12;
        return out;
    },
    invert: function (out) {
        var a00 = out[0], a01 = out[1], a02 = out[2];
        var a10 = out[3], a11 = out[4], a12 = out[5];
        var a20 = out[6], a21 = out[7], a22 = out[8];
        var b01 = a22 * a11 - a12 * a21;
        var b11 = -a22 * a10 + a12 * a20;
        var b21 = a21 * a10 - a11 * a20;
        var det = a00 * b01 + a01 * b11 + a02 * b21;
        if (!det) {
            return null;
        }
        det = 1 / det;
        out[0] = b01 * det;
        out[1] = (-a22 * a01 + a02 * a21) * det;
        out[2] = (a12 * a01 - a02 * a11) * det;
        out[3] = b11 * det;
        out[4] = (a22 * a00 - a02 * a20) * det;
        out[5] = (-a12 * a00 + a02 * a10) * det;
        out[6] = b21 * det;
        out[7] = (-a21 * a00 + a01 * a20) * det;
        out[8] = (a11 * a00 - a01 * a10) * det;
        return out;
    },
    adjoint: function (out) {
        var a00 = out[0], a01 = out[1], a02 = out[2];
        var a10 = out[3], a11 = out[4], a12 = out[5];
        var a20 = out[6], a21 = out[7], a22 = out[8];
        out[0] = a11 * a22 - a12 * a21;
        out[1] = a02 * a21 - a01 * a22;
        out[2] = a01 * a12 - a02 * a11;
        out[3] = a12 * a20 - a10 * a22;
        out[4] = a00 * a22 - a02 * a20;
        out[5] = a02 * a10 - a00 * a12;
        out[6] = a10 * a21 - a11 * a20;
        out[7] = a01 * a20 - a00 * a21;
        out[8] = a00 * a11 - a01 * a10;
        return out;
    },
    determinant: function (m) {
        var a10 = m[3], a11 = m[4], a12 = m[5];
        var a20 = m[6], a21 = m[7], a22 = m[8];
        return m[0] * (a22 * a11 - a12 * a21) + m[1] * (-a22 * a10 + a12 * a20) + m[2] * (a21 * a10 - a11 * a20);
    },
    multiply: function (out, m) {
        var a00 = out[0], a01 = out[1], a02 = out[2];
        var a10 = out[3], a11 = out[4], a12 = out[5];
        var a20 = out[6], a21 = out[7], a22 = out[8];
        var b0 = m[0], b1 = m[1], b2 = m[2];
        out[0] = b0 * a00 + b1 * a10 + b2 * a20;
        out[1] = b0 * a01 + b1 * a11 + b2 * a21;
        out[2] = b0 * a02 + b1 * a12 + b2 * a22;
        b0 = m[3], b1 = m[4], b1 = m[5];
        out[3] = b0 * a00 + b1 * a10 + b2 * a20;
        out[4] = b0 * a01 + b1 * a11 + b2 * a21;
        out[5] = b0 * a02 + b1 * a12 + b2 * a22;
        b0 = m[6], b1 = m[7], b2 = m[8];
        out[6] = b0 * a00 + b1 * a10 + b2 * a20;
        out[7] = b0 * a01 + b1 * a11 + b2 * a21;
        out[8] = b0 * a02 + b1 * a12 + b2 * a22;
        return out;
    },
    translate: function (out, v) {
        var a00 = out[0], a01 = out[1], a02 = out[2];
        var a10 = out[3], a11 = out[4], a12 = out[5];
        var x = v[0], y = v[1];
        out[0] = a00;
        out[1] = a01;
        out[2] = a02;
        out[3] = a10;
        out[4] = a11;
        out[5] = a12;
        out[6] = x * a00 + y * a10 + out[6];
        out[7] = x * a01 + y * a11 + out[7];
        out[8] = x * a02 + y * a12 + out[8];
        return out;
    },
    rotate: function (out, rad) {
        var a00 = out[0], a01 = out[1], a02 = out[2];
        var a10 = out[3], a11 = out[4], a12 = out[5];
        var s = Math.sin(rad), c = Math.cos(rad);
        out[0] = c * a00 + s * a10;
        out[1] = c * a01 + s * a11;
        out[2] = c * a02 + s * a12;
        out[3] = c * a10 - s * a00;
        out[4] = c * a11 - s * a01;
        out[5] = c * a12 - s * a02;
        return out;
    },
    scale: function (out, v) {
        var x = v[0], y = v[1];
        out[0] *= x;
        out[1] *= x;
        out[2] *= x;
        out[3] *= y;
        out[4] *= y;
        out[5] *= y;
        return out;
    },
    fromTranslation: function (v) {
        return [
            1, 0, 0,
            0, 1, 0,
            v[0], v[1], 1
        ];
    },
    fromRotation: function (rad) {
        var s = Math.sin(rad), c = Math.cos(rad);
        return [
            c, s, 0,
            -s, c, 0,
            0, 0, 1
        ];
    },
    fromScaling: function (v) {
        return [
            v[0], 0, 0,
            0, v[1], 0,
            0, 0, 1
        ];
    },
    normalFromMat4: function (m) {
        var a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
        var a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
        var a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
        var a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];
        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32;
        var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
            return null;
        }
        det = 1.0 / det;
        return [
            (a11 * b11 - a12 * b10 + a13 * b09) * det,
            (a12 * b08 - a10 * b11 - a13 * b07) * det,
            (a10 * b10 - a11 * b08 + a13 * b06) * det,
            (a02 * b10 - a01 * b11 - a03 * b09) * det,
            (a00 * b11 - a02 * b08 + a03 * b07) * det,
            (a01 * b08 - a00 * b10 - a03 * b06) * det,
            (a31 * b05 - a32 * b04 + a33 * b03) * det,
            (a32 * b02 - a30 * b05 - a33 * b01) * det,
            (a30 * b04 - a31 * b02 + a33 * b00) * det
        ];
    },
    projection: function (width, height) {
        return [
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1
        ];
    },
    equals: function (a, b) {
        for (var i = 0; i < 9; i++) {
            if (Math.abs(a[i] - b[i]) > epsilon) {
                return false;
            }
        }
        return true;
    },
};
exports.mat3 = mat3;
Object.freeze(mat3);
// =============================================================================
// Mat4
// =============================================================================
var mat4 = {
    identity: function () { return ([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]); },
    clone: function (m) { return ([
        m[0], m[1], m[2], m[3],
        m[4], m[5], m[6], m[7],
        m[8], m[9], m[10], m[11],
        m[12], m[13], m[14], m[15]
    ]); },
    copy: function (out, m) {
        for (var i = 0; i < 16; i++)
            out[i] = m[i];
        return out;
    },
    transpose: function (out) {
        var a01 = out[1], a02 = out[2], a03 = out[3];
        var a12 = out[6], a13 = out[7];
        var a23 = out[11];
        out[1] = out[4];
        out[2] = out[8];
        out[3] = out[12];
        out[4] = a01;
        out[6] = out[9];
        out[7] = out[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = out[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
        return out;
    },
    invert: function (out) {
        var a00 = out[0], a01 = out[1], a02 = out[2], a03 = out[3];
        var a10 = out[4], a11 = out[5], a12 = out[6], a13 = out[7];
        var a20 = out[8], a21 = out[9], a22 = out[10], a23 = out[11];
        var a30 = out[12], a31 = out[13], a32 = out[14], a33 = out[15];
        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32;
        var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
            return null;
        }
        det = 1 / det;
        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return out;
    },
    adjoint: function (out) {
        var a00 = out[0], a01 = out[1], a02 = out[2], a03 = out[3];
        var a10 = out[4], a11 = out[5], a12 = out[6], a13 = out[7];
        var a20 = out[8], a21 = out[9], a22 = out[10], a23 = out[11];
        var a30 = out[12], a31 = out[13], a32 = out[14], a33 = out[15];
        out[0] = +(a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
        out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
        out[2] = +(a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
        out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
        out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
        out[5] = +(a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
        out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
        out[7] = +(a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
        out[8] = +(a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
        out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
        out[10] = +(a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
        out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
        out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
        out[13] = +(a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
        out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
        out[15] = +(a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
        return out;
    },
    determinant: function (m) {
        var a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
        var a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
        var a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
        var a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];
        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32;
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    },
    multiply: function (out, m) {
        var a00 = out[0], a01 = out[1], a02 = out[2], a03 = out[3];
        var a10 = out[4], a11 = out[5], a12 = out[6], a13 = out[7];
        var a20 = out[8], a21 = out[9], a22 = out[10], a23 = out[11];
        var a30 = out[12], a31 = out[13], a32 = out[14], a33 = out[15];
        var b0 = m[0], b1 = m[1], b2 = m[2], b3 = m[3];
        out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = m[4], b1 = m[5], b2 = m[6], b3 = m[7];
        out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = m[8], b1 = m[9], b2 = m[10], b3 = m[11];
        out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = m[12], b1 = m[13], b2 = m[14], b3 = m[15];
        out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return out;
    },
    translate: function (out, v) {
        var x = v[0], y = v[1], z = v[2];
        out[12] = out[0] * x + out[4] * y + out[8] * z + out[12];
        out[13] = out[1] * x + out[5] * y + out[9] * z + out[13];
        out[14] = out[2] * x + out[6] * y + out[10] * z + out[14];
        out[15] = out[3] * x + out[7] * y + out[11] * z + out[15];
        return out;
    },
    rotate: function (out, rad, axis) {
        var x = axis[0], y = axis[1], z = axis[2];
        var len = Math.hypot(x, y, z);
        if (len < epsilon)
            return out;
        len = 1 / len;
        x *= len, y *= len, z *= len;
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var t = 1 - c;
        var b00 = x * x * t + c;
        var b01 = y * x * t + z * s;
        var b02 = z * x * t - y * s;
        var b10 = x * y * t - z * s;
        var b11 = y * y * t + c;
        var b12 = z * y * t + x * s;
        var b20 = x * z * t + y * s;
        var b21 = y * z * t - x * s;
        var b22 = z * z * t + c;
        var a00 = out[0], a01 = out[1], a02 = out[2], a03 = out[3];
        var a10 = out[4], a11 = out[5], a12 = out[6], a13 = out[7];
        var a20 = out[8], a21 = out[9], a22 = out[10], a23 = out[11];
        out[0] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;
        return out;
    },
    scale: function (out, v) {
        var x = v[0], y = v[1], z = v[2];
        out[0] *= x, out[1] *= x, out[2] *= x, out[3] *= x;
        out[4] *= y, out[5] *= y, out[6] *= y, out[7] *= y;
        out[8] *= z, out[9] *= z, out[10] *= z, out[11] *= z;
        return out;
    },
    fromTranslation: function (v) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            v[0], v[1], v[2], 1
        ];
    },
    fromRotation: function (rad, axis) {
        var x = axis[0], y = axis[1], z = axis[2];
        var len = Math.hypot(x, y, z);
        if (len < epsilon)
            return mat4.identity();
        len = 1 / len;
        x *= len, y *= len, z *= len;
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var t = 1 - c;
        return [
            x * x * t + c, y * x * t + z * s, z * x * t - y * s, 0,
            x * y * t - z * s, y * y * t + c, z * y * t + x * s, 0,
            x * z * t + y * s, y * z * t - x * s, z * z * t + c, 0,
            0, 0, 0, 1
        ];
    },
    fromScaling: function (v) {
        return [
            v[0], 0, 0, 0,
            0, v[1], 0, 0,
            0, 0, v[2], 0,
            0, 0, 0, 1
        ];
    },
    getTranslation: function (m) {
        return [m[12], m[13], m[14]];
    },
    getScaling: function (m) {
        return [
            Math.hypot(m[0], m[1], m[2]),
            Math.hypot(m[4], m[5], m[6]),
            Math.hypot(m[8], m[9], m[10])
        ];
    },
    frustrum: function (left, right, bottom, top, near, far) {
        var rl = 1 / (right - left);
        var tb = 1 / (top - bottom);
        var nf = 1 / (near - far);
        return [
            near * 2 * rl, 0, 0, 0,
            0, near * 2 * tb, 0, 0,
            (right + left) * rl, (top + bottom) * tb, (far + near) * nf, -1,
            0, 0, far * near * 2 * nf, 0
        ];
    },
    perspective: function (fov, aspect, near, far) {
        var f = 1 / Math.tan(fov / 2);
        var o33, o43;
        if (far !== null && far !== Infinity) {
            var nf = 1 / (near - far);
            o33 = (far + near) * nf;
            o43 = 2 * far * near * nf;
        }
        else {
            o33 = -1;
            o43 = -2 * near;
        }
        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, o33, -1,
            0, 0, o43, 0
        ];
    },
    ortho: function (left, right, bottom, top, near, far) {
        var lr = 1 / (left - right);
        var bt = 1 / (bottom - top);
        var nf = 1 / (near - far);
        return [
            -2 * lr, 0, 0, 0,
            0, -2 * bt, 0, 0,
            0, 0, 2 * nf, 0,
            (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1
        ];
    },
    lookAt: function (eye, center, up) {
        var eyex = eye[0], eyey = eye[1], eyez = eye[2];
        var centerx = center[0], centery = center[1], centerz = center[2];
        var z0 = eyex - centerx, z1 = eyey - centery, z2 = eyez - centerz;
        if (Math.abs(z0) < epsilon && Math.abs(z1) < epsilon && Math.abs(z2) < epsilon) {
            return mat4.identity();
        }
        var len = 1 / Math.hypot(z0, z1, z2);
        z0 *= len, z1 *= len, z2 *= len;
        var upx = up[0], upy = up[1], upz = up[2];
        var x0 = upy * z2 - upz * z1;
        var x1 = upz * z0 - upx * z2;
        var x2 = upx * z1 - upy * z0;
        len = Math.hypot(x0, x1, x2);
        if (!len) {
            x0 = 0, x1 = 0, x2 = 0;
        }
        else {
            len = 1 / len;
            x0 *= len, x1 *= len, x2 *= len;
        }
        var y0 = z1 * x2 - z2 * x1;
        var y1 = z2 * x0 - z0 * x2;
        var y2 = z0 * x1 - z1 * x0;
        len = Math.hypot(y0, y1, y2);
        if (!len) {
            y0 = 0, y1 = 0, y2 = 0;
        }
        else {
            len = 1 / len;
            y0 *= len, y1 *= len, y2 *= len;
        }
        return [
            x0, y0, z0, 0,
            x1, y1, z1, 0,
            x2, y2, z2, 0,
            -(x0 * eyex + x1 * eyey + x2 * eyez),
            -(y0 * eyex + y1 * eyey + y2 * eyez),
            -(z0 * eyex + z1 * eyey + z2 * eyez),
            1
        ];
    },
    equals: function (a, b) {
        for (var i = 0; i < 16; i++) {
            if (Math.abs(a[i] - b[i]) > epsilon) {
                return false;
            }
        }
        return true;
    }
};
exports.mat4 = mat4;
Object.freeze(mat4);
//# sourceMappingURL=math.js.map