window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

  c.fillRect(0, 0, width, height);

  for (i = 0; i < 100; i++) {
    var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    c.strokeStyle = randomColor;
    c.beginPath();
    c.moveTo(Math.random() * width, Math.random() * height);
    c.lineTo(Math.random() * width, Math.random() * height);
    c.stroke();
  }
};
