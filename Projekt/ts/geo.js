"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTorusKnotIndices = exports.createTorusKnotAttributes = exports.createSphereIndices = exports.createSphereAttributes = exports.createSkyBoxIndices = exports.createSkyBoxAttributes = void 0;
var dev_1 = require("./dev");
var math_1 = require("./math");
// =============================================================================
// Module functions
// =============================================================================
// /** Creates a Box around the origin with the given options.
//  * @param gl The WebGL context.
//  * @param name The name of the box entity.
//  * @param shader The shader program to use for rendering the box.
//  * @param uniforms Uniform values of this entity to override the shader's defaults. Default: empty.
//  * @param size The size of the box, either as a single number or an array of three. Default: 1.0.
//  * @param uvScale The scale of the UV texture coordinates, either as a single number or an array of two. Default: 1.0.
//  * @param positionAttribute The name of the position attribute. Default: "aPosition".
//  * @param normalAttribute The name of the normal attribute. Default: undefined => no normals.
//  * @param texCoordAttribute The name of the texture coordinate attribute. Default: undefined => no uvs.
//  * @returns The box entity.
//  */
// function createBox(
//     { gl, name, shaders,
//         uniforms = {},
//         size = 1.0,
//         uvScale = 1.0,
//         positionAttribute = "aPosition",
//         normalAttribute = undefined,
//         texCoordAttribute = undefined,
//     }: {
//         gl: WebGL2,
//         name: string,
//         shaders: Shader | Shader[],
//         uniforms?: {
//             [name: string]: UniformValue,
//         },
//         size?: number | [number, number, number],
//         uvScale?: number | [number, number],
//         positionAttribute?: string,
//         normalAttribute?: string,
//         texCoordAttribute?: string,
//     }
// ): Entity
// {
//     if (typeof uvScale === "number") {
//         uvScale = [uvScale, uvScale]
//     }
//     if (typeof size === "number") {
//         size = [size, size, size]
//     }
//     const halfWidth = size[0] / 2.
//     const halfHeight = size[1] / 2.
//     const halfDepth = size[2] / 2.
//     // Create an array of positions for the cube.
//     const positions = [
//         // Front face
//         -halfWidth, -halfHeight, halfDepth,
//         halfWidth, -halfHeight, halfDepth,
//         halfWidth, halfHeight, halfDepth,
//         -halfWidth, halfHeight, halfDepth,
//         // Back face
//         halfWidth, -halfHeight, -halfDepth,
//         -halfWidth, -halfHeight, -halfDepth,
//         -halfWidth, halfHeight, -halfDepth,
//         halfWidth, halfHeight, -halfDepth,
//         // Top face
//         -halfWidth, halfHeight, halfDepth,
//         halfWidth, halfHeight, halfDepth,
//         halfWidth, halfHeight, -halfDepth,
//         -halfWidth, halfHeight, -halfDepth,
//         // Bottom face
//         -halfWidth, -halfHeight, -halfDepth,
//         halfWidth, -halfHeight, -halfDepth,
//         halfWidth, -halfHeight, halfDepth,
//         -halfWidth, -halfHeight, halfDepth,
//         // Right face
//         halfWidth, -halfHeight, halfDepth,
//         halfWidth, -halfHeight, -halfDepth,
//         halfWidth, halfHeight, -halfDepth,
//         halfWidth, halfHeight, halfDepth,
//         // Left face
//         -halfWidth, -halfHeight, -halfDepth,
//         -halfWidth, -halfHeight, halfDepth,
//         -halfWidth, halfHeight, halfDepth,
//         -halfWidth, halfHeight, -halfDepth,
//     ]
//     // The normals never change.
//     const normals = [
//         repeat([0, 0, 1], 4),   // front
//         repeat([0, 0, -1], 4),  // back
//         repeat([0, 1, 0], 4),   // top
//         repeat([0, -1, 0], 4),  // bottom
//         repeat([1, 0, 0], 4),   // right
//         repeat([-1, 0, 0], 4),  // left
//     ].flat()
//     // .. neither do the UVs.
//     const texCoords = repeat([
//         0, uvScale[1],          // top left
//         uvScale[0], uvScale[1], // top right
//         uvScale[0], 0,          // bottom right
//         0, 0,                   // bottom left
//     ], 6)
//     // Create the interleaved vertex array.
//     const interleaved = [positions]
//     const quantities = [3]
//     let stride = 3
//     let normalOffset = 3
//     let texCoordOffset = 3
//     if (normalAttribute) {
//         interleaved.push(normals)
//         quantities.push(3)
//         stride += 3
//         texCoordOffset += 3
//     }
//     if (texCoordAttribute) {
//         interleaved.push(texCoords)
//         quantities.push(2)
//         stride += 2
//     }
//     stride *= Float32Array.BYTES_PER_ELEMENT
//     normalOffset *= Float32Array.BYTES_PER_ELEMENT
//     texCoordOffset *= Float32Array.BYTES_PER_ELEMENT
//     const vertexArray = interleaveArrays(interleaved, quantities)
//     const data = new Float32Array(vertexArray)
//     // We know that the box requires vertex positions, so we always create a
//     // buffer for them.
//     const vertexBuffers: { [name: string]: AttributeBuffer } = {}
//     vertexBuffers[positionAttribute] = createAttributeBuffer({
//         gl, data,
//         numComponents: 3,
//         stride,
//         offset: 0,
//     })
//     if (normalAttribute) {
//         vertexBuffers[normalAttribute] = createAttributeBuffer({
//             gl, data,
//             numComponents: 3,
//             stride,
//             offset: normalOffset,
//             glBuffer: vertexBuffers[positionAttribute].glBuffer,
//         })
//     }
//     if (texCoordAttribute) {
//         vertexBuffers[texCoordAttribute] = createAttributeBuffer({
//             gl, data,
//             numComponents: 2,
//             stride,
//             offset: texCoordOffset,
//             glBuffer: vertexBuffers[positionAttribute].glBuffer,
//         })
//     }
//     // This array defines each face as two triangles, using the
//     // indices into the vertex array to specify each triangle's
//     // position.
//     const indices = [
//         0, 1, 2, 0, 2, 3,       // front
//         4, 5, 6, 4, 6, 7,       // back
//         8, 9, 10, 8, 10, 11,    // top
//         12, 13, 14, 12, 14, 15, // bottom
//         16, 17, 18, 16, 18, 19, // right
//         20, 21, 22, 20, 22, 23, // left
//     ]
//     const indexBuffer = createIndexBuffer({ gl, indices })
//     // Create the box entity.
//     return createEntity({ gl, name, vertexBuffers, indexBuffer, shaders, uniforms })
// }
/**
 * Creates a skybox of unit size around the origin with shared vertices.
 */
