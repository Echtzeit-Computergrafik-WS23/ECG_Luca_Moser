import { Player, Maze } from "./univserse";
import glance from './js/glance.js'

// this is needed to catch the exit from pointerLock when user presses ESCAPE
function onPointerlockChange() {
  if (document.pointerLockElement === gl.elt ||
    document.mozPointerLockElement === gl.elt)
    console.log("locked");
  else {
    console.log("unlocked");
    player.pointerLock = false;
  }
}
document.addEventListener('pointerlockchange', onPointerlockChange, false);

var player, maze, f, help = false,
  gl;

function preload() {
  f = loadFont('inconsolata.otf');
}

function setup() {
  gl = createCanvas(windowWidth, windowHeight, WEBGL);

  strokeWeight(0.04);
  textFont(f);
  textSize(10);
  player = new Player();
  maze = new Maze(12);
  maze.setPlayerAtStart(player);
  frameRate(60);
  strokeWeight(2);
}
function keyPressed() {
  if (key == 'h') help = !help;
  if(key=='+'){
    player.pov.fovy -= 0.1;
    player.updatePOV();
  }
  if(key=='-'){
    player.pov.fovy += 0.1;
    player.updatePOV();
  }
}

function draw() {
  background(0, 0, 51);

  maze.update();
  maze.display();
  player.update();
  drawAxes();

  if (help || frameCount < 400) { // Heads Up Display extension by jWilliam
    push(); // this affects the frame rate
    camera(0, 0, (height / 2.0) / tan(PI * 30.0 / 180.0), 0, 0, 0, 0, 1, 0);
    ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 1000);
    fill(0, 0, 0, 200);
    noStroke();
    translate(-380, -380, 0);
    scale(2);
    rect(0, 0, 140, 85);
    fill(127);
    text('mouse: left/right : pan', 10, 10);
    text('       up/down : tilt', 10, 20);
    text('       click : ptrlock', 10, 30);
    text(' keys: a/d : left/right', 10, 40);
    text('       w/s : fwd/bkwd', 10, 50);
    text('       e/q : up/down', 10, 60);
    text('       space : jump', 10, 70);
    text('       h : help', 10, 80);
    pop();
  }
}

function drawAxes(){
	push();
      noStroke();
	  fill(127,0,0); // X red
	  translate(75,0.5,0.5);
	  box(150,1,1);
	pop();
	push();
      noStroke();
	  fill(0,127,0); // Y green
	  translate(0.5,75,0.5);
	  box(1,150,1);
	pop();
	push();
      noStroke();
	  fill(0,0,127); // Z blue
	  translate(0.5,0.5,75);
	  box(1,1,150);
	pop();
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