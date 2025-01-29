p5.disableFriendlyErrors = true; // disables FES

let hillCollider;
let tireImage;
let carImage;
let wheel1;
let wheel2;
let wheel2Pos;
let scroll;
let scrollIndex = 0;
let score;
let lavaY = 325;
let gameState = 1; // 0 = game    1 =  main menu    2 = win screen    3 = lose screen
// 4 = instructions
let health;
let rightArrow = false;
let leftArrow = false;


// load images
function preload() {
  Tire = loadImage('/images/Tire.png');
  Car = loadImage('/images/Car.png');
}


function setup() {
  createCanvas(800, 500);
  textSize(60);
  setVariables();
}


function setVariables() {
  // smooth scrolling
  scroll = [];
  for (let i = 0; i < 10; i++) {
    scroll.push(createVector());
  }

  // hill
  let hillQuality = 10;
  let hillPoints = Array(width / hillQuality * 50).fill();
  hillPoints[0] = createVector(-hillQuality * 51, height * 2);
  hillPoints[hillPoints.length - 1] = createVector(hillQuality * hillPoints.length -
      hillQuality - hillQuality * 50, height * 2);
  for (let i = 1; i < hillPoints.length - 1; i++) {
      let offset = noise(i / 55.0);
    hillPoints[i] = createVector(i * hillQuality - hillQuality * 50, height -
        map(offset, 0, 1, 75, 500));
  }
  HillCollider = new PolygonCollider(hillPoints);


  // car
  Tire.resize(50, 50);
  Car.resize(250, 115);
  health = 100;
  let WheelQuality = 15;
  let Wheel1Points = [];
  for (let i = 0; i < WheelQuality; i++) {
    Wheel1Points.push(createVector(25 * cos(radians(360.0 / WheelQuality * i)),
        25 * sin(radians(360.0 / WheelQuality * i))));
  }
  Wheel2Points = Wheel1Points.slice();
  Wheel1 = new PhysicsBody(Wheel1Points, createVector(width / 2, -200), 0.075, 0.25);
  Wheel1.addCollisionObject(HillCollider);

  Wheel2 = new PolygonCollider(Wheel2Points);
  Wheel2Position = createVector();

  moveWheel2To(0, -200);
}


function moveWheel2To(xPos, yPos) {
  Wheel2.move(-Wheel2Position.x, -Wheel2Position.y);
  Wheel2Position = createVector(xPos, yPos);
  Wheel2.move(xPos, yPos);
}


function draw() {
  // debugger;
  switch (gameState) {
    case 0:
      drawGame();
      break;
    case 1:
      drawMenu();
      break;
    case 2:
      drawWinScreen();
      break;
    case 3:
      drawLoseScreen();
      break;
    case 4:
      drawInstructionsScreen();
      break;
  }
  // fill(mouseX, mouseY, 100);
  // rect(100, 100, 150, 75);
}


function drawInstructionsScreen() {
  background("#69ABE3");
  
  textSize(35);
  strokeWeight(2);
  textAlign(CENTER);
  fill("#987A2D");
  text("Welcome to Hill Climb Racing", width/2, 100);
  text("In this game you have to run as far as possible to", width/2, 100 + 40);
  text("reach the end of the hills while avoiding the lava", width/2, 100 + 80);
  
  text("Use to right and left arrow key to accelerate your", width/2, 100 + 160);
  text("car", width/2, 100 +200);

  // go back button
  stroke("#38C616");
  strokeWeight(5);
  fill("#987A2D");
  rect(width/2 -100, height - 75, 200, 50, 20);

  textSize(35);
  fill("#38C616");
  strokeWeight(3);
  if (mouseX> width/2 - 200/2  &&  mouseX< width/2 + 200/2  && mouseY>(height -50 -2) - 50/2  && mouseY<(height -50 -2) + 50/2) {
    if (mouseIsPressed) {
      setVariables();
      gameState = 1; // game -> menu
    }
    fill("#E0B310");
  }
  text("Go Back", width/2, height-75+40);
}


