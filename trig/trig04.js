window.onload = function() {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    arrowX = width / 2,
    arrowY = height / 2,
    dx = 0,
    dy = 0,
    angle = 0;

  render();

  function render() {
    context.clearRect(0, 0, width, height);

    context.save();
    arrowX += dx / 15;
    dx -= dx / 15;
    arrowY += dy / 15;
    dy -= dy / 15;
    context.translate(arrowX, arrowY);
    context.rotate(angle);

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(-40, 0);
    context.moveTo(0, 0);
    context.lineTo(-10, -10);
    context.moveTo(0, 0);
    context.lineTo(-10, 10);
    context.stroke();

    context.restore();
    requestAnimationFrame(render);
  }

  document.body.addEventListener("mousemove", function(event) {
    dx = event.clientX - arrowX;
    dy = event.clientY - arrowY;
    angle = Math.atan2(dy, dx);
  });

};
