window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    scale = 200;

  c.fillRect(0, 0, width, height);
  c.translate(0, height / 2);
  c.scale(1, -1);

  c.lineWidth = 3;
  c.strokeStyle = '#999999';
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(400 * Math.PI, 0);
  c.stroke();

  for (var angle = 0; angle < 2 * Math.PI; angle += 0.0005) {
    var x = scale * angle,
      y = scale * Math.sin(angle);
    c.fillStyle = '#ff0000';
    c.fillRect(x, y, 5, 5);

    y = scale * Math.asin(angle);
    c.fillStyle = '#770000';
    c.fillRect(x, y, 5, 5);

    y = scale * Math.cos(angle);
    c.fillStyle = '#00ff00';
    c.fillRect(x, y, 5, 5);

    y = scale * Math.acos(angle);
    c.fillStyle = '#007700';
    c.fillRect(x, y, 5, 5);

    y = scale * Math.tan(angle);
    c.fillStyle = '#0000ff';
    c.fillRect(x, y, 5, 5);

    y = scale * Math.atan(angle);
    c.fillStyle = '#000077';
    c.fillRect(x, y, 5, 5);
  }
};
