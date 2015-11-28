window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    particles = [],
    gravity = Vector.create(0, 0.25);

  update();

  function update() {
    c.clearRect(0, 0, width, height);

    if (particles.length < 500) {
      particles.push(createParticle());
    }

    for (var i = 0; i < particles.length; i++) {
      var particle = particles[i];
      particle.update();
      particle.accelerate(gravity);

      if (particle.position.getY() + particle.radius > height) {
        particle.velocity.setY(-particle.velocity.getY() * 0.5);
        particle.velocity.setX(particle.velocity.getX() * 0.97);
        particle.position.setY(height - particle.radius + 1);
        particle.radius -= 0.05;
      }
      if (particle.radius < 0.06) {
        particle = createParticle();
        particles[i] = particle;
      }

      c.beginPath();
      c.fillStyle = particle.color;
      c.arc(particle.position.getX(), particle.position.getY(), particle.radius, 0, Math.PI * 2, false);
      c.fill();
    }
    requestAnimationFrame(update);
  }

  function createParticle() {
    var particle = Particle.create(width / 2, height - 25, randomRange(8.5, 18.5),
      -Math.PI / 2 + randomRange(-0.13, 0.13));
    particle.color = randomColor();
    particle.radius = randomRange(3, 11);
    return particle;
  }

};
