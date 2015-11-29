window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    sun = Particle.create(75, height * 0.2, 0, 0),
    asteroid = Particle.create(75, height * 0.4, 0, 0),
    planet = Particle.create(75, height * 0.6, 0, 0),
    planet2 = Particle.create(75, height * 0.8, 0, 0),
    dragging = -1,
    offsetX = 0,
    offsetY = 0;

  var top = 10;
  var bottom = height - 10;
  var left = width / 2 - (height - 20) / 2;
  var right = width / 2 + (height - 20) / 2;
  var cellSize = (right - left) / 7;

  sun.color = "#FFFF00";
  sun.radius = cellSize / 2;
  asteroid.color = "#B87333";
  asteroid.radius = cellSize / 2;
  planet.color = "#00FF00";
  planet.radius = cellSize / 2;
  planet2.color = "#0000FF";
  planet2.radius = cellSize / 2;

  var objects = [sun, asteroid, planet, planet2];

  update();

  function update() {
    c.clearRect(0, 0, width, height);
    drawGrid();
    drawCircles();
    requestAnimationFrame(update);
  }

  function drawGrid() {
    for (var i = 0; i < 8; i++) {
      var x = map(i, 0, 7, left, right);
      c.beginPath();
      c.moveTo(x, top);
      c.lineTo(x, bottom);
      c.lineWidth = 3;
      c.stroke();
    }
    for (var i = 0; i < 8; i++) {
      var y = map(i, 0, 7, top, bottom);
      c.beginPath();
      c.moveTo(left, y);
      c.lineTo(right, y);
      c.lineWidth = 3;
      c.stroke();
    }
  }

  function drawCircles() {
    for (var i = 0; i < objects.length; i++) {
      var particle = objects[i];
      c.beginPath();
      c.arc(particle.position.getX(), particle.position.getY(), particle.radius, 0, Math.PI * 2, false);
      c.fillStyle = particle.color;
      c.fill();
      c.lineWidth = 3;
      c.stroke();
    }
  }

  function isInsideCircle(particle, x, y) {
    var px = particle.position.getX();
    var py = particle.position.getY();
    var dx = x - px;
    var dy = y - py
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance < particle.radius;
  }

  document.body.addEventListener("mousedown", function(event) {
    var x = event.clientX;
    var y = event.clientY;
    for (var i = objects.length - 1; i >= 0; i--) {
      if (isInsideCircle(objects[i], x, y)) {
        dragging = i;
        offsetX = objects[i].position.getX() - x;
        offsetY = objects[i].position.getY() - y;
        break;
      }
    }
  });
  document.body.addEventListener("mouseup", function(event) {
    var particle = objects[dragging];
    var x = particle.position.getX();
    var y = particle.position.getY();
    if (x > left && x < right && y > top && y < right) {
      x = (Math.floor((x - left) / cellSize) + 0.5) * cellSize + left;
      y = (Math.floor((y - top) / cellSize) + 0.5) * cellSize + top;
      particle.position.setX(x);
      particle.position.setY(y);
    }
    dragging = -1;
  });
  document.body.addEventListener("mousemove", function(event) {
    if (dragging > -1) {
      var x = event.clientX;
      var y = event.clientY;
      var particle = objects[dragging];
      particle.position.setX(x + offsetX);
      particle.position.setY(y + offsetY);
    }
  });

};
