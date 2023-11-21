// Tutorial: https://www.youtube.com/watch?v=0b9WPrc0H2w&feature=youtu.be 


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

function setup() {
  createCanvas(700, 500, WEBGL);
  
  // Keep track of the previous mouse position for look around controls
  mousePrev = {
    x: mouseX,
    y: mouseY
  }
}

function draw() {
  background(220);
  // orbitControl()
  lights()
  
  // A big sphere for a visual reference frame
  push()
    noFill()
    stroke(0)
    sphere(100)
  pop()
  
  // x and y axes
  stroke(255, 0, 0)
  line(0, 0, 100, 0)
  stroke(0, 255, 0)
  line(0, 0, 0, 100)
  
  // Look around controls
  cam.th += (mouseX - mousePrev.x) / 100;
  cam.phi += (mouseY - mousePrev.y) / 100;
  
  // Movement controls
  if(keyIsPressed && keyCode == 87){
    cam.x -= 2 * cos(cam.th)
    cam.z += 2 * sin(cam.th)
  }
  if(keyIsPressed && keyCode == 83){
    cam.x += 2 * cos(cam.th)
    cam.z -= 2 * sin(cam.th)
  }
  if(keyIsPressed && keyCode == 68){
    cam.x -= 2 * cos(cam.th + PI/2)
    cam.z += 2 * sin(cam.th + PI/2)
  }
  if(keyIsPressed && keyCode == 65){
    cam.x += 2 * cos(cam.th + PI/2)
    cam.z -= 2 * sin(cam.th + PI/2)
  }
  
  // Update previous mouse position
  mousePrev.x = mouseX;
  mousePrev.y = mouseY
  
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
  
  // Call the built in p5 function 'camera' to position and orient the camera
  camera(cam.x, cam.y, cam.z,  // position
         cam.lookAt.x, cam.lookAt.y, cam.lookAt.z,  // look-at
         0, -1, 0)  // up vector
  
  // Draw a sphere at the look at point
  push()
    // rotateY(cam.th)
    // rotateZ(cam.phi)
    // translate(100, 0)
    translate(cam.lookAt.x, cam.lookAt.y, cam.lookAt.z)
    fill(255)
    noStroke()
    sphere(10)
  pop()
  
}

// Rotation matrix for rotation about z-axis
function Rz(th) {
  return(
    math.matrix([[cos(th), sin(th), 0],
                [-sin(th), cos(th), 0],
                [0, 0, 1]])
  )
}

// Rotation matrix for rotation about y-axis
function Ry(th) {
  return(
    math.matrix([[cos(th), 0, -sin(th)],
                 [0, 1, 0],
                 [sin(th), 0, cos(th)]
                ])
  )
}