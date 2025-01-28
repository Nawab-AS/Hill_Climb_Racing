class PhysicsCollider {
  constructor(Points, Position, fluidResistance, elasticity) {
    Collider = new PolygonCollider(Points);
    this.Position = Position.copy();
    Collider.move(Position.x, Position.y);
    this.fluidResistance = fluidResistance;
    this.elasticity = elasticity;
    this.velocity = createVector(0, 0);
    this.velocity = createVector(0, 1); // approximation
    this.CollisionObjects = []
  }

  addCollisionObject(otherPhysicsCollider) {
    CollisionObjects.push(otherPhysicsCollider);
  }

  move(Shift) {
    Collider.move(Shift.x, Shift.y);
    Position.add(Shift.x, Shift.y);
  }

  update() {
    let Repel = CollideWithCollisionObjects();
    Velocity.add(Repel.copy());
    Velocity.add(Gravity);
    Velocity.mult(1 - fluidResistance);
    Velocity.y = min(max(Velocity.y, -50), 50);
    move(Velocity);
    //println(Velocity.x, Velocity.y);
  }

  CollideWithCollisionObjects() {
    let Repel = new PVector(0, 0);
    for (let i = 0; i<CollisionObjects.length; i++) {
      if (Collider.checkCollision(CollisionObjects[i])) {
        let vertexIndexes = Collider.findCollisionVerticies(CollisionObjects[i]);
        let RepelForce = createVector(0, 0);
        for (let j=0; j< vertexIndexes.length; j++) {
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