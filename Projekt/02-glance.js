////////////////////////////////////////////////////////////////////////////////
// START OF BOILERPLATE CODE ///////////////////////////////////////////////////

class FirstPersonCamera {
    /**
     * Constructs an instance of the FirstPersonCamera class.
     *
     * @param {HTMLCanvasElement} canvas - The canvas element on which the camera will be rendered.
     */
    constructor(canvas) {
        /** @private */
        this.canvas = canvas;
 
        /** @private */
        this.position = { x: 0, y: 0, z: 0 };
 
        /** @private */
        this.rotation = { x: 0, y: 0 };
 
        /** @private */
        this.movementSpeed = 0.1;
 
        /** @private */
        this.rotationSpeed = 0.01;
 
        /** @private */
        this.isMovingForward = false;
 
        /** @private */
        this.isMovingBackward = false;
 
        /** @private */
        this.isMovingLeft = false;
 
        /** @private */
        this.isMovingRight = false;
 
        /** @private */
        this.isMouseMoving = false;
 
        /** @private */
        this.previousMouseX = 0;
 
        /** @private */
        this.previousMouseY = 0;
 
        /** @private */
        this.mouseSensitivity = 0.1;
 
        /** @private */
        this.updateCameraPosition = this.updateCameraPosition.bind(this);
        /** @private */
        this.updateCameraRotation = this.updateCameraRotation.bind(this);
        /** @private */
        this.handleKeyDown = this.handleKeyDown.bind(this);
        /** @private */
        this.handleKeyUp = this.handleKeyUp.bind(this);
        /** @private */
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }
 
    /**
     * Enables the first-person camera controls.
     * This method adds event listeners for keyboard and mouse inputs to enable camera movement and rotation.
     */
    enable() {
        this.canvas.addEventListener('keydown', this.handleKeyDown);
        this.canvas.addEventListener('keyup', this.handleKeyUp);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        window.requestAnimationFrame(this.updateCameraPosition);
        window.requestAnimationFrame(this.updateCameraRotation);
    }
 
    /**
     * Disables the first-person camera controls.
     * This method removes the event listeners for keyboard and mouse inputs to disable camera movement and rotation.
     */
    disable() {
        this.canvas.removeEventListener('keydown', this.handleKeyDown);
        this.canvas.removeEventListener('keyup', this.handleKeyUp);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    }
 
    /**
     * Updates the camera's position based on the keyboard inputs.
     * This method is called on every frame to update the camera's position.
     *
     * @private
     */
    updateCameraPosition() {
        if (this.isMovingForward) {
            this.position.z -= Math.cos(this.rotation.y) * this.movementSpeed;
            this.position.x -= Math.sin(this.rotation.y) * this.movementSpeed;
        }
        if (this.isMovingBackward) {
            this.position.z += Math.cos(this.rotation.y) * this.movementSpeed;
            this.position.x += Math.sin(this.rotation.y) * this.movementSpeed;
        }
        if (this.isMovingLeft) {
            this.position.x -= Math.cos(this.rotation.y) * this.movementSpeed;
            this.position.z += Math.sin(this.rotation.y) * this.movementSpeed;
        }
        if (this.isMovingRight) {
            this.position.x += Math.cos(this.rotation.y) * this.movementSpeed;
            this.position.z -= Math.sin(this.rotation.y) * this.movementSpeed;
        }
 
        window.requestAnimationFrame(this.updateCameraPosition);
    }
 
    /**
     * Updates the camera's rotation based on the mouse inputs.
     * This method is called on every frame to update the camera's rotation.
     *
     * @private
     */
    updateCameraRotation() {
        if (this.isMouseMoving) {
            const deltaX = this.previousMouseX - event.clientX;
            const deltaY = this.previousMouseY - event.clientY;
 
            this.rotation.y -= deltaX * this.mouseSensitivity * this.rotationSpeed;
            this.rotation.x -= deltaY * this.mouseSensitivity * this.rotationSpeed;
 
            this.previousMouseX = event.clientX;
            this.previousMouseY = event.clientY;
        }
 
        window.requestAnimationFrame(this.updateCameraRotation);
    }
 
    /**
     * Handles the keydown event and updates the camera's movement state.
     *
     * @param {KeyboardEvent} event - The keydown event.
     * @private
     */
    handleKeyDown(event) {
        switch (event.key) {
            case 'w':
                this.isMovingForward = true;
                break;
            case 's':
                this.isMovingBackward = true;
                break;
            case 'a':
                this.isMovingLeft = true;
                break;
            case 'd':
                this.isMovingRight = true;
                break;
        }
    }
 
