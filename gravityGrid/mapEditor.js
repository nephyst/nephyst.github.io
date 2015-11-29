window.onload = function() {
  var canvas = document.getElementById("canvas"),
    textArea = document.getElementById("textarea"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    dragging = -1,
    offsetX = 0,
    offsetY = 0;

  var top = 10;
  var bottom = height - 10;
  var left = width / 2 - (height - 20) / 2;
  var right = width / 2 + (height - 20) / 2;
  var cellSize = (right - left) / 7;

  textArea.style.left = (right + 50) + 'px';
  textArea.style.top = 75 + 'px';

  var sun = Particle.create(left - 100, 75, 0, 0);
  sun.color = "#FFFF00";
  sun.radius = cellSize / 2;
  sun.mass = 5;
  var asteroid = Particle.create(left - 100, 150, 0, 0);
  asteroid.color = "#B87333";
  asteroid.radius = cellSize / 2;
  asteroid.mass = 4;
  var redPlanet = Particle.create(left - 100, 225, 0, 0);
  redPlanet.color = "#FF0000";
  redPlanet.radius = cellSize / 2;
  redPlanet.mass = 1;
  var greenPlanet = Particle.create(left - 100, 300, 0, 0);
  greenPlanet.color = "#00FF00";
  greenPlanet.radius = cellSize / 2;
  greenPlanet.mass = 2;
  var bluePlanet = Particle.create(left - 100, 375, 0, 0);
  bluePlanet.color = "#0000FF";
  bluePlanet.radius = cellSize / 2;
  bluePlanet.mass = 3;

  var objects = [sun, asteroid, redPlanet, greenPlanet, bluePlanet];

  generateMapText();
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

  function generateMapText() {
    var data = new Array(7);
    for (var i = 0; i < 7; i++) {
      data[i] = new Array(7);
    }
    var text = '{\n';
    for (var i = 5; i < objects.length; i++) {
      var particle = objects[i];
      var p = toCoordinate(particle);
      if (particle.mass == 5) {
        for (var j = -1; j < 2; j++) {
          for (var k = -1; k < 2; k++) {
            var j1 = Math.max(Math.min(p[0] + j, 6), 0);
            var k1 = Math.max(Math.min(p[1] + k, 6), 0);
            data[j1][k1] = 9;
          }
        }
      }
      data[p[0]][p[1]] = particle.mass;
    }
    for (var i = 0; i < 7; i++) {
      for (var i2 = 0; i2 < 7; i2++) {
        text += data[i2][i] || 0;
        text += ',';
      }
      text += '\n';
    }
    text += '0,0,0,0\n'
    text += '}';
    textArea.value = text;
  }

  function toCoordinate(particle) {
    var x = particle.position.getX();
    var y = particle.position.getY();
    x = Math.floor((x - left) / cellSize);
    y = Math.floor((y - top) / cellSize);
    return [x, y];
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
    if (event.target.tagName != 'CANVAS' || dragging < 0) {
      return;
    }
    var particle = objects[dragging];
    var x = particle.position.getX();
    var y = particle.position.getY();
    if (x > left && x < right && y > top && y < right) {
      if (dragging < 5) {
        var sourceParticle = particle;
        particle = sourceParticle.clone();
        sourceParticle.position.setX(left - 100);
        sourceParticle.position.setY((dragging + 1) * 75);
        objects.push(particle);
      }
      var coord = toCoordinate(particle);
      x = (coord[0] + 0.5) * cellSize + left;
      y = (coord[1] + 0.5) * cellSize + top;
      particle.position.setX(x);
      particle.position.setY(y);
    } else if (dragging >= 5) {
      objects.splice(dragging, 1);
    } else {
      particle.position.setX(left - 100);
      particle.position.setY((dragging + 1) * 75);
    }
    dragging = -1;
    generateMapText();
  });
  document.body.addEventListener("mousemove", function(event) {
    if (event.target.tagName != 'CANVAS') {
      return;
    }
    if (dragging > -1) {
      var x = event.clientX;
      var y = event.clientY;
      var particle = objects[dragging];
      particle.position.setX(x + offsetX);
      particle.position.setY(y + offsetY);
    }
  });

};
