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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performDrawCall = exports.getContext = exports.createVAO = exports.createIndexBuffer = exports.createDrawCall = exports.createAttributeBuffer = void 0;
/**
 * @module glance/index
 * @desc The main module of the Glance library.
 * @license MIT
 * @version 0.2
 *
 * This module defines the public API of the Glance library.
 */
var core = require("./core");
var core_patterns = require("./core_patterns");
// import * as dev from "./dev"
var geo = require("./geo");
var math = require("./math");
// import * as types from "./types"
// TODO: this is a weird way to define the public API, is it?
exports.createAttributeBuffer = core.createAttributeBuffer;
exports.createDrawCall = core.createDrawCall;
exports.createIndexBuffer = core.createIndexBuffer;
exports.createVAO = core.createVAO;
exports.getContext = core.getContext;
exports.performDrawCall = core.performDrawCall;
__exportStar(require("./core_patterns"), exports);
__exportStar(require("./geo"), exports);
__exportStar(require("./math"), exports);
__exportStar(require("./types"), exports);
var glance = Object.freeze(__assign(__assign(__assign({ createAttributeBuffer: core.createAttributeBuffer, createDrawCall: core.createDrawCall, createIndexBuffer: core.createIndexBuffer, createVAO: core.createVAO, getContext: core.getContext, performDrawCall: core.performDrawCall }, core_patterns), geo), math));
exports.default = glance;
//# sourceMappingURL=index.js.map