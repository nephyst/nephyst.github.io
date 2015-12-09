var Particle = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  mass: 1,
  friction: 1,
  color: null,
  radius: null,

  create: function(x, y, speed, direction) {
    var obj = Object.create(this);
    obj.x = x;
    obj.y = y;
    obj.vx = Math.cos(direction) * speed;
    obj.vy = Math.sin(direction) * speed;
    return obj;
  },
  clone: function() {
    var obj = Object.create(this);
    obj.x = this.x;
    obj.y = this.y;
    obj.vx = this.vx;
    obj.vy = this.vy;
    obj.mass = this.mass;
    obj.friction = this.friction;
    obj.color = this.color;
    obj.radius = this.radius;
    return obj;
  },
  update: function() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx;
    this.y += this.vy;
  },
  accelerate: function(ax, ay) {
    this.vx += ax;
    this.vy += ay;
  },
  angleTo(p2) {
    var dx = p2.x - this.x;
    var dy = p2.y - this.y;
    return Math.atan2(dy, dx);
  },
  distanceTo(p2) {
    var dx = p2.x - this.x;
    var dy = p2.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  gravitateTo(p2) {
    var dx = p2.x - this.x,
      dy = p2.y - this.y,
      distSq = dx * dx + dy * dy,
      distance = Math.sqrt(distSq),
      angle = this.angleTo(p2),
      force = p2.mass / distSq,
      ax = dx / distance * force,
      ay = dy / distance * force;

    this.vx += ax;
    this.vy += ay;
  },
  springTo(x, y, k) {
    var dx = (x - this.x) * k;
    var dy = (y - this.y) * k;
    this.accelerate(dx, dy);
  }
}
