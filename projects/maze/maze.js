var Maze = {
  grid: null,
  directionEnum: Object.freeze({
    north: "north",
    south: "south",
    east: "east",
    west: "west"
  }),

  create: function(width, height) {
    var obj = Object.create(this);
    obj.grid = new Array(width);
    for (var i = 0; i < obj.grid.length; i++) {
      obj.grid[i] = new Array(height);
      for (var j = 0; j < obj.grid[i].length; j++) {
        obj.grid[i][j] = Room.create();
      }
    }
    return obj;
  },

  draw: function(c, x, y, roomSize) {
    c.strokeStyle = "#aaa";
    c.lineWidth = 3;
    c.lineCap = "round";
    for (var i = 0; i < this.grid.length; i++) {
      var left = x + (i * roomSize);
      var right = x + ((i + 1) * roomSize);
      for (var j = 0; j < this.grid[i].length; j++) {
        var top = y + (j * roomSize);
        var bottom = y + ((j + 1) * roomSize);
        if (i == 0) { //draw west wall
          c.beginPath();
          c.moveTo(left, top);
          c.lineTo(left, bottom);
          c.stroke();
        }
        if (j == 0) { //draw north wall
          c.beginPath();
          c.moveTo(left, top);
          c.lineTo(right, top);
          c.stroke();
        }
        if (this.hasWall(i, j, this.directionEnum.east)) {
          c.beginPath();
          c.moveTo(right, top);
          c.lineTo(right, bottom);
          c.stroke();
        }
        if (this.hasWall(i, j, this.directionEnum.south)) {
          c.beginPath();
          c.moveTo(left, bottom);
          c.lineTo(right, bottom);
          c.stroke();
        }
      }
    }
  },

  hasWall(x, y, direction) {
    if (x < 0 || y < 0 || x >= this.grid.length || y > this.grid[0].length) {
      return true;
    }
    switch (direction) {
      case this.directionEnum.north:
        var room = this.grid[x][y - 1];
        return room ? room.southWall : true;
      case this.directionEnum.south:
        var room = this.grid[x][y];
        return room ? room.southWall : true;
      case this.directionEnum.east:
        var room = this.grid[x][y];
        return room ? room.eastWall : true;
      case this.directionEnum.west:
        var room = this.grid[x - 1][y];
        return room ? room.eastWall : true;
      default:
        return null;
    }
  },

  build(x, y) { //input starting cell
    console.log(x, y, this.grid);
    var room = this.grid[x] ? this.grid[x][y] : null;
    if (!room || room.visited) {
      return;
    }
    room.visited = true;

    var rooms = [
      this.directionEnum.north,
      this.directionEnum.south,
      this.directionEnum.east,
      this.directionEnum.west
    ];
    rooms.shuffle();

    for (var i = 0; i < rooms.length; i++) {
      var direction = rooms[i];
      switch (direction) {
        case this.directionEnum.north:
          var nextRoom = (y > 0) ? this.grid[x][y - 1] : null;
          if (nextRoom && !nextRoom.visited) {
            nextRoom.southWall = false;
            this.build(x, y - 1);
          }
          break;
        case this.directionEnum.south:
          var nextRoom = (y < this.grid[0].length - 1) ? this.grid[x][y + 1] : null;
          if (nextRoom && !nextRoom.visited) {
            room.southWall = false;
            this.build(x, y + 1);
          }
          break;
        case this.directionEnum.east:
          var nextRoom = (x < this.grid.length - 1) ? this.grid[x + 1][y] : null;
          if (nextRoom && !nextRoom.visited) {
            room.eastWall = false;
            this.build(x + 1, y);
          }
          break;
        case this.directionEnum.west:
          var nextRoom = (x > 0) ? this.grid[x - 1][y] : null;
          if (nextRoom && !nextRoom.visited) {
            nextRoom.eastWall = false;
            this.build(x - 1, y);
          }
          break;
        default:
          break;
      }
    }
  }

}
