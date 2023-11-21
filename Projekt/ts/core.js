"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performDrawCall = exports.getContext = exports.deleteShader = exports.defineTexture = exports.createVertexShader = exports.createVAO = exports.createTexture = exports.createShaderProgram = exports.createIndexBuffer = exports.createFragmentShader = exports.createDrawCall = exports.createAttributeBuffer = void 0;
var types_1 = require("./types");
var dev_1 = require("./dev");
var math_js_1 = require("./math.js");
// TODO: ensure that all exceptions leave the WebGL state unchanged (that includes the removal of created objects)
// TODO: make names optional?
// Context ================================================================== //
/**
 * Get the WebGL2 context from a canvas element in the DOM.
 * @param canvasId The id of the canvas element.
 * @param options The WebGL2 context options:
 *  - `antialias`: Whether to enable antialiasing. Defaults to `true`.
 *  - `alpha`: Whether to enable alpha. Defaults to `true`.
 *  - `depth`: Whether to enable depth. Defaults to `true`.
 *  - `stencil`: Whether to enable stencil. Defaults to `false`.
 *  - `premultipliedAlpha`: Whether to enable premultiplied alpha. Defaults to `false`.
 *  - `desynchronized`: Whether to enable desynchronized. Defaults to `true`.
 *  - `preserveDrawingBuffer`: Whether to preserve the drawing buffer. Defaults to `true`.
 * @return The WebGL2 context.
 * @throws If the canvas element could not be found or if WebGL2 is not supported.
 *
 * The defaults followed by this call do not match the defaults of the WebGL2 context.
 * Instead, they reflect the best practices for WebGL2:
 *  - antialias is false by default, because it is expensive
 *  - alpha is true by default, because it is expensive to disable (see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#avoid_alphafalse_which_can_be_expensive)
 *  - preserveDrawingBuffer is true by default, because it is useful for debugging and follows OpenGL's behavior
 */
function getContext(canvasId, options) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (options === void 0) { options = {}; }
    var canvasElement = document.querySelector("#".concat(canvasId));
    if (canvasElement == null) {
        (0, dev_1.throwError)(function () { return "Could not find canvas element with id \"".concat(canvasId, "\""); });
    }
    var gl = canvasElement.getContext('webgl2', {
        antialias: (_a = options.antialias) !== null && _a !== void 0 ? _a : true,
        alpha: (_b = options.alpha) !== null && _b !== void 0 ? _b : true,
        depth: (_c = options.depth) !== null && _c !== void 0 ? _c : true,
        stencil: (_d = options.stencil) !== null && _d !== void 0 ? _d : false,
        premultipliedAlpha: (_e = options.premultipliedAlpha) !== null && _e !== void 0 ? _e : false,
        desynchronized: (_f = options.desynchronized) !== null && _f !== void 0 ? _f : true,
        preserveDrawingBuffer: (_g = options.preserveDrawingBuffer) !== null && _g !== void 0 ? _g : true,
    });
    if (gl == null) {
        (0, dev_1.throwError)(function () { return "Could not acquire a WebGL2 context from canvas with id \"".concat(canvasId, "\""); });
    }
    return gl;
}
exports.getContext = getContext;
// Vertex Buffers =========================================================== //
function getAttributeDataSize(type) {
    switch (type) {
        case (types_1.AttributeDataType.BYTE):
        case (types_1.AttributeDataType.UNSIGNED_BYTE):
            return 1;
        case (types_1.AttributeDataType.SHORT):
        case (types_1.AttributeDataType.UNSIGNED_SHORT):
        case (types_1.AttributeDataType.HALF_FLOAT):
            return 2;
        case (types_1.AttributeDataType.INT):
        case (types_1.AttributeDataType.UNSIGNED_INT):
        case (types_1.AttributeDataType.FLOAT):
        case (types_1.AttributeDataType.INT_2_10_10_10_REV):
        case (types_1.AttributeDataType.UNSIGNED_INT_2_10_10_10_REV):
            return 4;
        default:
            (0, dev_1.throwError)(function () { return "Invalid attribute data type: ".concat(type, "."); });
    }
}
function calcStride(attributes) {
    var stride = 0;
    for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
        var attribute = attributes_1[_i];
        stride += attribute.size * getAttributeDataSize(attribute.type);
    }
    return stride;
}
function calcOffset(attribute) {
    var offset = 0;
    for (var _i = 0, _a = attribute.buffer.attributes; _i < _a.length; _i++) {
        var _b = _a[_i], name_1 = _b[0], description = _b[1];
        if (name_1 === attribute.name) {
            return offset;
        }
        offset += description.size * getAttributeDataSize(description.type);
    }
    return null;
}
/**
 * Create a new Attribute Buffer Object (ABO) from the given data.
 * @param gl The WebGL context.
 * @param name The name of the buffer.
 * @param attributes The Attributes to use.
 * @param data The data to store in the buffer.
 * @returns The buffer object.
 */
function createAttributeBuffer(gl, name, data, attributes, options) {
    var _a;
    if (options === void 0) { options = {}; }
    // Ensure that the buffer contents are plausible for the given attributes.
    (0, dev_1.assert)(function () { return [data.length > 0, "Data for Attribute Buffer \"".concat(name, "\" must not be empty.")]; });
    var attributeDescriptions = Object.values(attributes);
    (0, dev_1.assert)(function () { return [attributeDescriptions.length > 0, "Attribute Buffer \"".concat(name, "\" must have at least one attribute.")]; });
    var stride = calcStride(attributeDescriptions) / 4; // stride is in bytes, data is in floats
    (0, dev_1.assert)(function () { return [data.length % stride === 0, "Data length for Attribute Buffer \"".concat(name, "\" must be a multiple of the stride.")]; });
    // Create the VBO.
    var vbo = gl.createBuffer();
    if (vbo === null) {
        (0, dev_1.throwError)(function () { return "Failed to create a new WebGL buffer for attribute buffer \"".concat(name, "\"."); });
    }
    // Bind the VBO and store the data.
    var dataArray = new Float32Array(data);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, dataArray, (_a = options.usage) !== null && _a !== void 0 ? _a : gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // Crate the Attribute Buffer Object.
    return {
        name: name,
        glBuffer: vbo,
        size: data.length / stride,
        attributes: new Map(Object.entries(attributes)),
    };
}
exports.createAttributeBuffer = createAttributeBuffer;
/** Create an index buffer from the given data.
 * Simplified version of the `createAttributeBuffer` function above, used for indices.
 * @param gl The WebGL context.
 * @param indices A JavaScript array containing the indices.
 * @returns The buffer object.
 */
