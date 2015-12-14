var Room = {
  eastWall: null,
  southWall: null,
  up: null,
  down: null,
  visited: null,

  create: function() {
    var obj = Object.create(this);
    obj.reset();
    return obj;
  },
  reset: function() {
    this.eastWall = true;
    this.southWall = true;
    this.up = false;
    this.down = false;
    this.visited = false;
  }
}
