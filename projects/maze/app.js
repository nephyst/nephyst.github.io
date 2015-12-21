window.onload = function() {
  var canvas = document.getElementById("canvas"),
    canvas2 = document.getElementById("canvas2"),
    c = canvas.getContext("2d"),
    c2 = canvas.getContext("2d"),
    width = canvas.width = canvas2.width = window.innerWidth / 2,
    height = canvas.height = canvas2.height = window.innerHeight,
    roomSize = 29,
    maze = Maze.create(Math.floor((width - roomSize) / roomSize), Math.floor((height - roomSize) / roomSize), 2),
    camera = new Engine.Camera(),
    device = new Engine.Device(canvas2);

  camera.Position = new BABYLON.Vector3(0, 0, 0);
  camera.Target = new BABYLON.Vector3(0, 0, 0);

  var floor = 1;

  update();

  function update() {
    c.fillStyle = "#000";
    c.fillRect(0, 0, width, height);
    maze.draw(c, roomSize / 2, roomSize / 2, roomSize);

    var player = maze.getPlayer();
    camera.Target = new BABYLON.Vector3(player.x, floor, -player.y);
    camera.Position = BABYLON.Vector3.Copy(camera.Target);
    switch (maze.playerFacing) {
      case maze.direction.north:
        camera.Position.z -= 0.6;
        break;
      case maze.direction.south:
        camera.Position.z += 0.6;
        break;
      case maze.direction.east:
        camera.Position.x -= 0.6;
        break;
      case maze.direction.west:
        camera.Position.x += 0.6;
        break;
    }

    device.clear();
    var meshes = maze.getMeshes();
    device.render(camera, meshes);
    device.present();

    //    requestAnimationFrame(update);
  }

  document.body.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
      case 37: //left
        switch (maze.playerFacing) {
          case maze.direction.north:
            maze.playerFacing = maze.direction.west;
            break;
          case maze.direction.south:
            maze.playerFacing = maze.direction.east;
            break;
          case maze.direction.east:
            maze.playerFacing = maze.direction.north;
            break;
          case maze.direction.west:
            maze.playerFacing = maze.direction.south;
            break;
        }
        break;
      case 38: //up
        maze.move(maze.playerFacing);
        break;
      case 39: //right
        switch (maze.playerFacing) {
          case maze.direction.north:
            maze.playerFacing = maze.direction.east;
            break;
          case maze.direction.south:
            maze.playerFacing = maze.direction.west;
            break;
          case maze.direction.east:
            maze.playerFacing = maze.direction.south;
            break;
          case maze.direction.west:
            maze.playerFacing = maze.direction.north;
            break;
        }
        break;
      case 40: //down
        switch (maze.playerFacing) {
          case maze.direction.north:
            maze.move(maze.direction.south);
            break;
          case maze.direction.south:
            maze.move(maze.direction.north);
            break;
          case maze.direction.east:
            maze.move(maze.direction.west);
            break;
          case maze.direction.west:
            maze.move(maze.direction.east);
            break;
        }
        break;
      default:
        break;
    };
    requestAnimationFrame(update);
  });

};
