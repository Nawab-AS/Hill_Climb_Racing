class PolygonCollider {
  constructor(points) {
    this.Points = points;

    // generate lines
    this.lines = []; // lines[line#][ 0 = slope, 1 = y-intercept ]

    for (let i = 0; i < points.length; i++) {
      let p1 = points[i];
      let p2 = points[(i + 1) % points.length];

      this.lines.push( [[], []] );
      this.lines[i][0] = (p2.y - p1.y) / (p2.x - p1.x); // slope
      this.lines[i][1] = p1.y - this.lines[i][0] * p1.x; // y-intercept
    }
  }

  isPointInPolygon(collisionPoint){
    // Checks is collisionPoint is inside of polygonCollider using the point in polyon algorithm
    // Refrence: https://en.wikipedia.org/wiki/Point_in_polygon

    let intersect = createVector();
    let numOfIntersections = 0;
    for (let i = 0; i<this.lines.length; i++) {
      let p1 = this.Points[i];
      let p2 = this.Points[(i+1)%this.Points.length];
      intersect.set((this.lines[i][1] - collisionPoint.y)/(0 - this.lines[i][0]), collisionPoint.y);

      if (intersect.x > Math.min(p1.x, p2.x) && intersect.x < Math.max(p1.x, p2.x) &&
          collisionPoint.x < intersect.x) {
        numOfIntersections++;
      }
    }

    if (numOfIntersections%2 == 0) {
      return false;
    } else {
      return true;
    }
  }

  checkCollision(collisionPolygon) {
    // checks if collisionPolygon is inside me (collision)
    if (this.findCollisionVerticies(collisionPolygon).length == 0) {
      return false;
    } else {
      return true;
    }
  }

  findCollisionVerticies(collisionPolygon) {
    // returns all vertex indexes of all of my vertexes that intersect with PolygonCollider collisionPolygon
    let verticies = [];
    for (let i=0; i<this.Points.length; i++) {
      if (collisionPolygon.isPointInPolygon(this.Points[i])) {
        verticies.push(i);
      }
    }
    return verticies;
  }

  move(xShift, yShift) {
    // moves all of my points and recalculates lines

    // add points first
    for (let i = 0; i<this.Points.length; i++) {
      this.Points[i].add(xShift, yShift);
    }

    // then recalculate lines
    for (let i = 0; i<this.Points.length; i++) {
      let p1 = this.Points[i];
      let p2 = this.Points[(i+1)%this.Points.length];

      this.lines[i][0] = (p2.y - p1.y)/(p2.x - p1.x);
      this.lines[i][1] = p1.y - this.lines[i][0]*p1.x;
    }
  }

  draw() {
    // draws polygon (for debuging only)
    beginShape();
    for (let i = 0; i<this.Points.length; i++) {
      vertex(this.Points[i].x, this.Points[i].y);
    }
    endShape(CLOSE);
  }
}