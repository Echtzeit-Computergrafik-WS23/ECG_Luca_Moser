"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSensitive = exports.Cached = exports.loadCubemap = exports.loadTexture = exports.buildAttributeMap = exports.buildShaderProgram = void 0;
var types_1 = require("./types");
var dev_1 = require("./dev");
var core_1 = require("./core");
function buildShaderProgram(gl, name, vertexSource, fragmentSource, uniforms, attributes) {
    if (uniforms === void 0) { uniforms = {}; }
    if (attributes === void 0) { attributes = {}; }
    var vertexShader = null;
    var fragmentShader = null;
    try {
        vertexShader = (0, core_1.createVertexShader)(gl, vertexSource);
        fragmentShader = (0, core_1.createFragmentShader)(gl, fragmentSource);
        return (0, core_1.createShaderProgram)(gl, name, vertexShader, fragmentShader, uniforms, attributes);
    }
    finally {
        if (vertexShader !== null) {
            (0, core_1.deleteShader)(gl, vertexShader);
        }
        if (fragmentShader !== null) {
            (0, core_1.deleteShader)(gl, fragmentShader);
        }
    }
}
exports.buildShaderProgram = buildShaderProgram;
function buildAttributeMap(shader, abo, mapping) {
    var _a;
    // If the given mapping is just a list of attribute names, we assume
    // that the attribute names in the shader and the buffer are the same.
    if (Array.isArray(mapping)) {
        mapping = mapping.reduce(function (acc, cur) {
            acc[cur] = cur;
            return acc;
        }, {});
    }
    // TODO: if mapping is null, inspect the shader and buffer to find
    //       matching attributes automatically.
    // Build the mapping
    var result = new Map();
    for (var _i = 0, _b = Object.entries(mapping); _i < _b.length; _i++) {
        var _c = _b[_i], shaderAttribute = _c[0], bufferAttribute = _c[1];
        var location_1 = (_a = shader.attributes.get(shaderAttribute)) === null || _a === void 0 ? void 0 : _a.location;
        if (location_1 === undefined) {
            throw new Error("Attribute ".concat(shaderAttribute, " not found in shader ").concat(shader.name));
        }
        var description = abo.attributes.get(bufferAttribute);
        if (description === undefined) {
            throw new Error("Attribute ".concat(bufferAttribute, " not found in buffer ").concat(abo.name));
        }
        result.set(location_1, { buffer: abo, name: bufferAttribute });
    }
    return result;
}
exports.buildAttributeMap = buildAttributeMap;
function getNameFromURL(url) {
    var segments = url.split("/");
    var filename = segments[segments.length - 1];
    return filename.split(".")[0];
}
function loadTexture(gl, url, target, name) {
    if (target === void 0) { target = types_1.TextureTarget.TEXTURE_2D; }
    var texture = (0, core_1.createTexture)(gl, name !== null && name !== void 0 ? name : getNameFromURL(url), target);
    var image = new Image();
    if (image === null) {
        throw new Error("Failed to create empty Image");
    }
    image.onload = function () {
        (0, core_1.defineTexture)(gl, texture, image);
        image = null;
    };
    image.src = url;
    return texture;
}
exports.loadTexture = loadTexture;
var CubeMapStatus = /** @class */ (function () {
    function CubeMapStatus() {
        this._counter = 0;
    }
    CubeMapStatus.prototype.increment = function () {
        this._counter++;
    };
    CubeMapStatus.prototype.isComplete = function () {
        return this._counter >= 6;
    };
    return CubeMapStatus;
}());
function loadCubemap(gl, name, urls) {
    var cubeMapOptions = {
        createMipMaps: false,
        setAnisotropy: false,
    };
    var texture = (0, core_1.createTexture)(gl, name, types_1.TextureTarget.TEXTURE_CUBE_MAP, null, cubeMapOptions);
    var completion = new CubeMapStatus();
    urls.forEach(function (url, index) {
        var image = new Image();
        if (image === null) {
            throw new Error("Failed to create empty Image");
        }
        image.onload = function () {
            (0, core_1.defineTexture)(gl, texture, image, types_1.TextureDataTarget.TEXTURE_CUBE_MAP_POSITIVE_X + index, cubeMapOptions);
            completion.increment();
            image = null;
        };
        image.src = url;
    });
    return [texture, completion];
}
exports.loadCubemap = loadCubemap;
/**
 * A cached value, useful in render loops where the same value is needed
 * multiple times per frame.
 */
var Cached = /** @class */ (function () {
    function Cached(_getter, dependencies) {
        if (dependencies === void 0) { dependencies = []; }
        this._getter = _getter;
        this._value = null;
        this._isDirty = true;
        this._dependents = new Set();
        for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
            var dependency = dependencies_1[_i];
            dependency._dependents.add(this);
        }
    }
    Cached.prototype.get = function () {
        if (this._isDirty) {
            this._value = this._getter();
            this._isDirty = false;
        }
        return (0, dev_1.shallowCopy)(this._value);
    };
    Cached.prototype.setDirty = function () {
        this._isDirty = true;
        for (var _i = 0, _a = this._dependents; _i < _a.length; _i++) {
            var dependent = _a[_i];
            dependent.setDirty();
        }
    };
    return Cached;
}());
exports.Cached = Cached;
var TimeSensitive = /** @class */ (function () {
    function TimeSensitive(_getter) {
        this._getter = _getter;
        this._value = null;
        this._timestamp = -1;
    }
    TimeSensitive.prototype.getAt = function (time) {
        if (this._timestamp < time) {
            this._value = this._getter(time);
            this._timestamp = time;
        }
        return (0, dev_1.shallowCopy)(this._value);
    };
    return TimeSensitive;
}());
exports.TimeSensitive = TimeSensitive;
//# sourceMappingURL=core_patterns.js.map