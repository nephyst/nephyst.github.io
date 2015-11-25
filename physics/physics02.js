window.onload = function() {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    numParticles = 250,
    numFireworks = 3;
  particles = [numParticles * numFireworks],
  gravity = Vector.create(0, 0.04),
  time = 0,
  fireworkIndex = 0;

  for (var i = 0; i < numFireworks; i++) {
    //firework(i);
  }
  firework(fireworkIndex++);
  update();

  function firework(num) {
    var x = Math.random() * width;
    var y = Math.random() * height;
    for (var i = 0; i < numParticles; i++) {
      particles[numParticles * num + i] = Particle.create(x, y, Math.random() * 5 + 0.2, Math.random() * Math.PI * 2);
    }
  }

  function update() {
    context.clearRect(0, 0, width, height);

    for (var i = 0; i < numParticles * numFireworks; i++) {
      var particle = particles[i];
      if (!particle) {
        continue;
      }
      particle.update();
      particle.accelerate(gravity);

      var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
      context.fillStyle = randomColor;
      context.beginPath();
      var position = particle.position;
      context.arc(position.getX(), position.getY(), 3, 0, Math.PI * 2, false);
      context.fill();
    }

    time++;
    if (time > 65) {
      time = 0;
      firework(fireworkIndex++ % numFireworks);
    }

    requestAnimationFrame(update);
  }

};