function drawLoseScreen() {
  push();
  // background
  scale(75/100.0);
  background("#69ABE3");
  let currentScroll = scroll[(scrollIndex + 1)%scorecroll.length];
  translate(currentScroll.x, currentScroll.y);
  
  
  drawTerain();
  drawCar();
  pop();
  
  // score
  textSize(50);
  textAlign(CENTER);
  fill("#987A2D");
  text("Score: "+round(score), width/2, 200);
  textSize(51);
  fill("#38C616");
  text("Score: "+round(score), width/2, 198);
  
  // you lose text
  textSize(70);
  textAlign(CENTER);
  fill("#987A2D");
  text("You Lose", width/2, 100);
  textSize(71);
  fill("#38C616");
  text("You Lose", width/2, 98);

  // go back button
  stroke("#38C616");
  strokeWeight(5);
  fill("#987A2D");
  rect(width/2 -100, height/2 - 25, 200, 50, 20);

  textSize(35);
  fill("#38C616");
  if (mouseX> width/2 - 200/2  &&  mouseX< width/2 + 200/2  && mouseY>(height/2 -2) - 50/2  && mouseY<(height/2 -2) + 50/2) {
    if (mouseIsPressed) {
      setVariables();
      gameState = 1; // game -> menu
    }
    fill("#E0B310");
  }
  text("Go Back", width/2, height/2+15);
}


function drawWinScreen() {
  push();
  // background
  scale(75/100.0);
  background("#69ABE3");
  let currentScroll = Scroll[(scrollIndex + 1)%Scroll.length];
  translate(currentScroll.x, currentScroll.y);
  
  
  drawTerain();
  drawCar();
  pop();
  
  // score
  textSize(50);
  textAlign(CENTER);
  fill("#987A2D");
  text("Score: "+round(score), width/2, 200);
  textSize(51);
  fill("#38C616");
  text("Score: "+round(score), width/2, 198);
  
  // you win text
  textSize(70);
  textAlign(CENTER);
  fill("#987A2D");
  text("You Win", width/2, 100);
  textSize(71);
  fill("#38C616");
  text("You Win", width/2, 98);

  // go back button
  stroke("#38C616");
  strokeWeight(5);
  fill("#987A2D");
  rect(width/2 -100, height/2 - 25, 200, 50, 20);

  textSize(35);
  fill("#38C616");
  if (mouseX> width/2 - 200/2  &&  mouseX< width/2 + 200/2  && mouseY>(height/2 -2) - 50/2  && mouseY<(height/2 -2) + 50/2) {
    if (mouseIsPressed) {
      setVariables();
      gameState = 1; // game -> menu
    }
    fill("#E0B310");
  }
  text("Go Back", width/2, height/2+15);
}


function drawMenu() {
  // background
  background("#69ABE3");
  drawTerain();

  // title
  textSize(70);
  textAlign(CENTER);
  fill("#987A2D");
  text("Hill Climb Racing", width/2, 100);
  textSize(71);
  fill("#38C616");
  text("Hill Climb Racing", width/2, 98);

  // play button
  stroke("#38C616");
  strokeWeight(3);
  fill("#987A2D");
  rect(width/2 -100, height - 150 - 25, 200, 50, 20);

  textSize(40);
  fill("#38C616");
  if (mouseX> width/2 - 200/2  &&  mouseX< width/2 + 200/2  && mouseY>(height -150 -2) - 50/2  && mouseY<(height -150 -2) + 50/2) {
    if (mouseIsPressed) {
      setVariables();
      gameState = 0; // menu -> game
    }
    strokeWeight(3);
    fill("#E0B310");
  }
  text("PLAY", width/2, height-150+15);


  // instructions button
  stroke("#38C616");
  strokeWeight(3);
  fill("#987A2D");
  rect(width/2 -100, height - 75 - 25, 200, 50, 20);

  textSize(25);
  fill("#38C616");
  if (mouseX> width/2 - 200/2  &&  mouseX< width/2 + 200/2  && mouseY>(height -75 -2) - 50/2  && mouseY<(height -75 -2) + 50/2) {
    if (mouseIsPressed) {
      gameState = 4; // menu -> game
    }
    strokeWeight(3);
    fill("#E0B310");
  }
  text("INSTRUCTIONS", width/2, height-75+10);
}


