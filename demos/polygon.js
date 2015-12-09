window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    angle = 0;

  polygon(c, 3, 50, 50, 50, angle += Math.PI / 360);
  c.fill();
  polygon(c, 4, 150, 50, 50, angle += Math.PI / 360);
  c.fill();
  polygon(c, 5, 250, 50, 45, angle += Math.PI / 360);
  c.fill();
  polygon(c, 6, 50, 150, 45, angle += Math.PI / 360);
  c.fill();
  polygon(c, 7, 150, 150, 45, angle += Math.PI / 360);
  c.fill();
  polygon(c, 8, 250, 150, 45, angle += Math.PI / 360);
  c.fill();
  polygon(c, 9, 50, 250, 45, angle += Math.PI / 360);
  c.fill();
  polygon(c, 10, 150, 250, 45, angle += Math.PI / 360);
  c.fill();
  polygon(c, 11, 250, 250, 45, angle += Math.PI / 360);
  c.fill();
};
