window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

  c.strokeStyle = '#ffffff';

  var radius = 12;
  var xOffset = Math.sqrt(3) * radius;
  var yOffset = radius * 1.5;
  var row = 0;
  for (var y = 0; y < height + radius; y += yOffset, row++) {
    for (var x = 0; x < width + radius; x += xOffset) {
      c.fillStyle = randomColor();
      polygon(c, 6, x + (row % 2) * (xOffset / 2), y, radius);
      console.log(x, y);
    }
  }
  c.fill();
  c.stroke();

};
