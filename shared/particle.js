var Particle = {
  position: null,
  velocity: null,
  mass: 1,
  friction: 1,
  color: null,
  radius: null,

  create: function(x, y, speed, direction) {
    var obj = Object.create(this);
    obj.position = Vector.create(x, y);
    obj.velocity = Vector.create(0, 0);
    return obj;
  },
  clone: function() {
    var obj = Object.create(this);
    obj.position = this.position.clone();
    obj.velocity = this.velocity.clone();
    obj.mass = this.mass;
    obj.friction = this.friction;
    obj.color = this.color;
    obj.radius = this.radius;
    return obj;
  },
  update: function() {
    this.velocity.multiplyBy(this.friction);
    this.position.addTo(this.velocity);
  },
  accelerate: function(accel) {
    this.velocity.addTo(accel);
  },
  angleTo(p2) {
    var dy = p2.position.getY() - this.position.getY();
    var dx = p2.position.getX() - this.position.getX();
    return Math.atan2(dy, dx);
  },
  distanceTo(p2) {
    var dy = p2.position.getY() - this.position.getY();
    var dx = p2.position.getX() - this.position.getX();
    return Math.sqrt(dx * dx + dy * dy);
  },
  gravitateTo(p2) {
    var gravity = Vector.create(0, 0);
    var distance = this.distanceTo(p2);
    gravity.setLength(p2.mass / (distance * distance));
    gravity.setAngle(this.angleTo(p2));
    this.accelerate(gravity);
  },
  springTo(spring, k) { //Vector, float
    var springForce = spring.subtract(this.position);
    springForce.multiplyBy(k);
    this.accelerate(springForce);
  }
}
