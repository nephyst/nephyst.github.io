var Room = {
  eastWall: null,
  southWall: null,
  visited: null,

  create: function() {
    var obj = Object.create(this);
    obj.eastWall = true;
    obj.southWall = true;
    obj.visited = false;
    return obj;
  },
  reset: function() {
    this.eastWall = true;
    this.southWall = true;
    this.visited = false;
  }
}