function createSkyBoxAttributes() {
    return [
        -1, -1, -1,
        +1, -1, -1,
        +1, +1, -1,
        -1, +1, -1,
        -1, -1, +1,
        +1, -1, +1,
        +1, +1, +1,
        -1, +1, +1, // 7
    ];
}
exports.createSkyBoxAttributes = createSkyBoxAttributes;
/**
 * Creates indices for a skybox.
 */
function createSkyBoxIndices() {
    return [
        4, 5, 6, 4, 6, 7,
        1, 0, 3, 1, 3, 2,
        7, 6, 2, 7, 2, 3,
        0, 1, 5, 0, 5, 4,
        5, 1, 2, 5, 2, 6,
        0, 4, 7, 0, 7, 3, // left
    ];
}
exports.createSkyBoxIndices = createSkyBoxIndices;
/** Creates a sphere around the origin with the given options.
 * @param radius The radius of the sphere.
 * @param latitudeBands The number of bands around the sphere from top to bottom.
 * @param longitudeBands The number of bands around the sphere from left to right.
 * @param options Options to control which vertex attributes to create.
 * @returns An array of interleaved vertex data.
 */
function createSphereAttributes(radius, latitudeBands, longitudeBands, options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    // Create values for all arrays of the sphere.
    // They are easier to create and then discard if unused.
    var positions = [];
    var normals = [];
    var texCoords = [];
    for (var lat = 0; lat <= latitudeBands; lat++) {
        var theta = lat * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        for (var lon = 0; lon <= longitudeBands; lon++) {
            var phi = lon * 2 * Math.PI / longitudeBands;
            var x = Math.cos(phi) * sinTheta;
            var y = cosTheta;
            var z = Math.sin(phi) * sinTheta;
            var u = 1. - (lon / longitudeBands);
            var v = lat / latitudeBands;
            positions.push(radius * x, radius * y, radius * z);
            normals.push(x, y, z);
            texCoords.push(u, v);
        }
    }
    // Create the interleaved vertex array.
    var interleaved = [positions];
    var quantities = [3];
    if ((_a = options.normals) !== null && _a !== void 0 ? _a : true) {
        interleaved.push(normals);
        quantities.push(3);
    }
    if ((_b = options.uvs) !== null && _b !== void 0 ? _b : true) {
        interleaved.push(texCoords);
        quantities.push(2);
    }
    return interleaveArrays(interleaved, quantities);
}
exports.createSphereAttributes = createSphereAttributes;
/**
 * Create indices for a sphere with the given options.
 * @param latitudeBands The number of bands around the sphere from top to bottom.
 * @param longitudeBands The number of bands around the sphere from left to right.
 * @returns The indices of the sphere.
 */