function createIndexBuffer(gl, indices, options) {
    var _a;
    if (options === void 0) { options = {}; }
    // Ensure that the indicies are valid.
    (0, dev_1.assert)(function () { return [indices.length > 0, "'indices' must not be empty."]; });
    (0, dev_1.assert)(function () { return [indices.length % 3 === 0, "The size of 'indices' must be a multiple of 3."]; });
    // Find the highest index.
    var highestIndex = 0;
    for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
        var index = indices_1[_i];
        highestIndex = Math.max(highestIndex, index);
    }
    // Determine the best data type for the index buffer.
    var type;
    if (options.type !== undefined) {
        type = options.type;
    }
    else if (highestIndex < 256) {
        type = gl.UNSIGNED_BYTE;
    }
    else if (highestIndex < 65536) {
        type = gl.UNSIGNED_SHORT;
    }
    else if (highestIndex < 4294967296) {
        type = gl.UNSIGNED_INT;
    }
    else {
        (0, dev_1.throwError)(function () { return "Index ".concat(highestIndex, " does not fit in a 32-bit unsigned integer."); });
    }
    // Create the data array.
    var data;
    switch (type) {
        case (gl.UNSIGNED_BYTE):
            data = new Uint8Array(indices);
            break;
        case (gl.UNSIGNED_SHORT):
            data = new Uint16Array(indices);
            break;
        case (gl.UNSIGNED_INT):
            data = new Uint32Array(indices);
            break;
        default:
            (0, dev_1.throwError)(function () { return "Invalid index data type: ".concat(type, "."); });
    }
    // Create the buffer and store the data.
    var glBuffer = gl.createBuffer();
    if (glBuffer === null) {
        (0, dev_1.throwError)(function () { return 'Failed to create a new WebGL index buffer.'; });
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, (_a = options.usage) !== null && _a !== void 0 ? _a : gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // Return the buffer information.
    return {
        glBuffer: glBuffer,
        type: type,
        size: indices.length,
    };
}
exports.createIndexBuffer = createIndexBuffer;
/**
 * Creates a new Vertex Array Object (VAO) from the given IBO and attributes.
 * @param gl The WebGL context.
 * @param name The name of the VAO.
 * @param ibo The Index Buffer Object (IBO) to use.
 * @param attributes The Attributes to use.
 * @returns The VAO object.
 */
