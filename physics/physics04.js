window.onload = function() {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    sun = Particle.create(width / 2, height / 2, 0, 0),
    planets = [];

  sun.mass = 15000;

  for (var i = 0; i < 50; i++) {
    planets.push(Particle.create(
      width / 2 + Math.random() * width / 5 + 200,
      height / 2 + Math.random() * height / 4 - 100,
      Math.random() * 4 + 6,
      -Math.PI / 2));
    planets[i].color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    planets[i].size = Math.random() * 12 + 3;
    planets[i].mass = planets[i].size * planets[i].size;
  }

  update();

  function update() {
    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.fillStyle = '#ffff00';
    context.arc(sun.position.getX(), sun.position.getY(), 50, 0, Math.PI * 2, false);
    context.fill();

    for (var i = 0; i < planets.length; i++) {
      planets[i].gravitateTo(sun);
      planets[i].update();
      context.beginPath();
      context.fillStyle = planets[i].color;
      context.arc(planets[i].position.getX(), planets[i].position.getY(), planets[i].size, 0, Math.PI * 2, false);
      context.fill();
    }

    requestAnimationFrame(update);
  }

};
