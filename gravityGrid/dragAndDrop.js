window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    sun = Particle.create(width * 0.25, height * 0.25, 0, 0),
    asteroid = Particle.create(width * 0.75, height * 0.25, 0, 0),
    planet = Particle.create(width * 0.25, height * 0.75, 0, 0),
    planet2 = Particle.create(width * 0.75, height * 0.75, 0, 0),
    dragging = -1,
    offsetX = 0,
    offsetY = 0;

  sun.color = "#FFFF00";
  sun.radius = 80;
  asteroid.color = "#B87333";
  asteroid.radius = 30;
  planet.color = "#00FF00";
  planet.radius = 40;
  planet2.color = "#0000FF";
  planet2.radius = 40;

  var objects = [sun, asteroid, planet, planet2];

  update();

  function update() {
    c.clearRect(0, 0, width, height);
    drawCircles();
    requestAnimationFrame(update);
  }

  function drawCircles() {
    for (var i = 0; i < objects.length; i++) {
      var particle = objects[i];
      c.beginPath();
      c.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
      c.fillStyle = particle.color;
      c.fill();
      c.lineWidth = 3;
      c.stroke();
    }
  }

  function isInsideCircle(particle, x, y) {
    var px = particle.x;
    var py = particle.y;
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
        offsetX = objects[i].x - x;
        offsetY = objects[i].y - y;
        break;
      }
    }
  });
  document.body.addEventListener("mouseup", function(event) {
    dragging = -1;
  });
  document.body.addEventListener("mousemove", function(event) {
    if (dragging > -1) {
      var particle = objects[dragging];
      particle.x = event.clientX + offsetX;
      particle.y = event.clientY + offsetY;
    }
  });

};