function createVAO(gl, name, ibo, attributes) {
    var _a;
    // Create and bind the VAO.
    var vao = gl.createVertexArray();
    if (vao === null) {
        (0, dev_1.throwError)(function () { return "Failed to create a new VAO object for \"".concat(name, "\"."); });
    }
    gl.bindVertexArray(vao);
    // Bind the index buffer to the VAO.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo.glBuffer);
    var _loop_1 = function (location_1, attrRef) {
        var offset = calcOffset(attrRef);
        if (offset === null) {
            (0, dev_1.throwError)(function () { return "Could not find VAO attribute for location ".concat(location_1, " in Attribute Buffer \"").concat(attrRef.buffer.name, "\"."); });
        }
        var attributeName = attrRef.name;
        var attributebuffer = attrRef.buffer;
        var definition = attributebuffer.attributes.get(attributeName);
        if (definition === undefined) {
            (0, dev_1.throwError)(function () { return "Could not find VAO attribute for location ".concat(location_1, " in Attribute Buffer \"").concat(attributebuffer.name, "\"."); });
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, attributebuffer.glBuffer);
        gl.enableVertexAttribArray(location_1);
        gl.vertexAttribPointer(location_1, definition.size, definition.type, (_a = definition.normalized) !== null && _a !== void 0 ? _a : false, calcStride(attributebuffer.attributes.values()), offset);
        (0, dev_1.logInfo)(function () { return "Attribute \"".concat(attributeName, "\" of VAO \"").concat(name, "\" bound to location: ").concat(location_1); });
    };
    // Bind the attribute buffers to the VAO.
    for (var _i = 0, attributes_2 = attributes; _i < attributes_2.length; _i++) {
        var _b = attributes_2[_i], location_1 = _b[0], attrRef = _b[1];
        _loop_1(location_1, attrRef);
    }
    // Reset the WebGL state again.
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null); // unbind the VAO _before_ the IBO!
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // Return the VAO object.
    return {
        name: name,
        glVao: vao,
        ibo: ibo,
        attributes: attributes,
    };
}
exports.createVAO = createVAO;
function textureDataTargetToTarget(dataTarget) {
    switch (dataTarget) {
        case types_1.TextureDataTarget.TEXTURE_2D:
            return types_1.TextureTarget.TEXTURE_2D;
        case types_1.TextureDataTarget.TEXTURE_3D:
            return types_1.TextureTarget.TEXTURE_3D;
        case types_1.TextureDataTarget.TEXTURE_2D_ARRAY:
            return types_1.TextureTarget.TEXTURE_2D_ARRAY;
        case types_1.TextureDataTarget.TEXTURE_CUBE_MAP_POSITIVE_X:
        case types_1.TextureDataTarget.TEXTURE_CUBE_MAP_NEGATIVE_X:
        case types_1.TextureDataTarget.TEXTURE_CUBE_MAP_POSITIVE_Y:
        case types_1.TextureDataTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y:
        case types_1.TextureDataTarget.TEXTURE_CUBE_MAP_POSITIVE_Z:
        case types_1.TextureDataTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z:
            return types_1.TextureTarget.TEXTURE_CUBE_MAP;
        default:
            (0, dev_1.throwError)(function () { return "Invalid texture data target: ".concat(dataTarget, "."); });
    }
}
function defineTextureImpl(gl, glTexture, dataTarget, source, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (options === void 0) { options = {}; }
    // Get some information about the WebGL context.
    var textureUnitCount = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    var anisotropyExtension = gl.getExtension("EXT_texture_filter_anisotropic");
    var maxAnisotropy = anisotropyExtension ? gl.getParameter(anisotropyExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
    // Validate the arguments and apply default values.
    var width = Math.max(1, Math.ceil((_a = options.width) !== null && _a !== void 0 ? _a : 1));
    var height = Math.max(1, Math.ceil((_b = options.height) !== null && _b !== void 0 ? _b : 1));
    var depth = Math.max(1, Math.ceil((_c = options.depth) !== null && _c !== void 0 ? _c : 1));
    // TODO: check that width, height and depth make sense with the given source
    var level = Math.max(0, Math.ceil((_d = options.level) !== null && _d !== void 0 ? _d : 0));
    var internalFormat = (_e = options.internalFormat) !== null && _e !== void 0 ? _e : gl.RGB;
    var sourceFormat = (_f = options.sourceFormat) !== null && _f !== void 0 ? _f : gl.RGB;
    var dataType = (_g = options.dataType) !== null && _g !== void 0 ? _g : gl.UNSIGNED_BYTE;
    // TODO: validate formats and data types
    // TODO: There should be some sort of automatic decision tree that determines the correct
    // combination of internal format / format and type based on some human-understandable description.
    // Have a look at:
    // * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
    // * https://registry.khronos.org/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
    var wipTextureUnit = (_h = options.wipTextureUnit) !== null && _h !== void 0 ? _h : textureUnitCount - 1; // use the highest texture unit by default
    if (wipTextureUnit < 0 || wipTextureUnit >= textureUnitCount) {
        (0, dev_1.throwError)(function () { return "Invalid WIP texture unit: ".concat(options.wipTextureUnit, "."); });
    }
    var createMipMaps = (_j = options.createMipMaps) !== null && _j !== void 0 ? _j : true;
    var setAnisotropy = anisotropyExtension ? ((_k = options.setAnisotropy) !== null && _k !== void 0 ? _k : true) : false;
    // Use a default source of one black pixel if it is null
    var placeholder = new Uint8Array([0, 0, 0, 255]);
    if (source === null) {
        if (level !== 0) {
            (0, dev_1.throwError)(function () { return "Level must be zero for empty textures, not ".concat(level, "."); });
        }
        width = 1;
        height = 1;
        source = placeholder;
    }
    // Helper functions
    var defineTexture2D = function (dataTarget, data) {
        if (ArrayBuffer.isView(data)) {
            gl.texImage2D(dataTarget, level, internalFormat, width, height, 
            /*border=*/ 0, sourceFormat, dataType, data);
        }
        else {
            gl.texImage2D(dataTarget, level, internalFormat, sourceFormat, dataType, data);
        }
        // Define texture parameters for a 2D texture.
        if (dataTarget === types_1.TextureDataTarget.TEXTURE_2D) {
            // Set defaults fist
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            // Generate mipmaps if requested and possible.
            if (createMipMaps) {
                if ((0, math_js_1.isPowerOf2)(width) && (0, math_js_1.isPowerOf2)(height)) {
                    gl.generateMipmap(gl.TEXTURE_2D);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                }
                else {
                    (0, dev_1.logWarning)(function () { return 'Mipmaps are only supported for textures with power-of-two dimensions.'; });
                }
            }
            // Enable anisotropic filtering if supported and requested.
            if (setAnisotropy) {
                if (anisotropyExtension !== null) {
                    gl.texParameterf(gl.TEXTURE_2D, anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT, maxAnisotropy);
                }
                else {
                    (0, dev_1.logWarning)(function () { return 'Anisotropic filtering is not supported.'; });
                }
            }
            // TODO: customize filtering
            // TODO: customize wrapping
        }
        // Define texture parameteres for a cubemap face.
        else {
            if (createMipMaps) {
                (0, dev_1.logWarning)(function () { return 'Mipmaps are not supported for cube map textures.'; });
            }
            if (setAnisotropy) {
                (0, dev_1.logWarning)(function () { return 'Anisotropic filtering is not supported for cube map textures.'; });
            }
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        }
    };
    var defineTexture3D = function (dataTarget, data) {
        gl.texImage3D(dataTarget, level, internalFormat, width, height, depth, 
        /*border=*/ 0, sourceFormat, dataType, data);
        // TODO: 2D Array Textures?
    };
    // Define the texture
    gl.activeTexture(gl.TEXTURE0 + wipTextureUnit);
    var target = textureDataTargetToTarget(dataTarget);
    gl.bindTexture(target, glTexture);
    try {
        switch (target) {
            case types_1.TextureTarget.TEXTURE_2D:
            case types_1.TextureTarget.TEXTURE_CUBE_MAP:
                defineTexture2D(dataTarget, source);
                break;
            case types_1.TextureTarget.TEXTURE_3D:
            case types_1.TextureTarget.TEXTURE_2D_ARRAY:
                defineTexture3D(dataTarget, source);
                break;
        }
    }
    finally {
        gl.bindTexture(target, null);
    }
}
/**
 * (Re-)define an existing texture.
 * @param gl The WebGL context.
 * @param texture The texture object to define.
 * @param source The pixel or image data, defaults to one black pixel.
 * @param dataTarget The texture data target, required only for cube map faces.
 * @param options Additional options for the texture.
 */
function defineTexture(gl, texture, source, dataTarget, options) {
    if (source === void 0) { source = null; }
    if (dataTarget === void 0) { dataTarget = null; }
    if (options === void 0) { options = {}; }
    // When defining cubemap faces, the data target must be specified.
    dataTarget = dataTarget !== null && dataTarget !== void 0 ? dataTarget : texture.target;
    if (dataTarget === types_1.TextureTarget.TEXTURE_CUBE_MAP) {
        (0, dev_1.throwError)(function () { return "You need to specify the data target for cube map textures."; });
    }
    try {
        defineTextureImpl(gl, texture.glTexture, dataTarget, source, options);
        if (source === null) {
            (0, dev_1.logInfo)(function () { return "Defined empty texture \"".concat(texture.name, "\"."); });
        }
        else if (ArrayBuffer.isView(source)) {
            (0, dev_1.logInfo)(function () { return "Defined texture \"".concat(texture.name, "\" from a data view."); });
        }
        else {
            (0, dev_1.logInfo)(function () { return "Defined texture \"".concat(texture.name, "\" with image data."); });
        }
    }
    catch (error) {
        error.message = "Failed to define texture \"".concat(texture.name, "\": ").concat(error.message);
        throw error;
    }
}
exports.defineTexture = defineTexture;
/**
 * Create and define a new texture.
 * @param gl The WebGL context.
 * @param name The name of the texture.
 * @param target The texture target.
 * @param source The pixel or image data, defaults to one black pixel.
 * @param options Additional options for the texture.
 * @returns The texture object.
 */
function createTexture(gl, name, target, source, options) {
    if (target === void 0) { target = types_1.TextureTarget.TEXTURE_2D; }
    if (source === void 0) { source = null; }
    if (options === void 0) { options = {}; }
    // Create the new texture
    var glTexture = gl.createTexture();
    if (glTexture === null) {
        (0, dev_1.throwError)(function () { return "Failed to create WebGL texture for Texture \"".concat(name, "\""); });
    }
    // Define the texture
    try {
        var isCubemap_1 = target === types_1.TextureTarget.TEXTURE_CUBE_MAP;
        if (isCubemap_1) {
            for (var i = 0; i < 6; ++i) {
                defineTextureImpl(gl, glTexture, types_1.TextureDataTarget.TEXTURE_CUBE_MAP_POSITIVE_X + i, source, options);
            }
        }
        else {
            defineTextureImpl(gl, glTexture, target, source, options);
        }
        if (source === null) {
            (0, dev_1.logInfo)(function () { return "Created empty ".concat(isCubemap_1 ? 'cubemap' : 'texture', " \"").concat(name, "\"."); });
        }
        else if (ArrayBuffer.isView(source)) {
            (0, dev_1.logInfo)(function () { return "Created texture \"".concat(name, "\" from a data view."); });
        }
        else {
            (0, dev_1.logInfo)(function () { return "Created texture \"".concat(name, "\" with image data."); });
        }
    }
    catch (error) {
        gl.deleteTexture(glTexture);
        error.message = "Failed to create texture \"".concat(name, "\": ").concat(error.message);
        throw error;
    }
    // Return the texture.
    return {
        name: name,
        glTexture: glTexture,
        target: target,
    };
}
exports.createTexture = createTexture;
// Shader =================================================================== //
function compileWebGLShader(gl, source, stage) {
    var shader = gl.createShader(stage);
    if (shader === null) {
        (0, dev_1.throwError)(function () {
            var stageName = stage === types_1.ShaderStage.VERTEX ? "vertex" : "fragment";
            return "Failed to create a new ".concat(stageName, " shader.");
        });
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}
/**
 * Create a Vertex Shader program from the given source code.
 * @param gl The WebGL context.
 * @param source The source code of the vertex shader.
 * @returns The Vertex Shader object.
 */
function createVertexShader(gl, source) {
    return {
        glShader: compileWebGLShader(gl, source, gl.VERTEX_SHADER),
        stage: types_1.ShaderStage.VERTEX,
        source: source,
    };
}
exports.createVertexShader = createVertexShader;
/**
 * Create a Fragment Shader program from the given source code.
 * @param gl The WebGL context.
 * @param source The source code of the fragment shader.
 * @returns The Fragment Shader object.
 */
function createFragmentShader(gl, source) {
    return {
        glShader: compileWebGLShader(gl, source, gl.FRAGMENT_SHADER),
        stage: types_1.ShaderStage.FRAGMENT,
        source: source,
    };
}
exports.createFragmentShader = createFragmentShader;
/**
 * Deletes the given Shader.
 * Does nothing if the Shader has already been deleted.
 * @param gl The WebGL context.
 * @param shader The shader to delete.
 */
function deleteShader(gl, shader) {
    if (shader.glShader === null) {
        return;
    }
    gl.deleteShader(shader.glShader);
    shader.glShader = null;
}
exports.deleteShader = deleteShader;
function findAttributes(source) {
    var regex = /(?:layout\s*\(location\s*=\s*(?<loc>\d+)\)\s*)?in\s+(?:(?<prec>lowp|mediump|highp)\s+)?(?<type>\w+)\s+(?<name>\w+)\s*;/g;
    var attributes = {};
    var match;
    while ((match = regex.exec(source)) !== null) {
        var _a = match.groups, name_2 = _a.name, type = _a.type, loc = _a.loc, prec = _a.prec;
        // TODO: check that the type is valid
        attributes[name_2] = { type: type };
        if (loc) {
            attributes[name_2].location = parseInt(loc);
        }
        if (prec) {
            attributes[name_2].precision = prec;
        }
    }
    return attributes;
}
function findUniforms(vertexSource, fragmentSource) {
    // TODO: uniforms are still found even if they are commented out (attributes probably too)
    var regex = /uniform\s+(?<prec>lowp|mediump|highp)?\s*(?<type>\w+)\s+(?<name>\w+)(?:\s*\[\s*(?<size>\d+)\s*\])?;/g;
    var uniforms = {};
    var match;
    for (var _i = 0, _a = [vertexSource, fragmentSource]; _i < _a.length; _i++) {
        var source = _a[_i];
        while ((match = regex.exec(source)) !== null) {
            var _b = match.groups, name_3 = _b.name, type = _b.type, prec = _b.prec, size = _b.size;
            if (name_3 in uniforms) {
                continue; // Ignore known uniforms, their info won't change (or the shader won't compile).
            }
            uniforms[name_3] = { type: type };
            if (prec) {
                uniforms[name_3].precision = prec;
            }
            if (size) {
                uniforms[name_3].size = parseInt(size);
            }
        }
    }
    return uniforms;
}
/**
 * Helper function to call the corret gl.uniform* function based on the uniform type.
 * @param gl The WebGL context.
 * @param uniform The uniform info with the value to set.
 */
function setUniform(gl, uniform) {
    // Debug checks (are compiled out in release builds).
    var isNumber = function (val) { return typeof val === 'number'; };
    var isInt = function (val) { return Number.isSafeInteger(val); };
    var isUint = function (val) { return isInt(val) && val >= 0; };
    var isBool = function (val) { return typeof val === 'boolean' || (isInt(val) && (val === 0 || val === 1)); };
    var isArrayOfNumbers = function (size) {
        return Array.isArray(uniform.value) && uniform.value.length == size * uniform.size && uniform.value.every(function (val) { return isNumber(val); });
    };
    var isArrayOfBools = function (size) {
        return Array.isArray(uniform.value) && uniform.value.length == size * uniform.size && uniform.value.every(function (val) { return isBool(val); });
    };
    var isArrayOfInts = function (size) {
        return Array.isArray(uniform.value) && uniform.value.length == size * uniform.size && uniform.value.every(function (val) { return isInt(val); });
    };
    var isArrayOfUints = function (size) {
        return Array.isArray(uniform.value) && uniform.value.length == size * uniform.size && uniform.value.every(function (val) { return isUint(val); });
    };
    var errorMessage = function (size, type) { return "Value of uniform must be an array of ".concat(size * uniform.size, " ").concat(type, "s!"); };
    // Assign non-sampler uniforms.
    switch (uniform.type) {
        case 'float':
            (0, dev_1.assert)(function () { return [isNumber(uniform.value), "Value of uniform must be a number!"]; });
            return gl.uniform1f(uniform.location, uniform.value);
        case 'vec2':
            (0, dev_1.assert)(function () { return [isArrayOfNumbers(2), errorMessage(2, 'number')]; });
            return gl.uniform2fv(uniform.location, uniform.value);
        case 'vec3':
            (0, dev_1.assert)(function () { return [isArrayOfNumbers(3), errorMessage(3, 'number')]; });
            return gl.uniform3fv(uniform.location, uniform.value);
        case 'vec4':
            (0, dev_1.assert)(function () { return [isArrayOfNumbers(4), errorMessage(4, 'number')]; });
            return gl.uniform4fv(uniform.location, uniform.value);
        case 'mat2':
        case 'mat2x2':
            (0, dev_1.assert)(function () { return [isArrayOfNumbers(4), errorMessage(4, 'number')]; });
            return gl.uniformMatrix2fv(uniform.location, false, uniform.value);
        case 'mat3':
        case 'mat3x3':
            (0, dev_1.assert)(function () { return [isArrayOfNumbers(9), errorMessage(9, 'number')]; });
            return gl.uniformMatrix3fv(uniform.location, false, uniform.value);
        case 'mat4':
        case 'mat4x4':
            (0, dev_1.assert)(function () { return [isArrayOfNumbers(16), errorMessage(16, 'number')]; });
            return gl.uniformMatrix4fv(uniform.location, false, uniform.value);
        case 'int':
        case 'sampler2D':
        case 'sampler2DArray':
        case 'samplerCube':
        case 'sampler3D':
        case 'isampler2D':
        case 'isampler2DArray':
        case 'isamplerCube':
        case 'isampler3D':
        case 'usampler2D':
        case 'usampler2DArray':
        case 'usamplerCube':
        case 'usampler3D':
        case 'sampler2DShadow':
        case 'sampler2DArrayShadow':
        case 'samplerCubeShadow':
            (0, dev_1.assert)(function () { return [isInt(uniform.value), "Value of uniform must be an integer!"]; });
            return gl.uniform1i(uniform.location, uniform.value);
        case 'uint':
            (0, dev_1.assert)(function () { return [isUint(uniform.value), "Value of uniform must be a positive integer!"]; });
            return gl.uniform1ui(uniform.location, uniform.value);
        case 'bool':
            (0, dev_1.assert)(function () { return [isBool(uniform.value), "Value of uniform must be a boolean, zero or one!"]; });
            return gl.uniform1i(uniform.location, uniform.value ? 1 : 0);
        case 'mat2x3':
            (0, dev_1.assert)(function () { return [isArrayOfNumbers(6), errorMessage(6, 'number')]; });
            return gl.uniformMatrix2x3fv(uniform.location, false, uniform.value);
        case 'mat3x2':
            (0, dev_1.assert)(function () { return [isArrayOfNumbers(6), errorMessage(6, 'number')]; });
            return gl.uniformMatrix3x2fv(uniform.location, false, uniform.value);
        case 'mat2x4':
            (0, dev_1.assert)(function () { return [isArrayOfNumbers(8), errorMessage(8, 'number')]; });
            return gl.uniformMatrix2x4fv(uniform.location, false, uniform.value);
        case 'mat4x2':
            (0, dev_1.assert)(function () { return [isArrayOfNumbers(8), errorMessage(8, 'number')]; });
            return gl.uniformMatrix4x2fv(uniform.location, false, uniform.value);
        case 'mat3x4':
            (0, dev_1.assert)(function () { return [isArrayOfNumbers(12), errorMessage(12, 'number')]; });
            return gl.uniformMatrix3x4fv(uniform.location, false, uniform.value);
        case 'mat4x3':
            (0, dev_1.assert)(function () { return [isArrayOfNumbers(12), errorMessage(12, 'number')]; });
            return gl.uniformMatrix4x3fv(uniform.location, false, uniform.value);
        case 'ivec2':
            (0, dev_1.assert)(function () { return [isArrayOfInts(2), errorMessage(2, 'integer')]; });
            return gl.uniform2iv(uniform.location, uniform.value);
        case 'ivec3':
            (0, dev_1.assert)(function () { return [isArrayOfInts(3), errorMessage(3, 'integer')]; });
            return gl.uniform3iv(uniform.location, uniform.value);
        case 'ivec4':
            (0, dev_1.assert)(function () { return [isArrayOfInts(4), errorMessage(4, 'integer')]; });
            return gl.uniform4iv(uniform.location, uniform.value);
        case 'uvec2':
            (0, dev_1.assert)(function () { return [isArrayOfUints(2), errorMessage(2, 'positive integer')]; });
            return gl.uniform2uiv(uniform.location, uniform.value);
        case 'uvec3':
            (0, dev_1.assert)(function () { return [isArrayOfUints(3), errorMessage(3, 'positive integer')]; });
            return gl.uniform3uiv(uniform.location, uniform.value);
        case 'uvec4':
            (0, dev_1.assert)(function () { return [isArrayOfUints(4), errorMessage(4, 'positive integer')]; });
            return gl.uniform4uiv(uniform.location, uniform.value);
        case 'bvec2':
            (0, dev_1.assert)(function () { return [isArrayOfBools(2), errorMessage(2, 'boolean')]; });
            return gl.uniform2iv(uniform.location, uniform.value);
        case 'bvec3':
            (0, dev_1.assert)(function () { return [isArrayOfBools(3), errorMessage(3, 'boolean')]; });
            return gl.uniform3iv(uniform.location, uniform.value);
        case 'bvec4':
            (0, dev_1.assert)(function () { return [isArrayOfBools(4), errorMessage(4, 'boolean')]; });
            return gl.uniform4iv(uniform.location, uniform.value);
        default:
            (0, dev_1.throwError)(function () { return "Unsupported uniform type \"".concat(uniform.type, "\""); });
    }
}
/** Produce a default value for a uniform based on its type.
 * @param type GLSL type of the uniform.
 * @param size Size of the uniform (for arrays).
 * @returns A default value for the uniform or null if no default value is known.
 */
function getDefaultUniformValue(type, size) {
    (0, dev_1.assert)(function () { return [size >= 1, "Uniform size must be at least 1, not ".concat(size, ".")]; });
    var result;
    switch (type) {
        case 'float':
        case 'int':
        case 'uint':
        case 'bool':
            result = 0;
            break;
        case 'vec2':
        case 'ivec2':
        case 'uvec2':
        case 'bvec2':
            result = [0, 0];
            break;
        case 'vec3':
        case 'ivec3':
        case 'uvec3':
        case 'bvec3':
            result = [0, 0, 0];
            break;
        case 'vec4':
        case 'ivec4':
        case 'uvec4':
        case 'bvec4':
            result = [0, 0, 0, 0];
            break;
        case 'mat2':
        case 'mat2x2':
            result = [
                1, 0,
                0, 1
            ];
            break;
        case 'mat3':
        case 'mat3x3':
            result = [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            ];
            break;
        case 'mat4':
        case 'mat4x4':
            result = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
            break;
        case 'mat2x3':
            result = [
                1, 0,
                0, 1,
                0, 0
            ];
            break;
        case 'mat2x4':
            result = [
                1, 0,
                0, 1,
                0, 0,
                0, 0
            ];
            break;
        case 'mat3x2':
            result = [
                1, 0, 0,
                0, 1, 0
            ];
            break;
        case 'mat3x4':
            result = [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
                0, 0, 0
            ];
            break;
        case 'mat4x2':
            result = [
                1, 0, 0, 0,
                0, 1, 0, 0
            ];
            break;
        case 'mat4x3':
            result = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0
            ];
            break;
        default:
            // Samplers have no meaningful default value. Instead they default
            // to zero which is a valid texture unit but might not be what
            // the user wants.
            return null;
    }
    if (size === 1) {
        return result;
    }
    else {
        return Array(size).fill(result).flat();
    }
}
/**
 * By default, all Uniforms are initialized to zero, which is not always what
 * the user wants. This function returns true if the given uniform type requires
 * an explicit default value (even i)
 * @param type
 * @returns
 */
function uniformHasNonZeroDefault(type) {
    switch (type) {
        case 'float':
        case 'int':
        case 'uint':
        case 'bool':
        case 'vec2':
        case 'ivec2':
        case 'uvec2':
        case 'bvec2':
        case 'vec3':
        case 'ivec3':
        case 'uvec3':
        case 'bvec3':
        case 'vec4':
        case 'ivec4':
        case 'uvec4':
        case 'bvec4':
            return false;
        default:
            return true;
    }
}
function createShaderProgram(gl, name, vertexShader, fragmentShader, uniforms, attributes) {
    var _a;
    if (uniforms === void 0) { uniforms = {}; }
    if (attributes === void 0) { attributes = {}; }
    // Check that the shaders are valid.
    if (vertexShader.glShader === null) {
        (0, dev_1.throwError)(function () { return "Cannot create shader program \"".concat(name, "\" because the vertex shader has been deleted."); });
    }
    if (fragmentShader.glShader === null) {
        (0, dev_1.throwError)(function () { return "Cannot create shader program \"".concat(name, "\" because the fragment shader has been deleted."); });
    }
    // Create the shader program.
    var glProgram = gl.createProgram();
    if (glProgram === null) {
        (0, dev_1.throwError)(function () { return "Failed to create a new WebGL shader program for \"".concat(name, "\"."); });
    }
    gl.attachShader(glProgram, vertexShader.glShader);
    gl.attachShader(glProgram, fragmentShader.glShader);
    // Find all attributes in the vertex shader.
    // If the user specified locations for the attributes, bind them now.
    var foundAttributes = findAttributes(vertexShader.source);
    // TODO: warn about reserved attributes starting with "webgl_" or "_webgl_", see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindAttribLocation#name
    if (Object.keys(attributes).length > 0) {
        var _loop_2 = function (attributeName, attributeLocation) {
            var attributeInfo = foundAttributes[attributeName];
            if (attributeInfo === undefined) {
                (0, dev_1.logWarning)(function () { return "Attribute \"".concat(attributeName, "\" not found in vertex shader of shader program \"").concat(name, "\"."); });
                return "continue";
            }
            if (attributeInfo.location !== undefined && attributeInfo.location !== attributeLocation) {
                (0, dev_1.logWarning)(function () { return "Vertex shader of shader program \"".concat(name, "\" specifies the location of attribute \"").concat(attributeName, "\" to be ").concat(attributeInfo.location, ", not ").concat(attributeLocation, "."); });
                return "continue";
            }
            attributeInfo.location = attributeLocation; // update the info as well
            gl.bindAttribLocation(glProgram, attributeLocation, attributeName);
        };
        for (var _i = 0, _b = Object.entries(attributes); _i < _b.length; _i++) {
            var _c = _b[_i], attributeName = _c[0], attributeLocation = _c[1];
            _loop_2(attributeName, attributeLocation);
        }
    }
    // Link the program and check for errors
    gl.linkProgram(glProgram);
    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        (0, dev_1.throwError)(function () { return "Failed to link shader program \"".concat(name, "\": ").concat(gl.getProgramInfoLog(glProgram))
            + "\nVertex Shader log: ".concat(gl.getShaderInfoLog(vertexShader))
            + "\nFragent Shader log: ".concat(gl.getShaderInfoLog(fragmentShader)); });
    }
    // Store the actual location of all attributes.
    var shaderAttributes = new Map();
    var _loop_3 = function (attributeName, attributeInfo) {
        var location_2 = gl.getAttribLocation(glProgram, attributeName);
        if (location_2 === -1) {
            (0, dev_1.logWarning)(function () { return "Attribute \"".concat(attributeName, "\" not found in linked shader program \"").concat(name, "\"!"); });
            return "continue";
        }
        if (attributeInfo.location) {
            if (attributeInfo.location === location_2) {
                (0, dev_1.logInfo)(function () { return "Attribute \"".concat(attributeName, "\" of shader \"").concat(name, "\" found at expected location ").concat(location_2, "."); });
            }
            else {
                (0, dev_1.logWarning)(function () { return "Shader program \"".concat(name, "\" overrides the location of attribute \"").concat(attributeName, "\" to be ").concat(location_2, ", not ").concat(attributeInfo.location, "."); });
            }
        }
        else {
            (0, dev_1.logInfo)(function () { return "Attribute \"".concat(attributeName, "\" of shader \"").concat(name, "\" found at automatic location ").concat(location_2, "."); });
        }
        shaderAttributes.set(attributeName, { location: location_2, type: attributeInfo.type });
    };
    for (var _d = 0, _e = Object.entries(foundAttributes); _d < _e.length; _d++) {
        var _f = _e[_d], attributeName = _f[0], attributeInfo = _f[1];
        _loop_3(attributeName, attributeInfo);
    }
    // Detect missing uniforms
    var foundUniforms = findUniforms(vertexShader.source, fragmentShader.source);
    var _loop_4 = function (uniformName) {
        if (!(uniformName in foundUniforms)) {
            (0, dev_1.logWarning)(function () { return "Uniform \"".concat(uniformName, "\" not found in shader program '").concat(name, "'!"); });
        }
    };
    for (var _g = 0, _h = Object.keys(uniforms); _g < _h.length; _g++) {
        var uniformName = _h[_g];
        _loop_4(uniformName);
    }
    // Create uniform objects.
    var shaderUniforms = new Map();
    gl.useProgram(glProgram);
    var _loop_5 = function (uniformName, foundUniform) {
        // Find the uniform location.
        var location_3 = gl.getUniformLocation(glProgram, uniformName);
        if (location_3 === null) {
            (0, dev_1.logWarning)(function () { return "Unused Uniform \"".concat(uniformName, "\" was removed from shader program \"").concat(name, "\"!"); });
            return "continue";
        }
        // Determine the initial value of the uniform.
        var uniformSize = (_a = foundUniform.size) !== null && _a !== void 0 ? _a : 1;
        var manualInitialValue = uniforms[uniformName];
        var initialValue = void 0;
        if (manualInitialValue !== undefined) {
            initialValue = manualInitialValue;
        }
        else {
            var maybeInitialValue = getDefaultUniformValue(foundUniform.type, uniformSize);
            if (maybeInitialValue === null) {
                (0, dev_1.throwError)(function () { return "Uniform \"".concat(uniformName, "\" of type '").concat(foundUniform.type, "' requires an explicit default value in shader \"").concat(name, "\""); });
            }
            initialValue = maybeInitialValue;
        }
        // Create and store the uniform object.
        var shaderUniform = {
            type: foundUniform.type,
            location: location_3,
            size: uniformSize,
            value: initialValue,
        };
        shaderUniforms.set(uniformName, shaderUniform);
        // Upload the value.
        if (manualInitialValue !== undefined || uniformHasNonZeroDefault(foundUniform.type)) {
            try {
                setUniform(gl, shaderUniform);
            }
            catch (error) {
                (0, dev_1.throwError)(function () { return "Failed to set initial value of uniform \"".concat(uniformName, "\" of shader \"").concat(name, "\": ").concat(error); });
            }
            (0, dev_1.logInfo)(function () { return "Uniform \"".concat(uniformName, "\" of shader \"").concat(name, "\" initialized with: ").concat(shaderUniform.value, "."); });
        }
    };
    for (var _j = 0, _k = Object.entries(foundUniforms); _j < _k.length; _j++) {
        var _l = _k[_j], uniformName = _l[0], foundUniform = _l[1];
        _loop_5(uniformName, foundUniform);
    }
    gl.useProgram(null);
    // Return the shader program.
    return {
        name: name,
        glProgram: glProgram,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        attributes: shaderAttributes,
        uniforms: shaderUniforms,
    };
}
exports.createShaderProgram = createShaderProgram;
// TODO: Framebuffers (see glance-v1)
// Draw Call ================================================================ //
function createTextureUnit(texture) {
    switch (texture.target) {
        case types_1.TextureTarget.TEXTURE_2D:
            return { texture_2d: texture };
        case types_1.TextureTarget.TEXTURE_3D:
            return { texture_3d: texture };
        case types_1.TextureTarget.TEXTURE_CUBE_MAP:
            return { texture_cube: texture };
        case types_1.TextureTarget.TEXTURE_2D_ARRAY:
            return { texture_2d_array: texture };
        default:
            (0, dev_1.throwError)(function () { return "Unsupported texture target: ".concat(texture.target); });
    }
}
function insertIntoTextureUnit(textureUnit, texture) {
    switch (texture.target) {
        case types_1.TextureTarget.TEXTURE_2D:
            if (textureUnit.texture_2d !== undefined) {
                (0, dev_1.throwError)(function () { return "Texture unit already contains a 2D texture!"; });
            }
            textureUnit.texture_2d = texture;
            break;
        case types_1.TextureTarget.TEXTURE_3D:
            if (textureUnit.texture_3d !== undefined) {
                (0, dev_1.throwError)(function () { return "Texture unit already contains a 3D texture!"; });
            }
            textureUnit.texture_3d = texture;
            break;
        case types_1.TextureTarget.TEXTURE_CUBE_MAP:
            if (textureUnit.texture_cube !== undefined) {
                (0, dev_1.throwError)(function () { return "Texture unit already contains a cube map!"; });
            }
            textureUnit.texture_cube = texture;
            break;
        case types_1.TextureTarget.TEXTURE_2D_ARRAY:
            if (textureUnit.texture_2d_array !== undefined) {
                (0, dev_1.throwError)(function () { return "Texture unit already contains a 2D array texture!"; });
            }
            textureUnit.texture_2d_array = texture;
            break;
        default:
            (0, dev_1.throwError)(function () { return "Unsupported texture target: ".concat(texture.target); });
    }
}
function matchAttributeType(attr, glslType) {
    switch (attr.type) {
        case types_1.AttributeDataType.BYTE:
        case types_1.AttributeDataType.UNSIGNED_BYTE:
        case types_1.AttributeDataType.SHORT:
        case types_1.AttributeDataType.UNSIGNED_SHORT:
        case types_1.AttributeDataType.INT:
        case types_1.AttributeDataType.INT_2_10_10_10_REV:
        case types_1.AttributeDataType.UNSIGNED_INT:
        case types_1.AttributeDataType.UNSIGNED_INT_2_10_10_10_REV:
            switch (glslType) {
                case 'int':
                case 'uint':
                    return attr.size === 1;
                case 'ivec2':
                case 'uvec2':
                    return attr.size === 2;
                case 'ivec3':
                case 'uvec3':
                    return attr.size === 3;
                case 'ivec4':
                case 'uvec4':
                    return attr.size === 4;
                default:
                    return false;
            }
        case types_1.AttributeDataType.FLOAT:
        case types_1.AttributeDataType.HALF_FLOAT:
            switch (glslType) {
                case 'float':
                    return attr.size === 1;
                case 'vec2':
                    return attr.size === 2;
                case 'vec3':
                    return attr.size === 3;
                case 'vec4':
                    return attr.size === 4;
                // TODO: handle cases where the GLSL type is a matrix
                default:
                    return false;
            }
    }
}
/**
 * Creates a new Draw Call.
 * @param program
 * @param vao
 * @param uniforms Uniform update callbacks to update uniforms before drawing.
 */
