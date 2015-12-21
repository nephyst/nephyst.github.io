var Room = {
  x: null,
  y: null,
  floor: null,
  eastWall: null,
  southWall: null,
  up: null,
  down: null,
  visited: null,

  create: function(x, y, floor) {
    var obj = Object.create(this);
    obj.reset(x, y, floor);
    return obj;
  },
  reset: function(x, y, floor) {
    this.eastWall = true;
    this.southWall = true;
    this.up = false;
    this.down = false;
    this.visited = false;
    this.x = x;
    this.y = y;
    this.floor = floor;
  },
  getMesh(isCurrent, facing) {
    var mesh = {};
    mesh.uvCount = -1;
    mesh.name = "room" + this.floor + this.x + this.y;
    mesh.Vertices = [];
    mesh.Faces = [];
    mesh.Position = new BABYLON.Vector3(this.x, this.floor, -this.y);
    mesh.Rotation = new BABYLON.Vector3(0, 0, 0);

    mesh.Vertices = this.Vertices;
    mesh.Vertices = this.Vertices;
    mesh.Faces.push(this.Floor0);
    mesh.Faces.push(this.Floor1);
    mesh.Faces.push(this.Ceil0);
    mesh.Faces.push(this.Ceil1);

    //south
    if (this.southWall && !(isCurrent && facing == Maze.direction.north)) {
      mesh.Faces.push(this.SouthWall0);
      mesh.Faces.push(this.SouthWall1);
    }
    if (this.eastWall && !(isCurrent && facing == Maze.direction.west)) {
      mesh.Faces.push(this.EastWall0);
      mesh.Faces.push(this.EastWall1);
    }
    if (this.x == 0 && !(isCurrent && facing == Maze.direction.east)) {
      mesh.Faces.push(this.WestWall0);
      mesh.Faces.push(this.WestWall1);
    }
    if (this.y == 0 && !(isCurrent && facing == Maze.direction.south)) {
      mesh.Faces.push(this.NorthWall0);
      mesh.Faces.push(this.NorthWall1);
    }
    return mesh;
  },
  //static definitions
  Vertices: Object.freeze([
    new BABYLON.Vector3(-0.5, -0.5, 0.5), //0:lft
    new BABYLON.Vector3(-0.5, -0.5, -0.5), //1:lfb
    new BABYLON.Vector3(0.5, -0.5, 0.5), //2:rft
    new BABYLON.Vector3(0.5, -0.5, -0.5), //3:rfb
    new BABYLON.Vector3(-0.5, 0.5, 0.5), //4:lct
    new BABYLON.Vector3(-0.5, 0.5, -0.5), //5:lcb
    new BABYLON.Vector3(0.5, 0.5, 0.5), //6:rct
    new BABYLON.Vector3(0.5, 0.5, -0.5) //7:rcb
  ]),
  Floor0: Object.freeze({
    A: 0,
    B: 1,
    C: 2
  }),
  Floor1: Object.freeze({
    A: 1,
    B: 2,
    C: 3
  }),
  Ceil0: Object.freeze({
    A: 4,
    B: 5,
    C: 6
  }),
  Ceil1: Object.freeze({
    A: 5,
    B: 6,
    C: 7
  }),
  SouthWall0: Object.freeze({
    A: 1,
    B: 3,
    C: 5
  }),
  SouthWall1: Object.freeze({
    A: 3,
    B: 5,
    C: 7
  }),
  EastWall0: Object.freeze({
    A: 2,
    B: 3,
    C: 6
  }),
  EastWall1: Object.freeze({
    A: 3,
    B: 6,
    C: 7
  }),
  NorthWall0: Object.freeze({
    A: 0,
    B: 2,
    C: 4
  }),
  NorthWall1: Object.freeze({
    A: 2,
    B: 4,
    C: 6
  }),
  WestWall0: Object.freeze({
    A: 0,
    B: 1,
    C: 4
  }),
  WestWall1: Object.freeze({
    A: 1,
    B: 4,
    C: 5
  })

}
