window.onload = function() {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    base = Vector.create(width / 2, height / 2),
    particle = Particle.create(
      randomRange(0, width), randomRange(0, height),
      randomRange(5, 15), randomRange(0, Math.PI * 2));
  particle.radius = 15;
  particle.friction = 0.95;

  update();

  function update() {
    context.clearRect(0, 0, width, height);

    particle.springTo(base, 0.05);
    particle.update();

    context.beginPath();
    context.rect(base.getX() - 5, base.getY() - 5, 10, 10);
    context.arc(particle.position.getX(), particle.position.getY(), particle.radius, 0, Math.PI * 2, false);
    context.fill();
    context.beginPath();
    context.moveTo(base.getX(), base.getY());
    context.lineTo(particle.position.getX(), particle.position.getY());
    context.stroke();

    requestAnimationFrame(update);
  }
  document.body.addEventListener("mousemove", function(event) {
    base.setX(event.clientX);
    base.setY(event.clientY);

  });
};
