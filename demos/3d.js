window.onload = function() {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    fl = 300,
    points = [],
    needsUpdate = true;

  context.translate(width / 2, height / 2);

  points[0] = {
    x: -500,
    y: -500,
    z: 1000
  };
  points[1] = {
    x: -500,
    y: -500,
    z: 500
  };
  points[2] = {
    x: -500,
    y: 500,
    z: 1000
  };
  points[3] = {
    x: -500,
    y: 500,
    z: 500
  };

  points[4] = {
    x: 500,
    y: -500,
    z: 1000
  };
  points[5] = {
    x: 500,
    y: -500,
    z: 500
  };
  points[6] = {
    x: 500,
    y: 500,
    z: 1000
  };
  points[7] = {
    x: 500,
    y: 500,
    z: 500
  };

  function project() {
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var scale = fl / (fl + p.z);
      p.sx = p.x * scale;
      p.sy = p.y * scale;
    }
  }

  function drawLine() {
    var p = points[arguments[0]];
    context.beginPath();
    context.moveTo(p.sx, p.sy);
    for (var i = 1; i < arguments.length; i++) {
      p = points[arguments[i]];
      context.lineTo(p.sx, p.sy);
    }
    context.stroke();
  }

  function translateModel(x, y, z) {
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      p.x += x;
      p.y += y;
      p.z += z;
    }
    needsUpdate = true;
  }

  update();

  function update() {
    if (needsUpdate) {
      context.clearRect(-width / 2, -height / 2, width, height);
      project();

      drawLine(0, 1, 5, 4, 0);
      drawLine(2, 3, 7, 6, 2);
      drawLine(0, 2);
      drawLine(1, 3);
      drawLine(5, 7);
      drawLine(4, 6);
      needsUpdate = false;
    }
    requestAnimationFrame(update);
  }

  document.body.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
      case 37: //left
        translateModel(-20, 0, 0);
        break;
      case 38: //up
        if (event.shiftKey) {
          translateModel(0, 0, 20);
        } else {
          translateModel(0, -20, 0);
        }
        break;
      case 39: //right
        translateModel(20, 0, 0);
        break;
      case 40: //down
        if (event.shiftKey) {
          translateModel(0, 0, -20);
        } else {
          translateModel(0, 20, 0);
        }
        break;
      default:
        console.log(event.keyCode);
        break;
    }
  });

};
