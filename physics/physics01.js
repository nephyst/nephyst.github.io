window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    particles = [],
    numParticles = 100;

  for (var i = 0; i < numParticles; i++) {
    particles.push(Particle.create(width / 2, height / 2, Math.random() * 4 + 1, Math.random() * Math.PI * 2));
  }

  update();
  function update() {
    c.clearRect(0, 0, width, height);

    for (var i = 0; i < numParticles; i++) {
      var particle = particles[i];
      particle.update();
      c.beginPath();
      var position = particle.position;
      c.arc(position.getX(), position.getY(), 10, 0, Math.PI * 2, false);
      c.fill();
    }

    requestAnimationFrame(update);
  }

};