function createDrawCall(gl, program, vao, uniforms, textures, enabled, indexCount, indexOffset) {
    // Validate the arguments.
    uniforms = uniforms !== null && uniforms !== void 0 ? uniforms : {};
    textures = textures !== null && textures !== void 0 ? textures : [];
    indexCount = indexCount !== null && indexCount !== void 0 ? indexCount : vao.ibo.size;
    indexOffset = indexOffset !== null && indexOffset !== void 0 ? indexOffset : 0;
    if (indexCount <= 0) {
        (0, dev_1.throwError)(function () { return "Invalid index count: ".concat(indexCount, "."); });
    }
    if (indexOffset < 0) {
        (0, dev_1.throwError)(function () { return "Invalid index offset: ".concat(indexOffset, "."); });
    }
    indexCount = Math.ceil(indexCount);
    indexOffset = Math.ceil(indexOffset);
    if (indexOffset + indexCount > vao.ibo.size) {
        (0, dev_1.throwError)(function () { return "Index offset ".concat(indexOffset, " and count ").concat(indexCount, " exceed the size of the index buffer (").concat(vao.ibo.size, ")."); });
    }
    var _loop_6 = function (shaderAttribute) {
        var vaoAttributeRef = vao.attributes.get(shaderAttribute.location);
        if (vaoAttributeRef === undefined) {
            (0, dev_1.throwError)(function () { return "VAO \"".concat(vao.name, "\" does not provide an attribute at location ").concat(shaderAttribute.location, " as expected for shader program \"").concat(program.name, "\"!"); });
        }
        var vaoAttribute = vaoAttributeRef.buffer.attributes.get(vaoAttributeRef.name);
        if (vaoAttribute === undefined) {
            (0, dev_1.throwError)(function () { return "Missing attribute \"".concat(vaoAttributeRef.name, "\" in VBO \"").concat(vaoAttributeRef.buffer.name, "\"!"); });
        }
        if (!matchAttributeType(vaoAttribute, shaderAttribute.type)) {
            (0, dev_1.throwError)(function () { return "Attribute \"".concat(vaoAttributeRef.name, "\" in VBO \"").concat(vaoAttributeRef.buffer.name, "\" has type ").concat(vaoAttribute.type, " but shader program \"").concat(program.name, "\" expects type ").concat(shaderAttribute.type, "!"); });
        }
    };
    // Ensure that the attribute locations of the VAO match the shader program.
    for (var _i = 0, _a = program.attributes.values(); _i < _a.length; _i++) {
        var shaderAttribute = _a[_i];
        _loop_6(shaderAttribute);
    }
    var _loop_7 = function (uniformName) {
        if (!program.uniforms.has(uniformName)) {
            (0, dev_1.throwError)(function () { return "Uniform \"".concat(uniformName, "\" not found in shader program \"").concat(program.name, "\"!"); });
        }
    };
    // Ensure that all uniforms actually exist in the shader program
    for (var _b = 0, _c = Object.keys(uniforms); _b < _c.length; _b++) {
        var uniformName = _c[_b];
        _loop_7(uniformName);
    }
    // Create the texture unit mapping.
    var maxTextureUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    var textureUnits = new Map();
    var _loop_8 = function (unitId, texture) {
        if (unitId < 0 || unitId >= maxTextureUnits) {
            (0, dev_1.throwError)(function () { return "Invalid texture unit id: ".concat(unitId, ". Valid range is [0, ").concat(maxTextureUnits, ")."); });
        }
        var usedUnit = textureUnits.get(unitId);
        if (usedUnit === undefined) {
            textureUnits.set(unitId, createTextureUnit(texture));
        }
        else {
            insertIntoTextureUnit(usedUnit, texture);
        }
    };
    for (var _d = 0, textures_1 = textures; _d < textures_1.length; _d++) {
        var _e = textures_1[_d], unitId = _e[0], texture = _e[1];
        _loop_8(unitId, texture);
    }
    // Create the draw call.
    return {
        program: program,
        vao: vao,
        count: indexCount,
        offset: indexOffset,
        uniforms: new Map(Object.entries(uniforms)),
        textures: textureUnits,
        enabled: enabled,
    };
}
exports.createDrawCall = createDrawCall;
function performDrawCall(gl, drawCall, time) {
    // Return early if the draw call is disabled.
    if (drawCall.enabled !== undefined && !drawCall.enabled(time)) {
        return;
    }
    gl.bindVertexArray(drawCall.vao.glVao);
    gl.useProgram(drawCall.program.glProgram);
    try {
        var _loop_9 = function (uniformName, updateCallback) {
            var uniform = drawCall.program.uniforms.get(uniformName);
            if (uniform === undefined) {
                (0, dev_1.throwError)(function () { return "Uniform \"".concat(uniformName, "\" from update callback not found in shader program \"").concat(drawCall.program.name, "\"!"); });
            }
            var newValue = updateCallback(time);
            if (newValue === undefined) {
                (0, dev_1.throwError)(function () { return "Uniform update callback for \"".concat(uniformName, "\" returned undefined!"); });
            }
            if (newValue === uniform.value) {
                return "continue";
            }
            uniform.value = newValue;
            try {
                setUniform(gl, uniform);
            }
            catch (error) {
                (0, dev_1.throwError)(function () { return "Failed to update uniform \"".concat(uniformName, "\" of shader \"").concat(drawCall.program.name, "\": ").concat(error); });
            }
        };
        // Update the uniforms.
        for (var _i = 0, _a = drawCall.uniforms; _i < _a.length; _i++) {
            var _b = _a[_i], uniformName = _b[0], updateCallback = _b[1];
            _loop_9(uniformName, updateCallback);
        }
        // Bind the textures
        for (var _c = 0, _d = drawCall.textures; _c < _d.length; _c++) {
            var _e = _d[_c], id = _e[0], unit = _e[1];
            gl.activeTexture(gl.TEXTURE0 + id);
            if (unit.texture_2d !== undefined) {
                gl.bindTexture(gl.TEXTURE_2D, unit.texture_2d.glTexture);
            }
            if (unit.texture_3d !== undefined) {
                gl.bindTexture(gl.TEXTURE_3D, unit.texture_3d.glTexture);
            }
            if (unit.texture_cube !== undefined) {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, unit.texture_cube.glTexture);
            }
            if (unit.texture_2d_array !== undefined) {
                gl.bindTexture(gl.TEXTURE_2D_ARRAY, unit.texture_2d_array.glTexture);
            }
        }
        // Perform the draw call.
        gl.drawElements(gl.TRIANGLES, drawCall.count, drawCall.vao.ibo.type, drawCall.offset);
    }
    finally {
        gl.useProgram(null);
        gl.bindVertexArray(null);
    }
}
exports.performDrawCall = performDrawCall;
// TODO: function to perform a sequence of draw calls, which can be optimized with fewer state changes
//# sourceMappingURL=core.js.map