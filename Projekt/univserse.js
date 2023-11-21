
var __RoverCam_cbq = [];


p5.prototype.registerMethod('post', ()=>{for(let i of __RoverCam_cbq)i.draw.call(i)});

class RoverCam {
  constructor(){
    this.speed = 0.1;
    this.sensitivity = 0.02;
    this.position = createVector(0, 0, 0);
    this.velocity = createVector(0, 0, 0);
    this.up = createVector(0, 1, 0);
    this.right = createVector(1, 0, 0);
    this.forward = createVector(0, 0, 1);
    this.pan = 0.0;
    this.tilt = 0.0;
    this.rot = 0.0;
    this.friction = 0.75;
    // ***
    this.pov = {
      fovy:1.0,
      near:0.01,
      far:1000.0
    }
    this.width = 0;
    this.height = 0;
    // push 'this' onto a callback queue
    __RoverCam_cbq.push(this);
  }
  
  // Application can override the following method
  controller(){ // defaults
    this.yaw(movedX * this.sensitivity);
    this.pitch(movedY * this.sensitivity);
    if(keyIsDown(87) || keyIsDown(UP_ARROW))    this.moveX(this.speed);  // w
    if(keyIsDown(65) || keyIsDown(LEFT_ARROW))  this.moveY(this.speed);  // a
    if(keyIsDown(83) || keyIsDown(DOWN_ARROW))  this.moveX(-this.speed); // s
    if(keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.moveY(-this.speed); // d
    if(keyIsDown(81))                           this.moveZ(-this.speed); // q
    if(keyIsDown(69))                           this.moveZ(this.speed);  // e
    if(mouseIsPressed) this.moveX(this.speed);
    // alternatively:
    // this.pan(map(mouseX - pmouseX, 0, width, 0, TWO_PI) * this.sensitivity);
    // this.tilt(map(mouseY - pmouseY, 0, height, 0, PI) * this.sensitivity);
    
    // test roll
    if(keyIsDown(90)) this.roll(this.sensitivity);  // z
    if(keyIsDown(67)) this.roll(-this.sensitivity); // c
  }
  
  // Primitive internal camera control methods
  moveX(speed){
    this.velocity.add(p5.Vector.mult(this.forward, speed));
  }
  moveY(speed){
    this.velocity.add(p5.Vector.mult(this.right, speed));
  }
  moveZ(speed){
    this.velocity.add(p5.Vector.mult(this.up, -speed));
  }
  yaw(angle){
    this.pan += angle;
  }
  pitch(angle){
    this.tilt += angle;
    this.tilt = this.clamp(this.tilt, -PI/2.01, PI/2.01);
    if (this.tilt == PI/2.0) this.tilt += 0.001;
  }
  roll(angle){ // TBD: useful for flight sim or sloped racetracks
    this.rot += angle;
  }
  // This method is called after the main p5.js draw loop 
  draw(){
    if(width !== this.width || height !== this.height){
        this.updatePOV(); // ***
        this.width = width;
        this.height = height;
    }

    // Call the potentially overridden controller method
    this.controller();

    this.forward = createVector(cos(this.pan), tan(this.tilt), sin(this.pan));
    this.forward.normalize();
    this.right = createVector(cos(this.pan - PI/2.0), 0, sin(this.pan - PI/2.0));
    // TBD: handle roll command (using this.rot)

    this.velocity.mult(this.friction);
    this.position.add(this.velocity);
    let center = p5.Vector.add(this.position, this.forward);
    camera(this.position.x, this.position.y, this.position.z, center.x, center.y, center.z, this.up.x, this.up.y, this.up.z);
  }
  
  // *** adjust perspective
  updatePOV(){
    perspective(this.pov.fovy, width/height, this.pov.near, this.pov.far);
  }

  clamp(aNumber, aMin, aMax) {
    return (aNumber > aMax ? aMax
        : aNumber < aMin ? aMin
            : aNumber);
  }
} 

class Block {
    constructor(x, y, z, w, h, d) {
      this.position = createVector(x, y, z);
      this.dimensions = createVector(w, h, d);
      this.fillColor = color(random(150, 200));
      this.visited = false;
    }
  
