window.onload = function() {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    particles = [],
    numParticles = 100;

  for (var i = 0; i < numParticles; i++) {
    particles.push(Particle.create(width / 2, height / 2, Math.random() * 4 + 1, Math.random() * Math.PI * 2));
  }

  update();
  function update() {
    context.clearRect(0, 0, width, height);

    for (var i = 0; i < numParticles; i++) {
      var particle = particles[i];
      particle.update();
      context.beginPath();
      var position = particle.position;
      context.arc(position.getX(), position.getY(), 10, 0, Math.PI * 2, false);
      context.fill();
    }

    requestAnimationFrame(update);
  }

};
