window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    mouse = [0, 0],
    hexRadius = 15,
    count = 7,
    selected = null,
    selectedColor = null,
    centerX = 200,
    centerY = 175;

  update();

  function update() {
    colorGrid();
    requestAnimationFrame(update);
  }

  function colorGrid() {
    var index = 0;
    var firstRow = 1 - count;
    var lastrow = count;
    for (var i = firstRow; i < count; i++) { //rows
      var firstCol = -Math.min(count + i - 1, count - 1);
      var lastCol = Math.min(count - 1, count - i - 1);
      for (var j = firstCol; j <= lastCol; j++) { //columns
        var hex = Hex.create(j, i, hexRadius);
        var pixel = hex.toPixel();
        polygon(c, 6, pixel[0] + centerX, pixel[1] + centerY, hexRadius);
        c.fillStyle = getPaletteColor(index++);
        c.fill();
      }
    }

    var hex = Hex.fromPixel(mouse[0] - centerX, mouse[1] - centerY, hexRadius);
    if (hex.distanceFromCenter() < count) {
      var hexPixel = hex.toPixel();
      c.beginPath();
      polygon(c, 6, hexPixel[0] + centerX, hexPixel[1] + centerY, hexRadius);
      c.lineWidth = 2;
      c.fillStyle = '#000000';
      c.stroke();
    }
    if (selected) {
      var hexPixel = selected.toPixel();
      c.beginPath();
      polygon(c, 6, hexPixel[0] + centerX, hexPixel[1] + centerY, hexRadius);
      c.lineWidth = 2;
      c.fillStyle = '#000000';
      c.stroke();
    }
  }

  document.body.addEventListener("mousemove", function(event) {
    mouse[0] = event.clientX;
    mouse[1] = event.clientY;
  });
  document.body.addEventListener("click", function(event) {
    var hex = Hex.fromPixel(event.clientX - centerX, event.clientY - centerY, hexRadius);
    if (hex && hex.distanceFromCenter() < count) {
      selected = hex;
    }
  });
};
