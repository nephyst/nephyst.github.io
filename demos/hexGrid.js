window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

  c.strokeStyle = '#ffffff';

  var radius = 12;
  var xOffset = Math.sqrt(3) * radius;
  var yOffset = radius * 1.5;
  for (var i = 0; i < 1 + height / yOffset; i++) { //rows
    for (var j = 0; j < 1 + width / xOffset; j++) { //columns
      var x = j * xOffset;
      var y = i * yOffset;
      c.fillStyle = randomColor();
      polygon(c, 6, x + (i % 2) * (xOffset / 2), y, radius);
      c.fill();
    }
  }
  c.fill();
  c.stroke();

};
