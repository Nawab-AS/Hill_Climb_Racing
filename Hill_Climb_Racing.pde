PolygonCollider HillCollider; //<>//
PImage Tire;
PImage Car;
PhysicsBody Wheel1;
PolygonCollider Wheel2;
PVector Wheel2Position;
PVector[] Scroll = new PVector[10];
int scrollIndex = 0;
float score;
int lavaY = 325;
int gameState = 1;  // 0 = game    1 =  main menu    2 = win screen    3 = lose screen    4 = instructions
float health;

void setup() {
  size(800, 500);
  textSize(60);
  setVariables();
}


void draw() {
  switch(gameState) {
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
}


void setVariables() {
  // smooth scrolling
  for (int i=0; i<Scroll.length; i++) {
    Scroll[i] = new PVector();
  }

  // hill
  int hillQuality = 10;
  PVector[] hillPoints = new PVector[width/hillQuality *  50];
  hillPoints[0] = new PVector(-hillQuality *51, height*2);
  hillPoints[hillPoints.length-1] = new PVector(hillQuality * hillPoints.length -hillQuality  -hillQuality*50, height*2);
  for (int i=1; i<hillPoints.length-1; i++) {
    float offset = noise(i/55.0);
    hillPoints[i] = new PVector(i * hillQuality -hillQuality*50, height - map(offset, 0, 1, 75, 500));
  }
  HillCollider = new PolygonCollider(hillPoints);


  // car
  Tire = loadImage("Tire.png");
  Tire.resize(50, 50);

  Car = loadImage("Car.png");
  Car.resize(250, 115);
  health = 100;
  int WheelQuality = 15;
  PVector[] Wheel1Points = new PVector[WheelQuality];
  PVector[] Wheel2Points = new PVector[WheelQuality];
  for (int i=0; i<WheelQuality; i++) {
    Wheel1Points[i] = new PVector(25*cos(radians(360.0/WheelQuality * i)), 25 * sin(radians(360.0/WheelQuality * i)));
    Wheel2Points[i] = new PVector(25*cos(radians(360.0/WheelQuality * i)), 25 * sin(radians(360.0/WheelQuality * i)));
  }
  Wheel1 = new PhysicsBody(Wheel1Points, new PVector(width/2, -200), 0.075, 0.25);
  Wheel1.addCollisionObject(HillCollider);

  Wheel2 = new PolygonCollider(Wheel2Points);
  Wheel2Position =  new PVector(0, 0);
  moveWheel2To(0, -200);
}


void drawInstructionsScreen() {
  background(#69ABE3);
  
  textSize(35);
  textAlign(CENTER);
  fill(#987A2D);
  text("Welcome to Hill Climb Racing", width/2, 100);
  text("In this game you have to run as far as possible to", width/2, 100 + 40);
  text("reach the end of the hills while avoiding the lava", width/2, 100 + 80);
  
  text("Use to right and left arrow key to accelerate your", width/2, 100 + 160);
  text("car", width/2, 100 +200);

  // go back button
  stroke(#38C616);
  strokeWeight(5);
  fill(#987A2D);
  rect(width/2 -100, height - 75, 200, 50, 20);

  textSize(35);
  fill(#38C616);
  if (mouseX> width/2 - 200/2  &&  mouseX< width/2 + 200/2  && mouseY>(height -50 -2) - 50/2  && mouseY<(height -50 -2) + 50/2) {
    if (mousePressed) {
      setVariables();
      gameState = 1; // game -> menu
    }
    fill(#E0B310);
  }
  text("Go Back", width/2, height-75+40);
}


void drawLoseScreen() {
  push();
  // background
  scale(75/100.0);
  background(#69ABE3);
  PVector currentScroll = Scroll[(scrollIndex + 1)%Scroll.length];
  translate(currentScroll.x, currentScroll.y);
  
  
  drawTerain();
  drawCar();
  pop();
  
  // score
  textSize(50);
  textAlign(CENTER);
  fill(#987A2D);
  text("Score: "+round(score), width/2, 200);
  textSize(51);
  fill(#38C616);
  text("Score: "+round(score), width/2, 198);
  
  // you lose text
  textSize(70);
  textAlign(CENTER);
  fill(#987A2D);
  text("You Lose", width/2, 100);
  textSize(71);
  fill(#38C616);
  text("You Lose", width/2, 98);

  // go back button
  stroke(#38C616);
  strokeWeight(5);
  fill(#987A2D);
  rect(width/2 -100, height/2 - 25, 200, 50, 20);

  textSize(35);
  fill(#38C616);
  if (mouseX> width/2 - 200/2  &&  mouseX< width/2 + 200/2  && mouseY>(height/2 -2) - 50/2  && mouseY<(height/2 -2) + 50/2) {
    if (mousePressed) {
      setVariables();
      gameState = 1; // game -> menu
    }
    fill(#E0B310);
  }
  text("Go Back", width/2, height/2+15);
}


void drawWinScreen() {
  push();
  // background
  scale(75/100.0);
  background(#69ABE3);
  PVector currentScroll = Scroll[(scrollIndex + 1)%Scroll.length];
  translate(currentScroll.x, currentScroll.y);
  
  
  drawTerain();
  drawCar();
  pop();
  
  // score
  textSize(50);
  textAlign(CENTER);
  fill(#987A2D);
  text("Score: "+round(score), width/2, 200);
  textSize(51);
  fill(#38C616);
  text("Score: "+round(score), width/2, 198);
  
  // you win text
  textSize(70);
  textAlign(CENTER);
  fill(#987A2D);
  text("You Win", width/2, 100);
  textSize(71);
  fill(#38C616);
  text("You Win", width/2, 98);

  // go back button
  stroke(#38C616);
  strokeWeight(5);
  fill(#987A2D);
  rect(width/2 -100, height/2 - 25, 200, 50, 20);

  textSize(35);
  fill(#38C616);
  if (mouseX> width/2 - 200/2  &&  mouseX< width/2 + 200/2  && mouseY>(height/2 -2) - 50/2  && mouseY<(height/2 -2) + 50/2) {
    if (mousePressed) {
      setVariables();
      gameState = 1; // game -> menu
    }
    fill(#E0B310);
  }
  text("Go Back", width/2, height/2+15);
}


void drawMenu() {
  // background
  background(#69ABE3);
  drawTerain();

  // title
  textSize(70);
  textAlign(CENTER);
  fill(#987A2D);
  text("Hill Climb Racing", width/2, 100);
  textSize(71);
  fill(#38C616);
  text("Hill Climb Racing", width/2, 98);

  // play button
  stroke(#38C616);
  strokeWeight(5);
  fill(#987A2D);
  rect(width/2 -100, height - 150 - 25, 200, 50, 20);

  textSize(40);
  fill(#38C616);
  if (mouseX> width/2 - 200/2  &&  mouseX< width/2 + 200/2  && mouseY>(height -150 -2) - 50/2  && mouseY<(height -150 -2) + 50/2) {
    if (mousePressed) {
      setVariables();
      gameState = 0; // menu -> game
    }
    fill(#E0B310);
  }
  text("PLAY", width/2, height-150+15);


  // instructions button
  stroke(#38C616);
  strokeWeight(5);
  fill(#987A2D);
  rect(width/2 -100, height - 75 - 25, 200, 50, 20);

  textSize(25);
  fill(#38C616);
  if (mouseX> width/2 - 200/2  &&  mouseX< width/2 + 200/2  && mouseY>(height -75 -2) - 50/2  && mouseY<(height -75 -2) + 50/2) {
    if (mousePressed) {
      gameState = 4; // menu -> game
    }
    fill(#E0B310);
  }
  text("INSTRUCTIONS", width/2, height-75+10);
}


void drawGame() {
  // smooth scrolling
  scale(75/100.0);
  background(#69ABE3);
  PVector currentScroll = Scroll[(scrollIndex + 1)%Scroll.length];
  translate(currentScroll.x, currentScroll.y);

  drawTerain();
  moveCar();
  score = -currentScroll.x/20;
  checkCarHitLava();
  drawCar();

  // smooth scrolling
  Scroll[scrollIndex] = new PVector(-Wheel1.Position.x+400, -Wheel1.Position.y + 300);
  scrollIndex = (scrollIndex + 1)%Scroll.length;
  
  translate(-currentScroll.x, -currentScroll.y);
  displayGameUI();
  
  if (score>=1900){ // win condition
    gameState = 2; // game -> win screen
  }
}

void drawTerain() {

  // draw hills
  push();
  fill(#987A2D);
  stroke(#5ADB3E);
  strokeWeight(10);
  HillCollider.draw();
  pop();

  // draw lava
  strokeWeight(0);
  fill(#FF3300);
  rect(-3_000, lavaY, 44_000, 1000);
}


void checkCarHitLava() {
  if (Wheel1.Position.y + 25 > lavaY  ||  Wheel2Position.y + 25 > lavaY) { // car hit lava
    health=max(health-1.25, 0);
  }

  if (health<=0) {
    gameState=3;
  }
}


void displayGameUI() {

  // score
  textSize(50);
  textAlign(LEFT);
  fill(#987A2D);
  text("Score: "+round(score), width/4, 100);
  textSize(51);
  fill(#38C616);
  text("Score: "+round(score), width/4, 98);

  // health bar text

  fill(#987A2D);
  textAlign(CENTER);
  text("Health", 700, 70);
  textSize(51);
  fill(#38C616);
  text("Health", 700, 68);

  // health bar
  fill(#EE0000);
  stroke(#000000);
  strokeWeight(2.5);
  rect(700 - 200/2, 105, 200, 30);
  fill(#00EE00);
  rect(700 - 200/2, 105, map(health, 0, 100, 0, 200), 30);
}

void drawCar() {
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


void moveCar() {
  Wheel1.update();

  // wheel 2 update

  moveWheel2To(Wheel1.Position.x + 120, Wheel1.Position.y);

  int numCollisions = 0;
  int distance = 195;
  PVector prevPos = Wheel2Position.copy();
  for (int i=-90; i<0; i+=5) {
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
  PVector SmoothedPos = prevPos.add(Wheel2Position.copy()).mult(0.5);
  moveWheel2To(SmoothedPos.x, SmoothedPos.y);
}


void moveWheel2To(float xPos, float yPos) {
  Wheel2.move(-Wheel2Position.x, -Wheel2Position.y);
  Wheel2Position = new PVector(xPos, yPos);
  Wheel2.move(xPos, yPos);
}


class PolygonCollider {
  float[][] lines; // lines[line#][ 0 = slope, 1 = y-intercept ]
  PVector[] Points;

  PolygonCollider(PVector[] Points) {
    this.Points = Points;
    
    // generate lines
    lines = new float[Points.length][2];
    for (int i = 0; i<Points.length; i++) {
      PVector p1 = Points[i];
      PVector p2 = Points[(i+1)%Points.length];

      lines[i][0] = (p2.y - p1.y)/(p2.x - p1.x);
      lines[i][1] = p1.y - lines[i][0]*p1.x;
    }
  }

  boolean checkCollision(PVector collisionPoint) {
    // checks if PVector collisionPoint is inside me
    int numOfIntersections = 0;
    for (int i = 0; i<lines.length; i++) {
      PVector p1 = Points[i];
      PVector p2 = Points[(i+1)%Points.length];
      PVector intersect = new PVector((lines[i][1] - collisionPoint.y)/(0 - lines[i][0]), collisionPoint.y);

      if (intersect.x > min(p1.x, p2.x) && intersect.x < max(p1.x, p2.x) && collisionPoint.x < intersect.x) {
        numOfIntersections++;
      }
    }

    if (numOfIntersections%2 == 0) {
      return false;
    } else {
      return true;
    }
  }

  boolean checkCollision(PolygonCollider collisionPolygon) {
    // checks if PolygonCollider collisionPolygon is inside me
    if (findCollisionVerticies(collisionPolygon).length == 0) {
      return false;
    } else {
      return true;
    }
  }

  int[] findCollisionVerticies(PolygonCollider collisionPolygon) {
    // returns all vertex indexes of all of my vertexes that intersect with PolygonCollider collisionPolygon
    int[] Verticies = {};
    for (int i=0; i<Points.length; i++) {
      if (collisionPolygon.checkCollision(Points[i])) {
        Verticies = append(Verticies, i);
      }
    }
    return Verticies;
  }

  void move(float xShift, float yShift) {
    // moves all of my points and recalculates lines
    for (int i = 0; i<Points.length; i++) {
      Points[i].add(xShift, yShift);

      PVector p1 = Points[i];
      PVector p2 = Points[(i+1)%Points.length];

      lines[i][0] = (p2.y - p1.y)/(p2.x - p1.x);
      lines[i][1] = p1.y - lines[i][0]*p1.x;
    }
  }

  void draw() {
    // draws polygon (for debuging only)
    beginShape();
    for (int i = 0; i<Points.length; i++) {
      vertex(Points[i].x, Points[i].y);
    }
    endShape(CLOSE);
  }
}


class PhysicsBody {
  PolygonCollider Collider;
  PVector Position;
  PVector Velocity = new PVector(0, 0);
  PVector Gravity = new PVector(0, 1);
  int numColliderObjects = 0;
  PolygonCollider[] CollisionObjects = new PolygonCollider[20];
  float fluidResistance;
  float elasticity;

  PhysicsBody(PVector[] Points, PVector Position, float fluidResistance, float elasticity ) {
    Collider = new PolygonCollider(Points);
    this.Position = Position.copy();
    Collider.move(Position.x, Position.y);
    this.fluidResistance = fluidResistance;
    this.elasticity = elasticity;
  }

  void addCollisionObject(PolygonCollider ColliderObject) {
    CollisionObjects[numColliderObjects] = ColliderObject;
    numColliderObjects++;
  }

  void move(PVector Shift) {
    Collider.move(Shift.x, Shift.y);
    Position.add(Shift.x, Shift.y);
  }

  void update() {
    PVector Repel = CollideWithCollisionObjects();
    Velocity.add(Repel.copy());
    Velocity.add(Gravity);
    Velocity.mult(1 - fluidResistance);
    Velocity.y = min(max(Velocity.y, -50), 50);
    move(Velocity);
    //println(Velocity.x, Velocity.y);
  }

  PVector CollideWithCollisionObjects() {
    PVector Repel = new PVector(0, 0);
    for (int i = 0; i<CollisionObjects.length; i++) {
      if (CollisionObjects[i] == null) {
        break;
      }

      if (Collider.checkCollision(CollisionObjects[i])) {
        int[] vertexIndex = Collider.findCollisionVerticies(CollisionObjects[i]);
        PVector RepelForce = new PVector();
        for (int j=0; j< vertexIndex.length; j++) {
          RepelForce.add(CollisionObjects[i].Points[j].copy().sub(Position));
          //line(Collider.Points[vertexIndex[i]].x, Collider.Points[vertexIndex[i]].y, Position.x, Position.y);
        }
        Repel.add(RepelForce);
      }
    }
    if (Repel.mag() == 0) {
      return Repel;
    }

    //Repel.x *= -1;
    Repel = Repel.rotate(90);
    Repel = Repel.setMag(Velocity.mag() * elasticity).sub(Gravity);
    return Repel;
  }
}


void keyPressed() {
  println(keyCode);
  switch(keyCode) {
  case 97:
    frameRate(60);
    break;
  case 98:
    frameRate(60*10);
    break;
  case 99:
    frameRate(5);
    break;
  case 39: // right arrow (purposefuly here)
    if (Wheel1.Collider.checkCollision(HillCollider)  ||  Wheel2.checkCollision(HillCollider)  && gameState==0) {
      Wheel1.Velocity.x += 4;
    }
    break;
  case 37: // left arrow  (purposefuly here)
    if (Wheel1.Collider.checkCollision(HillCollider)  ||  Wheel2.checkCollision(HillCollider)  && gameState==0) {
      Wheel1.Velocity.x -= 4;
    }
    break;
  }
}
