window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    particles = [],
    gravity = 0.25;

  // var bernie = new Image();
  // bernie.src = 'http://i.imgur.com/B7G8S6o.png';

  update();

  function update() {
    c.clearRect(0, 0, width, height);

    if (particles.length < 200) {
      particles.push(createParticle());
    }

    for (var i = 0; i < particles.length; i++) {
      var particle = particles[i];
      particle.update();
      particle.accelerate(0, gravity);

      if (particle.y + particle.radius > height) {
        particle.vx = particle.vx * 0.97;
        particle.vy = -particle.vy * 0.5;
        particle.y = height - particle.radius + 1;
        particle.radius -= 0.3;
      }
      if (particle.radius < 0.06) {
        particle = createParticle();
        particles[i] = particle;
      }

      c.beginPath();
      c.fillStyle = particle.color;
      c.arc(particle.x, particle.y, particle.radius * 0.9, 0, Math.PI * 2, false);
      // c.globalAlpha = 1;
      c.fill();
      // c.globalAlpha = 0.7;
      // c.drawImage(bernie, particle.x - particle.radius, particle.y - particle.radius, particle.radius * 2, particle.radius * 2);
    }
    requestAnimationFrame(update);
  }

  function createParticle() {
    var particle = Particle.create(width / 2, height - 25, randomRange(13, 20), -Math.PI / 2 + randomRange(-0.13, 0.13));
    particle.color = randomColor();
    particle.radius = randomRange(5, 40);
    return particle;
  }

};
