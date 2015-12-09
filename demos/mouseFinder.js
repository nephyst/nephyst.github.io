window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    arrowX = width / 2,
    arrowY = height / 2,
    dx = 0,
    dy = 0,
    angle = 0;

  render();

  function render() {
    c.clearRect(0, 0, width, height);

    c.save();
    arrowX += dx / 15;
    dx -= dx / 15;
    arrowY += dy / 15;
    dy -= dy / 15;
    c.translate(arrowX, arrowY);
    c.rotate(angle);

    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(-40, 0);
    c.moveTo(0, 0);
    c.lineTo(-10, -10);
    c.moveTo(0, 0);
    c.lineTo(-10, 10);
    c.stroke();

    c.restore();
    requestAnimationFrame(render);
  }

  document.body.addEventListener("mousemove", function(event) {
    dx = event.clientX - arrowX;
    dy = event.clientY - arrowY;
    angle = Math.atan2(dy, dx);
  });

};
