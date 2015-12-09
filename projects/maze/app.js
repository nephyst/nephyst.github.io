window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    roomSize = 20,
    maze = Maze.create(Math.floor((width - roomSize) / roomSize), Math.floor((height - roomSize) / roomSize));

  update();

  function update() {
    c.fillStyle = "#000";
    c.fillRect(0, 0, width, height);
    maze.draw(c, roomSize / 2, roomSize / 2, roomSize);
    requestAnimationFrame(update);
  }

  document.body.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
      case 37: //left
        maze.move(maze.directionEnum.west);
        break;
      case 38: //up
        maze.move(maze.directionEnum.north);
        break;
      case 39: //right
        maze.move(maze.directionEnum.east);
        break;
      case 40: //down
        maze.move(maze.directionEnum.south);
        break;
      default:
        console.log(event.keyCode);
        break;
    }
  });

};
