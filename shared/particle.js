var Particle = {
  position: null,
  velocity: null,

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
  }
}