function createSphereIndices(latitudeBands, longitudeBands) {
    var buffer = [];
    for (var lat = 0; lat < latitudeBands; lat++) {
        for (var lon = 0; lon < longitudeBands; lon++) {
            var first = lat * (longitudeBands + 1) + lon;
            var second = first + longitudeBands + 1;
            buffer.push(first, first + 1, second);
            buffer.push(second, first + 1, second + 1);
        }
    }
    return buffer;
}
exports.createSphereIndices = createSphereIndices;
// TODO: enable/disable attributes for torus knot
function createTorusKnotAttributes(radius, tube, tubularSegments, radialSegments, p, q) {
    if (radius === void 0) { radius = 1; }
    if (tube === void 0) { tube = 0.4; }
    if (tubularSegments === void 0) { tubularSegments = 64; }
    if (radialSegments === void 0) { radialSegments = 8; }
    if (p === void 0) { p = 2; }
    if (q === void 0) { q = 3; }
    // Ensure segments are integers.
    tubularSegments = Math.floor(tubularSegments);
    radialSegments = Math.floor(radialSegments);
    // buffers
    var buffer = [];
    // This function calculates the current position on the torus curve.
    var calculatePositionOnCurve = function (u, p, q, radius, position) {
        var cu = Math.cos(u);
        var su = Math.sin(u);
        var quOverP = q / p * u;
        var cs = Math.cos(quOverP);
        position[0] = radius * (2 + cs) * 0.5 * cu;
        position[1] = radius * (2 + cs) * su * 0.5;
        position[2] = radius * Math.sin(quOverP) * 0.5;
    };
    // helper variables
    var vertex = math_1.vec3.zero();
    var P1 = math_1.vec3.zero();
    var B = math_1.vec3.zero();
    var T = math_1.vec3.zero();
    var N = math_1.vec3.zero();
    // generate vertices, normals and uvs
    for (var i = 0; i <= tubularSegments; ++i) {
        // the radian "u" is used to calculate the position on the torus curve of the current tubular segment
        var u = i / tubularSegments * p * Math.PI * 2;
        // now we calculate two points. P1 is our current position on the curve, P2 is a little farther ahead.
        // these points are used to create a special "coordinate space", which is necessary to calculate the correct vertex positions
        calculatePositionOnCurve(u, p, q, radius, P1);
        calculatePositionOnCurve(u + 0.01, p, q, radius, N);
        // calculate orthonormal basis
        math_1.vec3.subtract(math_1.vec3.copy(T, N), P1);
        math_1.vec3.cross(math_1.vec3.copy(B, T), N);
        math_1.vec3.cross(math_1.vec3.copy(N, B), T);
        // normalize B and N. T can be ignored, we don't use it
        math_1.vec3.normalize(B);
        math_1.vec3.normalize(N);
        for (var j = 0; j <= radialSegments; ++j) {
            // now calculate the vertices. they are nothing more than an extrusion of the torus curve.
            // because we extrude a shape in the xy-plane, there is no need to calculate a z-value.
            var v = j / radialSegments * Math.PI * 2;
            var cx = -tube * Math.cos(v);
            var cy = tube * Math.sin(v);
            // now calculate the final vertex position.
            // first we orient the extrusion with our basis vectors, then we add it to the current position on the curve
            vertex[0] = P1[0] + (cx * N[0] + cy * B[0]);
            vertex[1] = P1[1] + (cx * N[1] + cy * B[1]);
            vertex[2] = P1[2] + (cx * N[2] + cy * B[2]);
            buffer.push(vertex[0], vertex[1], vertex[2]);
            // normal (P1 is always the center/origin of the extrusion, thus we can use it to calculate the normal)
            math_1.vec3.subtract(vertex, P1);
            math_1.vec3.normalize(vertex);
            buffer.push(vertex[0], vertex[1], vertex[2]);
            // uv
            buffer.push(i / tubularSegments);
            buffer.push(j / radialSegments);
        }
    }
    return buffer;
}
exports.createTorusKnotAttributes = createTorusKnotAttributes;
function createTorusKnotIndices(tubularSegments, radialSegments) {
    if (tubularSegments === void 0) { tubularSegments = 64; }
    if (radialSegments === void 0) { radialSegments = 8; }
    var indices = [];
    for (var tubeIdx = 1; tubeIdx <= tubularSegments; tubeIdx++) {
        for (var radIdx = 1; radIdx <= radialSegments; radIdx++) {
            var a = (radialSegments + 1) * (tubeIdx - 1) + (radIdx - 1);
            var b = (radialSegments + 1) * tubeIdx + (radIdx - 1);
            var c = (radialSegments + 1) * tubeIdx + radIdx;
            var d = (radialSegments + 1) * (tubeIdx - 1) + radIdx;
            indices.push(a, b, d, b, c, d);
        }
    }
    return indices;
}
exports.createTorusKnotIndices = createTorusKnotIndices;
// /** Creates a fullscreen quad with the given options.
//  * @param gl The WebGL context.
//  * @param name The name of the fullscreen entity.
//  * @param shader The shader program to use for rendering.
//  * @param uniforms Uniform values of this entity to override the shader's defaults. Default: empty.
//  * @param positionAttribute The name of the position attribute. Default: "aPosition".
//  * @param texCoordAttribute The name of the texture coordinate attribute. Default: "aTexCoord".
//  * @returns The fullscreen entity.
//  */
// function createFullscreenQuad(
//     { gl, name, shaders,
//         uniforms = {},
//         positionAttribute = "aPosition",
//         texCoordAttribute = "aTexCoord",
//         // TODO: UV options and an option to produce a screen quad of a different size (a UI panel, for example)
//     }: {
//         gl: WebGL2,
//         name: string,
//         shaders: Shader | Shader[],
//         uniforms?: {
//             [name: string]: UniformValue,
//         },
//         positionAttribute?: string,
//         texCoordAttribute?: string,
//     }
// ): Entity
// {
//     // Position and texture coordinates for a quad that fills the entire screen
//     // in Normalized Device Coordinates.
//     const vertices = [
//         // 3x positions + 2x texCoords
//         -1, 1, 0, 0, 1,
//         -1, -1, 0, 0, 0,
//         1, -1, 0, 1, 0,
//         1, 1, 0, 1, 1,
//     ]
//     // From experience, we know that the fullscreen quad requires vertex positions
//     // and texture coordinates, so we always create buffers for them.
//     const vertexBuffers: { [attribute: string]: AttributeBuffer } = {}
//     const data: Float32Array = new Float32Array(vertices)
//     vertexBuffers[positionAttribute] = createAttributeBuffer({
//         gl,
//         data,
//         numComponents: 3,
//         stride: 5 * Float32Array.BYTES_PER_ELEMENT,
//     })
//     vertexBuffers[texCoordAttribute] = createAttributeBuffer({
//         gl,
//         data,
//         numComponents: 2,
//         stride: 5 * Float32Array.BYTES_PER_ELEMENT,
//         offset: 3 * Float32Array.BYTES_PER_ELEMENT,
//     })
//     // Create the index buffer.
//     const indices: number[] = [
//         0, 1, 2,
//         0, 2, 3
//     ]
//     const indexBuffer: IndexBuffer = createIndexBuffer({ gl, indices })
//     // Create the fullscreen quad entity.
//     return createEntity({ gl, name, vertexBuffers, indexBuffer, shaders, uniforms })
// }
// /** Loads an obj file and returns an entity. */
// async function loadObj(
//     { gl, path, shaders,
//         uniforms = {},
//         name = undefined,
//         positionAttribute = "aPosition",
//         normalAttribute = undefined,
//         texCoordAttribute = undefined,
//     }: {
//         gl: WebGL2,
//         path: string,
//         shaders: Shader | Shader[],
//         uniforms?: {
//             [name: string]: UniformValue,
//         },
//         name?: string,
//         positionAttribute?: string,
//         normalAttribute?: string,
//         texCoordAttribute?: string,
//     }): Promise<Entity>
// {
//     // Load the OBJ file
//     const obj = await parseObj(path)
//     let positions: number[] = []
//     let indices: number[] = []
//     let normals: number[] = []
//     let texCoords: number[] = []
//     { // Expand the compressed OBJ geometry
//         let index = 0
//         const knownIndices: Map<string, number> = new Map()
//         for (const multiIndex of obj.multiIndices) {
//             const key = multiIndex.join(",")
//             if (key in knownIndices) {
//                 // Re-use existing vertices
//                 indices.push(knownIndices.get(key)!)
//             }
//             else {
//                 // Create a new vertex
//                 const positionIndex = multiIndex[0] * 3
//                 positions.push(...obj.positions.slice(positionIndex, positionIndex + 3))
//                 const uvIndex = multiIndex[1] * 2
//                 texCoords.push(...obj.texCoords.slice(uvIndex, uvIndex + 2))
//                 const normalIndex = multiIndex[2] * 3
//                 normals.push(...obj.normals.slice(normalIndex, normalIndex + 3))
//                 indices.push(index)
//                 knownIndices.set(key, index)
//                 index++
//             }
//         }
//     }
//     // Define the name
//     if (!name) {
//         name = obj.name
//     }
//     logInfo(() => `Loaded OBJ '${name}' with ${positions.length / 3} vertices.`)
//     // Create the interleaved vertex array.
//     const interleaved = [positions]
//     const quantities = [3]
//     let stride = 3
//     let normalOffset = 3
//     let texCoordOffset = 3
//     if (normalAttribute) {
//         interleaved.push(normals)
//         quantities.push(3)
//         stride += 3
//         texCoordOffset += 3
//     }
//     if (texCoordAttribute) {
//         interleaved.push(texCoords)
//         quantities.push(2)
//         stride += 2
//     }
//     stride *= Float32Array.BYTES_PER_ELEMENT
//     normalOffset *= Float32Array.BYTES_PER_ELEMENT
//     texCoordOffset *= Float32Array.BYTES_PER_ELEMENT
//     const vertexArray = interleaveArrays(interleaved, quantities)
//     const data = new Float32Array(vertexArray)
//     // TODO: the block above and below appear a lot - factor them out?
//     // Create the vertex buffers.
//     const vertexBuffers: { [attribute: string]: AttributeBuffer } = {}
//     vertexBuffers[positionAttribute] = createAttributeBuffer({
//         gl, data,
//         numComponents: 3,
//         stride,
//         offset: 0,
//     })
//     if (normalAttribute) {
//         vertexBuffers[normalAttribute] = createAttributeBuffer({
//             gl, data,
//             numComponents: 3,
//             stride,
//             offset: normalOffset,
//             glBuffer: vertexBuffers[positionAttribute].glBuffer,
//         })
//     }
//     if (texCoordAttribute) {
//         vertexBuffers[texCoordAttribute] = createAttributeBuffer({
//             gl, data,
//             numComponents: 2,
//             stride,
//             offset: texCoordOffset,
//             glBuffer: vertexBuffers[positionAttribute].glBuffer,
//         })
//     }
//     // Create the index buffer.
//     const indexBuffer = createIndexBuffer({ gl, indices })
//     // Create the entity
//     return createEntity({
//         gl,
//         name,
//         vertexBuffers,
//         indexBuffer,
//         shaders,
//         uniforms,
//     })
// }
// // =============================================================================
// // Private Types
// // =============================================================================
// /** Information loaded from an OBJ file.
//  * For now, we only support OBJ files with a single object as exported by Blender,
//  * with UVs and normals and triangulated faces.
//  */
// type ObjData = {
//     /** Name of the object */
//     name: string
//     /** 3D vertex positions */
//     positions: number[]
//     /** Face indices */
//     multiIndices: [number, number, number][]
//     /** 3D vertex normals */
//     normals: number[]
//     /** 2D texture coordinates */
//     texCoords: number[]
// }
// // =============================================================================
// // Private Functions
// // =============================================================================
/** Creates a new array with the given pattern repeated the given number of times. */
function repeat(pattern, times) {
    return Array.from({ length: times }, function () { return pattern; }).flat();
}
/** Interleave the given arrays, taking a number of elements (quantity) from each array in turn.
 * @param arrays An array of arrays to interleave.
 * @param quantities Either an array of quantities to take from each array,
 * or a single quantity to take from each array. Defaults to 1.
 * @returns A new array with the interleaved values.
 */
