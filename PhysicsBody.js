class PhysicsBody {
  constructor(Points, Position, fluidResistance, elasticity) {
    this.Collider = new PolygonCollider(Points.slice());
    this.Position = Position.copy();
    this.Collider.move(Position.x, Position.y);
    this.fluidResistance = fluidResistance;
    this.elasticity = elasticity;
    this.velocity = createVector(0, 0);
    this.gravity = createVector(0, 1); // approximation
    this.CollisionObjects = []
  }

  addCollisionObject(otherPhysicsCollider) {
    this.CollisionObjects.push(otherPhysicsCollider);
  }

  move(Shift) {
    this.Collider.move(Shift.x, Shift.y);
    this.Position.add(Shift.x, Shift.y);
  }

  update() {
    let Repel = this.CollideWithCollisionObjects();
    this.velocity.add(Repel.copy());
    this.velocity.add(this.gravity);
    this.velocity.mult(1 - this.fluidResistance);
    this.velocity.y = Math.min(Math.max(this.velocity.y, -50), 50);
    this.move(this.velocity);
    //println(velocity.x, velocity.y);
  }

  CollideWithCollisionObjects() {
    let Repel = createVector();
    for (let i = 0; i<this.CollisionObjects.length; i++) {
      if (this.Collider.checkCollision(this.CollisionObjects[i])) {
        let vertexIndexes = this.Collider.findCollisionVerticies(this.CollisionObjects[i]);
        let RepelForce = createVector(0, 0);
        for (let j=0; j< vertexIndexes.length; j++) {
          RepelForce.add(this.CollisionObjects[i].Points[j].copy().sub(this.Position));
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
    Repel = Repel.setMag(this.velocity.mag() * this.elasticity).sub(this.gravity);
    return Repel;
  }
}