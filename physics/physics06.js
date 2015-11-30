window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    base = [width / 2, height / 2],
    particle = Particle.create(
      randomRange(0, width), randomRange(0, height),
      randomRange(5, 15), randomRange(0, Math.PI * 2));
  particle.radius = 15;
  particle.friction = 0.95;

  update();

  function update() {
    c.clearRect(0, 0, width, height);

    particle.springTo(base[0], base[1], 0.05);
    particle.update();

    c.beginPath();
    c.rect(base[0] - 5, base[1] - 5, 10, 10);
    c.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
    c.fill();
    c.beginPath();
    c.moveTo(base[0], base[1]);
    c.lineTo(particle.x, particle.y);
    c.stroke();

    requestAnimationFrame(update);
  }
  document.body.addEventListener("mousemove", function(event) {
    base[0] = event.clientX;
    base[1] = event.clientY;
  });
};
