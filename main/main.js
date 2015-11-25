window.onload = function() {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

  context.fillRect(0, 0, width, height);

  for (i = 0; i < 100; i++) {
    var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    context.strokeStyle = randomColor;
    context.beginPath();
    context.moveTo(Math.random() * width, Math.random() * height);
    context.lineTo(Math.random() * width, Math.random() * height);
    context.stroke();
  }
};
