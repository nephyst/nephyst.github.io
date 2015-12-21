var Maze = {
  grid: null,
  direction: Object.freeze({
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
  playerFacing: null,
  entrance: {
    x: null,
    y: null
  },
  exit: {
    x: null,
    y: null
  },
  meshes: null,

  create: function(width, height, floors) {
    var obj = Object.create(this);
    obj.grid = new Array(width);
    for (var i = 0; i < obj.grid.length; i++) {
      obj.grid[i] = new Array(height);
      for (var j = 0; j < obj.grid[i].length; j++) {
        obj.grid[i][j] = Room.create(i, j, 1);
      }
    }
    obj.player.x = 0;
    obj.player.y = 0;
    obj.exit.x = width - 1;
    obj.exit.y = height - 1;
    obj.build(0, 0);
    obj.playerFacing = obj.grid[0][0].southWall ? this.direction.east : this.direction.south;
    return obj;
  },

  draw: function(c, x, y, roomSize) {
    c.strokeStyle = "#666";
    c.lineWidth = roomSize / 4;
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
        if (this.hasWall(i, j, this.direction.east)) {
          c.beginPath();
          c.moveTo(right, top);
          c.lineTo(right, bottom);
          c.stroke();
        }
        if (this.hasWall(i, j, this.direction.south)) {
          c.beginPath();
          c.moveTo(left, bottom);
          c.lineTo(right, bottom);
          c.stroke();
        }
      }
    }
    c.beginPath();
    c.fillStyle = "#00F";
    c.font = "15px Arial Bold";
    c.textAlign = "center";
    c.textBaseline = "middle";
    switch (this.playerFacing) {
      case "east":
        var icon = String.fromCharCode(parseInt('25BA', 16));
        break;
      case "south":
        var icon = String.fromCharCode(parseInt('25BC', 16));
        break;
      case "north":
        var icon = String.fromCharCode(parseInt('25B2', 16));
        break;
      case "west":
        var icon = String.fromCharCode(parseInt('25C4', 16));
        break;
    }
    c.fillText(icon,
      x + (this.player.x + 0.5) * roomSize,
      y + (this.player.y + 0.5) * roomSize);
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
      case this.direction.north:
        var room = this.grid[x][y - 1];
        return room ? room.southWall : true;
      case this.direction.south:
        var room = this.grid[x][y];
        return room ? room.southWall : true;
      case this.direction.east:
        var room = this.grid[x][y];
        return room ? room.eastWall : true;
      case this.direction.west:
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
        room.reset(i, j, 1);
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
      this.direction.north,
      this.direction.south,
      this.direction.east,
      this.direction.west
    ];
    rooms.shuffle();

    for (var i = 0; i < rooms.length; i++) {
      var direction = rooms[i];
      switch (direction) {
        case this.direction.north:
          var nextRoom = (y > 0) ? this.grid[x][y - 1] : null;
          if (nextRoom && !nextRoom.visited) {
            nextRoom.southWall = false;
            this.build(x, y - 1);
          }
          break;
        case this.direction.south:
          var nextRoom = (y < this.grid[0].length - 1) ? this.grid[x][y + 1] : null;
          if (nextRoom && !nextRoom.visited) {
            room.southWall = false;
            this.build(x, y + 1);
          }
          break;
        case this.direction.east:
          var nextRoom = (x < this.grid.length - 1) ? this.grid[x + 1][y] : null;
          if (nextRoom && !nextRoom.visited) {
            room.eastWall = false;
            this.build(x + 1, y);
          }
          break;
        case this.direction.west:
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
      case this.direction.north:
        var room = (y > 0) ? this.grid[x][y - 1] : null;
        if (room && !room.southWall) {
          --this.player.y;
        }
        break;
      case this.direction.south:
        var room = this.grid[x][y];
        if (room && !room.southWall) {
          ++this.player.y;
        }
        break;
      case this.direction.east:
        var room = this.grid[x][y];
        if (room && !room.eastWall) {
          ++this.player.x;
        }
        break;
      case this.direction.west:
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
  },
  getMeshes: function() {
    var viewDistance = 10;
    var meshes = [];
    var xMin = this.player.x - viewDistance;
    var xMax = this.player.x + viewDistance;
    var yMin = this.player.y - viewDistance;
    var yMax = this.player.y + viewDistance;
    switch (this.playerFacing) {
      case this.direction.north:
        yMax -= viewDistance;
        break;
      case this.direction.south:
        yMin += viewDistance;
        break;
      case this.direction.east:
        xMin += viewDistance;
        break;
      case this.direction.west:
        xMax -= viewDistance;
        break;
    }
    xMin = Math.max(xMin, 0);
    xMax = Math.min(xMax, this.grid.length - 1);
    yMin = Math.max(yMin, 0);
    yMax = Math.min(yMax, this.grid[0].length - 1);
    for (var x = xMin; x <= xMax; x++) {
      for (var y = yMin; y <= yMax; y++) {
        var room = this.grid[x][y];
        meshes.push(room.getMesh(x == this.player.x && y == this.player.y, this.playerFacing));
      }
    }
    return meshes;
  },

  getPlayer: function() {
    return {
      x: this.player.x,
      y: this.player.y
    };
  }

}
