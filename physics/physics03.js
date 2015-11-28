window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    ship = Particle.create(width / 2, height / 2, 0, 0),
    thrust = Vector.create(0, 0),
    angle = 0,
    turningLeft = false,
    turningRight = false,
    thrusting = false;

  update();

  document.body.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
      case 38: //up
        thrusting = true;
        break;
      case 40: //down
        break;
      case 37: //left
        turningLeft = true;
        break;
      case 39: //right
        turningRight = true;
        break;
      default:
        break;
    }
  });

  document.body.addEventListener("keyup", function(event) {
    switch (event.keyCode) {
      case 38: //up
      case 40: //down
        thrusting = false;
        break;
      case 37:
        turningLeft = false;
      case 39: //right
        turningRight = false;
        break;
      default:
        break;
    }
  });

  function update() {
    c.clearRect(0, 0, width, height);

    //move ship
    angle += (0.05 * turningRight) - (0.05 * turningLeft);
    ship.accelerate(thrust);
    ship.update();

    thrust.setAngle(angle);
    thrust.setLength(0.05 * thrusting);

    c.save();
    c.translate(ship.position.getX(), ship.position.getY());
    c.rotate(angle);

    //draw ship
    c.beginPath();
    c.moveTo(15, 0);
    c.lineTo(-15, -10);
    c.lineTo(-15, 10);
    c.closePath();
    c.fill();

    if (turningRight) {
      c.beginPath();
      c.moveTo(-8, 7);
      c.lineTo(-8, 11);
      c.lineWidth = 3;
      c.stroke();
    }
    if (turningLeft) {
      c.beginPath();
      c.moveTo(-8, -7);
      c.lineTo(-8, -11);
      c.lineWidth = 3;
      c.stroke();
    }
    if (thrusting) {
      c.beginPath();
      c.moveTo(-15, 5);
      c.lineTo(-20, 5);
      c.moveTo(-15, -5);
      c.lineTo(-20, -5);
      c.lineWidth = 3;
      c.stroke();
    }

    c.restore();

    if (ship.position.getX() < 0) {
      ship.position.setX(width);
    }
    if (ship.position.getY() < 0) {
      ship.position.setY(height);
    }
    if (ship.position.getX() > width) {
      ship.position.setX(0);
    }
    if (ship.position.getY() > height) {
      ship.position.setY(0);
    }

    requestAnimationFrame(update);
  }

};