function drawGame() {
  // smooth scrolling
  scale(75/100.0);
  background("#69ABE3");
  let currentScroll = scroll[(scrollIndex + 1)%scroll.length];
  translate(currentScroll.x, currentScroll.y);

  drawTerain();
  moveCar();
  score = -currentScroll.x/20;
  checkCarHitLava();
  drawCar();

  // smooth scrolling
  scroll[scrollIndex] = createVector(-Wheel1.Position.x+400, -Wheel1.Position.y + 300);
  scrollIndex = (scrollIndex + 1)%scroll.length;
  
  translate(-currentScroll.x, -currentScroll.y);
  displayGameUI();
  if (Wheel2.checkCollision(HillCollider)){
    fill(255, 0, 0);
  } else {fill(0, 255, 0);}
  Wheel2.draw();
  
  if (score>=1900){ // win condition
    gameState = 2; // game -> win screen
  }
}


function drawTerain() {

  // draw hills
  push();
  translate(0, -125)
  fill("#987A2D");
  stroke("#5ADB3E");
  strokeWeight(10);
  HillCollider.draw();
  pop();

  // draw lava
  strokeWeight(0);
  fill("#FF3300");
  rect(-3_000, lavaY, 44_000, 1000);
}


function checkCarHitLava() {
  if (Wheel1.Position.y + 25 > lavaY  ||  Wheel2Position.y + 25 > lavaY) { // car hit lava
    health=max(health-1.25, 0);
  }

  if (health<=0) {
    gameState=3;
  }
}


function displayGameUI() {

  // score
  textSize(50);
  textAlign(LEFT);
  fill("#987A2D");
  text("Score: "+round(score), width/4, 100);
  textSize(51);
  fill("#38C616");
  text("Score: "+round(score), width/4, 98);

  // health bar text

  fill("#987A2D");
  textAlign(CENTER);
  text("Health", 700, 70);
  textSize(51);
  fill("#38C616");
  text("Health", 700, 68);

  // health bar
  fill("#EE0000");
  stroke("#000000");
  strokeWeight(2.5);
  rect(700 - 200/2, 105, 200, 30);
  fill("#00EE00");
  rect(700 - 200/2, 105, map(health, 0, 100, 0, 200), 30);
}


function drawCar() {
  imageMode(CENTER);
  // wheel 1
  push();
  translate(Wheel1.Position.x, Wheel1.Position.y);
  rotate(score/1.5);
  image(Tire, 0, 0);
  pop();
  
  // wheel 2
  push();
  translate(Wheel2Position.x, Wheel2Position.y);
  rotate(score/1.5);
  image(Tire, 0, 0);
  pop();
  
  // chasis
  push();
  translate(Wheel1.Position.x, Wheel1.Position.y);
  //println(Wheel1.Position.y - Wheel2Position.y);
  rotate(radians(map(Wheel1.Position.y - Wheel2Position.y, 80, -65, -30, 25)));
  image(Car, 77.5, -45);
  pop();
}


function moveCar() {
  Wheel1.update();
  if (rightArrow  &&  Wheel1.Collider.checkCollision(HillCollider)  ||  Wheel2.checkCollision(HillCollider)){
    Wheel1.velocity.x += 10;
  }
  if (leftArrow  &&  Wheel1.Collider.checkCollision(HillCollider)  ||  Wheel2.checkCollision(HillCollider)){
    Wheel1.velocity.x -= 10;
  }

  // wheel 2 update

  moveWheel2To(Wheel1.Position.x + 120, Wheel1.Position.y);

  let numCollisions = 0;
  let distance = 195;
  let prevPos = Wheel2Position.copy();
  for (let i=-90; i<0; i+=5) {
    moveWheel2To(Wheel1.Position.x+distance*cos(radians(i+5*6)), Wheel1.Position.y+distance*sin(radians(i+5*6)));
    if (Wheel2.checkCollision(HillCollider)) {
      numCollisions+=1;
    }
    if (numCollisions>=6) {
      moveWheel2To(Wheel1.Position.x+distance*cos(radians(i)), Wheel1.Position.y+distance*sin(radians(i)));
      break;
    }
  }
  
  // smoothen position
  let SmoothedPos = prevPos.add(Wheel2Position.copy()).mult(0.5);
  moveWheel2To(SmoothedPos.x, SmoothedPos.y);
}


function keyPressed() {
  console.log(keyCode);
  switch(keyCode) {
  case 39: // right arrow
    rightArrow = true;
    break;
  case 37: // left arrow
    leftArrow = true;
    break;
  }
}

function keyReleased() {
  switch(keyCode) {
  case 39: // right arrow
    rightArrow = false;
    break;
  case 37: // left arrow
    leftArrow = false;
    break;
  }
}