    /**
     * Handles the keyup event and updates the camera's movement state.
     *
     * @param {KeyboardEvent} event - The keyup event.
     * @private
     */
    handleKeyUp(event) {
        switch (event.key) {
            case 'w':
                this.isMovingForward = false;
                break;
            case 's':
                this.isMovingBackward = false;
                break;
            case 'a':
                this.isMovingLeft = false;
                break;
            case 'd':
                this.isMovingRight = false;
                break;
        }
    }
 
    /**
     * Handles the mousemove event and updates the camera's rotation state.
     *
     * @param {MouseEvent} event - The mousemove event.
     * @private
     */
    handleMouseMove(event) {
        if (!this.isMouseMoving) {
            this.isMouseMoving = true;
            this.previousMouseX = event.clientX;
            this.previousMouseY = event.clientY;
        }
    }
}




// Get the WebGL context
const canvas = document.getElementById('canvas')
const gl = canvas.getContext('webgl2')

//var createCamera = require('./node_modules/first-person-camera/first-person-camera.js')

// A camera object to store properties for our camera
let cam = {
    x: 0, 
    y: 0, 
    z: 0,
    th: 0, 
    phi: 0,
    lookAt: {
      x: 100, 
      y: 0,
      z: 0
    }
}

function upButtonClick() {

}



// Event-Listener for Button-Pressed
window.addEventListener('keydown', function (event) {
    // Check (Key Code 69)
    if (event.keyCode === 87) {
        console.log('W-Taste wurde gedrückt!');
        cam.x -= 2 * Math.cos(cam.th)
        cam.z += 2 * Math.sin(cam.th)
        upButtonClick();
    }
    if (event.keyCode === 83) {
        console.log('S-Taste wurde gedrückt!');
        cam.x += 2 * Math.cos(cam.th)
        cam.z -= 2 * Math.sin(cam.th)
        upButtonClick();
    }
    if (event.keyCode === 68) {
        console.log('D-Taste wurde gedrückt!');
        cam.x -= 2 * Math.cos(cam.th + Math.PI/2)
        cam.z += 2 * Math.sin(cam.th + Math.PI/2)
        upButtonClick();
    }
    if (event.keyCode === 65) {
        console.log('A-Taste wurde gedrückt!');
        cam.x += 2 * Math.cos(cam.th + Math.PI/2)
        cam.z -= 2 * Math.sin(cam.th + Math.PI/2)
        upButtonClick();
    }
});

// Define the look at vector
let x = [100, 0, 0]
let R = math.multiply(Rz(cam.phi), Ry(cam.th))
x = math.multiply(x, R)

// Update the look-at point
cam.lookAt = {
  x: cam.x + x._data[0],
  y: cam.y + x._data[1],
  z: cam.z + x._data[2]
}


// Rotation matrix for rotation about z-axis
function Rz(th) {
    return(
      math.matrix([[Math.cos(th), Math.sin(th), 0],
                  [-Math.sin(th), Math.cos(th), 0],
                  [0, 0, 1]])
    )
  }
  
  // Rotation matrix for rotation about y-axis
  function Ry(th) {
    return(
      math.matrix([[Math.cos(th), 0, -Math.sin(th)],
                   [0, 1, 0],
                   [Math.sin(th), 0, Math.cos(th)]
                  ])
    )
  }

// *** END Controller **********************************************************************************************


// Basic render loop manager.
function setRenderLoop(callback) {
    function renderLoop(time) {
        if (setRenderLoop._callback !== null) {
            setRenderLoop._callback(time)
            requestAnimationFrame(renderLoop)
        }
    }
    setRenderLoop._callback = callback
    requestAnimationFrame(renderLoop)
}
setRenderLoop._callback = null

import glance from './js/glance.js'


// BOILERPLATE END
////////////////////////////////////////////////////////////////////////////////

const {
    vec3,
    mat3,
    mat4,
} = glance


// =============================================================================
// Shader Code
// =============================================================================


const worldVertexShader = `#version 300 es
    precision highp float;

    uniform mat4 u_modelMatrix;
    uniform mat4 u_viewMatrix;
    uniform mat4 u_projectionMatrix;
    uniform mat3 u_normalMatrix;

    in vec3 a_pos;
    in vec3 a_normal;
    in vec2 a_texCoord;

    out vec3 f_worldPos;
    out vec3 f_normal;
    out vec2 f_texCoord;

    void main() {
        f_worldPos = vec3(u_modelMatrix * vec4(a_pos, 1.0));
        f_normal = u_normalMatrix * a_normal;
        f_texCoord = a_texCoord;
        gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_pos, 1.0);
    }
`

