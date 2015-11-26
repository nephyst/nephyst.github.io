var Particle = {
  position: null,
  velocity: null,
  mass: 1,
  color: null,
  radius: null,

  create: function(x, y, speed, direction) {
    var obj = Object.create(this);
    obj.position = Vector.create(x, y);
    obj.velocity = Vector.create(0, 0);
    obj.velocity.setLength(speed);
    obj.velocity.setAngle(direction);
    return obj;
  },
  update: function() {
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
  }
}
