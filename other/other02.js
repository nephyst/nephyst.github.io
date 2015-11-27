window.onload = function() {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    randoms = [],
    max = 0,
    count = 100;

  for (var i = 0; i < count; i++) {
    randoms.push(0);
  }
  randoms[randomInt(0,count-1)]++;
  max = 1;

  update();

  function update() {
    context.clearRect(0, 0, width, height);
    var min = max;
    for (var i = 0; i < count; i++) {
      min = Math.min(randoms[i], min);
    }
    for (var i = 0; i < count; i++) {
      var blue = Math.floor(map(randoms[i], min, max, 0, 255));
      var red = 255 - blue;
      context.beginPath();
      var color = '#' + red.toString(16).padLeft(2, '0') + '00' + blue.toString(16).padLeft(2, '0');
      context.fillStyle = color
      context.rect(
        i * width / count,
        (1 - ((randoms[i] - min) / (max - min))) * height,
        width / count,
        ((randoms[i] - min) / (max - min)) * height);
      context.fill();
      context.closePath();
    }

    for (var i = 0; i < 5; i++) {
      var r = randomInt(0, count - 1);
      randoms[r]++;
      max = Math.max(max, randoms[r]);
    }
    requestAnimationFrame(update);
  }

};