const worldFragmentShader = `#version 300 es
    precision mediump float;

    uniform float u_ambient;
    uniform float u_specular;
    uniform float u_shininess;
    uniform vec3 u_lightPos;
    uniform vec3 u_lightColor;
    uniform vec3 u_viewPos;
    uniform sampler2D u_texAmbient;
    uniform sampler2D u_texDiffuse;
    uniform sampler2D u_texSpecular;

    in vec3 f_worldPos;
    in vec3 f_normal;
    in vec2 f_texCoord;

    out vec4 FragColor;

    void main() {

        // texture
        vec3 texAmbient = texture(u_texAmbient, f_texCoord).rgb;
        vec3 texDiffuse = texture(u_texDiffuse, f_texCoord).rgb;
        vec3 texSpecular = texture(u_texSpecular, f_texCoord).rgb;

        // ambient
        vec3 ambient = max(vec3(u_ambient), texAmbient) * texDiffuse;

        // diffuse
        vec3 normal = normalize(f_normal);
        vec3 lightDir = normalize(u_lightPos - f_worldPos);
        float diffuseIntensity = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = diffuseIntensity * u_lightColor * texDiffuse;

        // specular
        vec3 viewDir = normalize(u_viewPos - f_worldPos);
        vec3 halfWay = normalize(lightDir + viewDir);
        float specularIntensity = pow(max(dot(normal, halfWay), 0.0), u_shininess);
        vec3 specular = (u_specular * specularIntensity) * texSpecular * u_lightColor;

        // color
        FragColor = vec4(ambient + diffuse + specular, 1.0);
    }
`

const skyVertexShader = `#version 300 es
    precision highp float;

    uniform mat3 u_viewRotationMatrix;
    uniform mat4 u_projectionMatrix;

    in vec3 a_pos;

    out vec3 f_texCoord;

    void main() {
        // Use the local position of the vertex as texture coordinate.
        f_texCoord = a_pos;

        // By setting Z == W, we ensure that the vertex is projected onto the
        // far plane, which is exactly what we want for the background.
        vec4 ndcPos = u_projectionMatrix * inverse(mat4(u_viewRotationMatrix)) * vec4(a_pos, 1.0);
        gl_Position = ndcPos.xyww;
    }
`

const skyFragmentShader = `#version 300 es
    precision mediump float;

    uniform samplerCube u_skybox;

    in vec3 f_texCoord;

    out vec4 FragColor;

    void main() {
        // The fragment color is simply the color of the skybox at the given
        // texture coordinate (local coordinate) of the fragment on the cube.
        FragColor = texture(u_skybox, f_texCoord);
    }
`

// =============================================================================
// Data
// =============================================================================


const projectionMatrix = mat4.perspective(Math.PI / 4, 1, 0.1, 14)




// The skybox
const skyShader = glance.buildShaderProgram(gl, "sky-shader", skyVertexShader, skyFragmentShader, {
    u_projectionMatrix: projectionMatrix,
    u_skybox: 0,
})

const skyIBO = glance.createIndexBuffer(gl, glance.createSkyBoxIndices())

const skyABO = glance.createAttributeBuffer(gl, "sky-abo", glance.createSkyBoxAttributes(), {
    a_pos: { size: 3, type: gl.FLOAT },
})

const skyVAO = glance.createVAO(gl, "sky-vao", skyIBO, glance.buildAttributeMap(skyShader, skyABO, ["a_pos"]))

const [skyCubemap, skyCubeMapLoaded] = glance.loadCubemap(gl, "sky-texture", [
    "img/Skybox_Right.avif",
    "img/Skybox_Left.avif",
    "img/Skybox_Top.avif",
    "img/Skybox_Bottom.avif",
    "img/Skybox_Front.avif",
    "img/Skybox_Back.avif",
])

// =============================================================================
// Draw Calls
// =============================================================================

// Scene State
let viewPan = 0
let viewTilt = 0

const skyDrawCall = glance.createDrawCall(
    gl,
    skyShader,
    skyVAO,
    {
        // uniform update callbacks
        u_viewRotationMatrix: () => mat3.fromMat4(mat4.multiply(
            mat4.multiply(mat4.identity(), mat4.fromRotation(viewPan, [0, 1, 0])),
            mat4.fromRotation(viewTilt, [1, 0, 0])
        )),
    },
    [
        // texture bindings
        [0, skyCubemap],
    ],
    () => skyCubeMapLoaded.isComplete()
)


// =============================================================================
// System Integration
// =============================================================================

setRenderLoop((time) =>
{
    // One-time WebGL setup
    // gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    glance.performDrawCall(gl, skyDrawCall, time)
})
