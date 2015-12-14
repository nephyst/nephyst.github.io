var Maze = {
  grid: null,
  directionEnum: Object.freeze({
    north: "north",
    south: "south",
    east: "east",
    west: "west",
    up: "up",
    down: "down",
  }),
  player: {
    x: null,
    y: null
  },
  entrance: {
    x: null,
    y: null
  },
  exit: {
    x: null,
    y: null
  },

  create: function(width, height, floors) {
    var obj = Object.create(this);
    obj.grid = new Array(width);
    for (var i = 0; i < obj.grid.length; i++) {
      obj.grid[i] = new Array(height);
      for (var j = 0; j < obj.grid[i].length; j++) {
        obj.grid[i][j] = Room.create();
      }
    }
    obj.player.x = 0;
    obj.player.y = 0;
    obj.exit.x = width - 1;
    obj.exit.y = height - 1;
    obj.build(0, 0);
    return obj;
  },

  draw: function(c, x, y, roomSize) {
    c.strokeStyle = "#555";
    c.lineWidth = 18;
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
    c.beginPath();
    c.fillStyle = "#00F";
    c.arc(x + (this.player.x + 0.5) * roomSize, y + (this.player.y + 0.5) * roomSize, roomSize / 4, 0, Math.PI * 2, false);
    c.fill();
    c.beginPath();
    c.fillStyle = "#F00";
    c.arc(x + (this.exit.x + 0.5) * roomSize, y + (this.exit.y + 0.5) * roomSize, roomSize / 4, 0, Math.PI * 2, false);
    c.fill();
  },

  hasWall: function(x, y, direction) {
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

  reset: function() {
    for (var i = 0; i < this.grid.length; i++) {
      for (var j = 0; j < this.grid[i].length; j++) {
        var room = this.grid[i][j];
        room.reset();
      }
    }
  },

  build: function(x, y) { //input starting cell
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
  },

  move: function(direction) {
    var x = this.player.x;
    var y = this.player.y;
    switch (direction) {
      case this.directionEnum.north:
        var room = (y > 0) ? this.grid[x][y - 1] : null;
        if (room && !room.southWall) {
          --this.player.y;
        }
        break;
      case this.directionEnum.south:
        var room = this.grid[x][y];
        if (room && !room.southWall) {
          ++this.player.y;
        }
        break;
      case this.directionEnum.east:
        var room = this.grid[x][y];
        if (room && !room.eastWall) {
          ++this.player.x;
        }
        break;
      case this.directionEnum.west:
        var room = (x > 0) ? this.grid[x - 1][y] : null;
        if (room && !room.eastWall) {
          --this.player.x;
        }
        break;
      default:
        break;
    }
    if (this.player.x == this.exit.x && this.player.y == this.exit.y) {
      this.reset();
      this.build(0, 0);
      this.player.x = 0;
      this.player.y = 0;
    }
  }

}
