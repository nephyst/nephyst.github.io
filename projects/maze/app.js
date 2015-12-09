window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    roomSize = 25,
    maze = Maze.create(Math.floor((width - roomSize) / roomSize), Math.floor((height - roomSize) / roomSize));

  c.fillStyle = "#000";
  c.fillRect(0, 0, width, height);
  maze.build(0,0);
  maze.draw(c, roomSize / 2, roomSize / 2, roomSize);
  //update();

  function update() {
    c.clearRect(0, 0, width, height);


    requestAnimationFrame(update);
  }

};
