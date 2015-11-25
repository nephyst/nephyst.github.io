window.onload = function() {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    scale = 200;

  context.fillRect(0, 0, width, height);
  context.translate(0, height / 2);
  context.scale(1, -1);

  context.lineWidth = 3;
  context.strokeStyle = '#999999';
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(400 * Math.PI, 0);
  context.stroke();

  for (var angle = 0; angle < 2 * Math.PI; angle += 0.0005) {
    var x = scale * angle,
      y = scale * Math.sin(angle);
    context.fillStyle = '#ff0000';
    context.fillRect(x, y, 5, 5);

    y = scale * Math.asin(angle);
    context.fillStyle = '#770000';
    context.fillRect(x, y, 5, 5);
    console.log(angle + ' ' + y);

    y = scale * Math.cos(angle);
    context.fillStyle = '#00ff00';
    context.fillRect(x, y, 5, 5);

    y = scale * Math.acos(angle);
    context.fillStyle = '#007700';
    context.fillRect(x, y, 5, 5);

    y = scale * Math.tan(angle);
    context.fillStyle = '#0000ff';
    context.fillRect(x, y, 5, 5);

    y = scale * Math.atan(angle);
    context.fillStyle = '#000077';
    context.fillRect(x, y, 5, 5);
  }
};
