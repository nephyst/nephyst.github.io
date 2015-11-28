window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

  var centerX = width / 2;
  var centerY = height / 2;
  var baseRadius = 100;
  var offset = 50;
  var speed = 0.1;
  var angle = 0;

  render();

  function render() {
    c.clearRect(0, 0, width, height);

    var radius = baseRadius + Math.sin(angle) * offset;

    c.beginPath();
    c.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
    c.fill();

    angle += speed;

    requestAnimationFrame(render);
  }
};
