

//import glance from '../Projekt/js/glance.js'
class Block {
  constructor(x, y, z, w, h, d) {
    this.position = createVector(x, y, z);
    this.dimensions = createVector(w, h, d);
    this.fillColor = color(random(150, 200));
    this.visited = false;
  }


  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    fill(this.fillColor);
    box(this.dimensions.x, this.dimensions.y, this.dimensions.z);
    pop();
  }

  moveDown() {
    this.position.y += 5;
  }
}
class Mansion {
  constructor(size) {
    this.blocks = new Array(size);

    for (let i = 0; i < size; i++) {
      this.blocks[i] = new Array(size);
      for (let j = 0; j < size; j++) {
        let x = i * 50; //let x = i * 5;
        let y = 0;
        let z = j * 50; //let z = j * 5;
        this.blocks[i][j] = new Block(x, y, z, 50, 50, 50); // this.blocks[i][j] = new Block(x, y, z, 5, 5, 5);
      }
    }

    this.start = this.blocks[1][1];
    this.blocks[1][1].fillColor = color(63, 127, 63);
    var m = [
      [1,1],
      [1,1]
    ];
    /*
    var m = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];


    var m = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0],
      [0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0],
      [0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];*/
    for (let i = 1; i < size - 1; i++)
      for (let j = 1; j < size - 1; j++)
        if (m[i][j]) this.blocks[i][j].moveDown();
        else this.blocks[i][j].fillColor = color(127);
    //this.blocks[3][3].fillColor = color(127, 63, 63);
  }


  update() {
    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = 0; j < this.blocks[i].length; j++) {
        this.blocks[i][j].update();
      }
    }
  }

  display() {
    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = 0; j < this.blocks[i].length; j++) {
        this.blocks[i][j].display();
      }
    }
  }

  setPlayerAtStart(player) {
    player.position = p5.Vector.add(this.start.position, createVector(0, -15, 0));
  }
}


class Player extends RoverCam {
  constructor() {
    super();
    this.dimensions = createVector(1, 3, 1);
    this.velocity = createVector(0, 0, 0);
    this.gravity = createVector(0, 0.03, 0);
    this.grounded = false;
    this.pointerLock = false;
    this.sensitivity = 0.02;
    this.speed = 0.04;
  }
  
  controller() { // override
    if (player.pointerLock) {
      this.yaw(movedX * this.sensitivity);   // mouse left/right
      this.pitch(movedY * this.sensitivity); // mouse up/down
      if(keyIsDown(65) || keyIsDown(LEFT_ARROW))  this.moveY(0.01); // a
      if(keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.moveY(-0.01);// d
    }
    else { // otherwise yaw/pitch with keys
      if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) this.yaw(-0.02); // a
      if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.yaw(0.02); // d
      if (keyIsDown(82)) this.pitch(-0.02); // r
      if (keyIsDown(70)) this.pitch(0.02);  // f
    }
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) this.moveX(this.speed);    // w
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) this.moveX(-this.speed); // s
    if (keyIsDown(69)) this.moveZ(0.05); // e
  }
  
  update() {
    if (keyIsPressed && key == 'e') {
      this.grounded = false;
      return;
    }
    this.velocity.add(this.gravity);
    this.position.add(this.velocity);

    if (this.grounded && keyIsPressed && keyCode == 32) { // space
      this.grounded = false;
      this.velocity.y = -1.5;
      this.position.y -= 0.2;
    }
  }
}

// this is needed to catch the exit from pointerLock when user presses ESCAPE
function onPointerlockChange() {
  if (document.pointerLockElement === canvas.elt ||
    document.mozPointerLockElement === canvas.elt)
    console.log("locked");
  else {
    console.log("unlocked");
    player.pointerLock = false;
  }
}
document.addEventListener('pointerlockchange', onPointerlockChange, false);

var player, mansion, f, help = false,
  canvas;

function preload() {
  //TODO For the help-gui or maybe stat-gui // f = loadFont();
}

function setup() {
  
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  strokeWeight(0.04);
  textFont(f);
  textSize(10);
  player = new Player();
  mansion = new Mansion(2); 
  mansion.setPlayerAtStart(player);
  frameRate(60);
  strokeWeight(2);
}

function draw() {
  background(0, 0, 51);

  mansion.update();
  mansion.display();
  player.update();
}

function mouseClicked() {
  if (!player.pointerLock) {
    player.pointerLock = true;
    requestPointerLock();
  } else {
    exitPointerLock();
    player.pointerLock = false;
  }
}