    update() {
      let playerLeft = player.position.x - player.dimensions.x / 2;
      let playerRight = player.position.x + player.dimensions.x / 2;
      let playerTop = player.position.y - player.dimensions.y / 2;
      let playerBottom = player.position.y + player.dimensions.y / 2;
      let playerFront = player.position.z - player.dimensions.z / 2;
      let playerBack = player.position.z + player.dimensions.z / 2;
  
      let boxLeft = this.position.x - this.dimensions.x / 2;
      let boxRight = this.position.x + this.dimensions.x / 2;
      let boxTop = this.position.y - this.dimensions.y / 2;
      let boxBottom = this.position.y + this.dimensions.y / 2;
      let boxFront = this.position.z - this.dimensions.z / 2;
      let boxBack = this.position.z + this.dimensions.z / 2;
  
      let boxLeftOverlap = playerRight - boxLeft;
      let boxRightOverlap = boxRight - playerLeft;
      let boxTopOverlap = playerBottom - boxTop;
      let boxBottomOverlap = boxBottom - playerTop;
      let boxFrontOverlap = playerBack - boxFront;
      let boxBackOverlap = boxBack - playerFront;
  
      if (((playerLeft > boxLeft && playerLeft < boxRight || (playerRight > boxLeft && playerRight < boxRight)) && ((playerTop > boxTop && playerTop < boxBottom) || (playerBottom > boxTop && playerBottom < boxBottom)) && ((playerFront > boxFront && playerFront < boxBack) || (playerBack > boxFront && playerBack < boxBack)))) {
        let xOverlap = max(min(boxLeftOverlap, boxRightOverlap), 0);
        let yOverlap = max(min(boxTopOverlap, boxBottomOverlap), 0);
        let zOverlap = max(min(boxFrontOverlap, boxBackOverlap), 0);
  
        if (xOverlap < yOverlap && xOverlap < zOverlap) {
          if (boxLeftOverlap < boxRightOverlap) {
            player.position.x = boxLeft - player.dimensions.x / 2;
          } else {
            player.position.x = boxRight + player.dimensions.x / 2;
          }
        } else if (yOverlap < xOverlap && yOverlap < zOverlap) {
          if (boxTopOverlap < boxBottomOverlap) {
            player.position.y = boxTop - player.dimensions.y / 2;
            player.velocity.y = 0;
            player.grounded = true;
          } else {
            player.position.y = boxBottom + player.dimensions.y / 2;
          }
        } else if (zOverlap < xOverlap && zOverlap < yOverlap) {
          if (boxFrontOverlap < boxBackOverlap) {
            player.position.z = boxFront - player.dimensions.x / 2;
          } else {
            player.position.z = boxBack + player.dimensions.x / 2;
          }
        }
      }
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
  
export class Maze {
    constructor(size) {
      this.blocks = new Array(size);
  
      for (let i = 0; i < size; i++) {
        this.blocks[i] = new Array(size);
        for (let j = 0; j < size; j++) {
          let x = i * 5;
          let y = 0;
          let z = j * 5;
          this.blocks[i][j] = new Block(x, y, z, 5, 5, 5);
        }
      }
  
      this.start = this.blocks[1][1];
      this.blocks[1][1].fillColor = color(63, 127, 63);
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
      ];
      for (let i = 1; i < size - 1; i++)
        for (let j = 1; j < size - 1; j++)
          if (m[i][j]) this.blocks[i][j].moveDown();
          else this.blocks[i][j].fillColor = color(127);
      this.blocks[3][3].fillColor = color(127, 63, 63);
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
  
  
export class Player extends RoverCam {
    constructor() {
      super();
      this.dimensions = createVector(1, 3, 1);
      this.velocity = createVector(0, 0, 0);
      this.gravity = createVector(0, 0.03, 0);
      this.grounded = false;
      this.pointerLock = false;
      this.sensitivity = 0.002;
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