function interleaveArrays(arrays, quantities) {
    if (quantities === void 0) { quantities = 1; }
    // Ensure that all arrays are the same size.
    if (arrays.length === 0) {
        return [];
    }
    // If there is only one array, return it.
    if (arrays.length === 1) {
        return arrays[0];
    }
    // Ensure that quantities is an array of the correct size.
    if (!Array.isArray(quantities)) {
        quantities = repeat([quantities], arrays.length);
    }
    else if (quantities.length !== arrays.length) {
        (0, dev_1.throwError)(function () { return "'quantities' must be either a number or an array with the same length as 'arrays'.\n" +
            "    'quantities' length: ".concat(quantities.length, "\n") +
            "    'arrays' length: ".concat(arrays.length); });
    }
    // Ensure that the every quantity is valid.
    var bandCount = arrays[0].length / quantities[0];
    var _loop_1 = function (i) {
        var quantity = quantities[i];
        if (quantity < 1) {
            (0, dev_1.throwError)(function () { return "'quantity' must be greater than 0, but the value at index ".concat(i, " is ").concat(quantity); });
        }
        if (quantity % 1 !== 0) {
            (0, dev_1.throwError)(function () { return "'quantity' must be an integer, but the value at index ".concat(i, " is ").concat(quantity); });
        }
        if (arrays[i].length % quantity !== 0) {
            (0, dev_1.throwError)(function () { return "The length of the corresponding array must be a multiple of 'quantity'\n" +
                "    but the quantity at index ".concat(i, " is ").concat(quantity, "\n") +
                "    whereas the length of the corresponding array is ".concat(arrays[i].length); });
        }
        if (arrays[i].length / quantity !== bandCount) {
            (0, dev_1.throwError)(function () { return "All arrays must have the same number of quantities,\n" +
                "    but array ".concat(i, " of size ").concat(arrays[i].length, " contains ").concat(arrays[i].length / quantity, " times ").concat(quantity, " quantities,\n") +
                "    whereas the first array conttains ".concat(arrays[0].length / quantity, " times ").concat(quantities[0], " quantities."); });
        }
    };
    for (var i = 0; i < arrays.length; i++) {
        _loop_1(i);
    }
    // Interleave the arrays.
    var interleaved = [];
    for (var band = 0; band < bandCount; band++) {
        for (var arrayIndex = 0; arrayIndex < arrays.length; arrayIndex++) {
            var array = arrays[arrayIndex];
            var quantity = quantities[arrayIndex];
            interleaved.push.apply(interleaved, array.slice(band * quantity, (band + 1) * quantity));
        }
    }
    return interleaved;
}
// /** Load and parse an OBJ file into a `CompressedObjGeometry` format.
//  * @param path The path to the OBJ file.
//  * @returns A promise that resolves to the parsed OBJ data.
//  */
// async function parseObj(path: string): Promise<ObjData>
// {
//     // Load the OBJ file
//     const response = await fetch(path)
//     const text = await response.text()
//     // Ignore comments, materials, groups, and smooth shading
//     const ignoredLines: Set<string> = new Set(["#", "mtllib", "g", "usemtl", "s", ""])
//     // Parse the OBJ contents
//     let name: ObjData["name"] | undefined = undefined
//     const positions: ObjData["positions"] = []
//     const multiIndices: ObjData["multiIndices"] = []
//     const normals: ObjData["normals"] = []
//     const uvs: ObjData["texCoords"] = []
//     const lines = text.split("\n")
//     for (const [index, line] of lines.entries()) {
//         const tokens = line.split(" ")
//         const type = tokens[0]
//         if (ignoredLines.has(type)) {
//             continue
//         }
//         else if (type === "o") {
//             if (name === undefined) {
//                 name = tokens[1]
//             }
//             else {
//                 throwError(() => `Multiple object names defined in OBJ file (on line ${index})`)
//             }
//         }
//         else if (type === "v") {
//             positions.push(
//                 parseFloat(tokens[1]),
//                 parseFloat(tokens[2]),
//                 parseFloat(tokens[3]),
//             )
//         }
//         else if (type === "vn") {
//             normals.push(
//                 parseFloat(tokens[1]),
//                 parseFloat(tokens[2]),
//                 parseFloat(tokens[3]),
//             )
//         }
//         else if (type === "vt") {
//             uvs.push(
//                 parseFloat(tokens[1]),
//                 parseFloat(tokens[2]),
//             )
//         }
//         else if (type === "f") {
//             // Face indices contain the vertex ID, UV ID, and normal ID
//             for (let i = 1; i <= 3; i++) {
//                 const face = tokens[i].split("/")
//                 multiIndices.push([
//                     parseInt(face[0]) - 1,
//                     parseInt(face[1]) - 1,
//                     parseInt(face[2]) - 1,
//                 ])
//             }
//         }
//         else if (type === "s") {
//             // Ignore smooth shading
//             continue
//         }
//         else {
//             logWarning(() => `Unexpected OBJ token: '${type}' on line ${index}`)
//         }
//     }
//     if (name === undefined) {
//         throwError(() => "No object name defined in OBJ file")
//     }
//     return {
//         name,
//         positions,
//         multiIndices,
//         normals,
//         texCoords: uvs,
//     }
// }
//# sourceMappingURL=geo.js.map