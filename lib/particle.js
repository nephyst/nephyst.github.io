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
  angleTo: function(p2) {
    var dx = p2.x - this.x;
    var dy = p2.y - this.y;
    return Math.atan2(dy, dx);
  },
  distanceTo: function(p2) {
    var dx = p2.x - this.x;
    var dy = p2.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  getSpeed: function() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  },
  setSpeed: function(speed) {
    var heading = this.getHeading();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;

  },
  getHeading: function() {
    return Math.atan2(this.vy, this.vx);
  },
  setHeading: function(heading) {
    this.speed = getSpeed();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  },
  gravitateTo: function(p2) {
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
  springTo: function(x, y, k) {
    var dx = (x - this.x) * k;
    var dy = (y - this.y) * k;
    this.accelerate(dx, dy);
  }
}
