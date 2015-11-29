window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    mouse = [0, 0],
    hexRadius = 15,
    count = 5,
    selected = null,
    selectedColor = null,
    centerX = 200,
    centerY = 175;

  update();

  function update() {
    colorGrid();
    greyScale();
    outlineSelected();
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
        c.fillStyle = getColor(hex);
        c.fill();
      }
    }
  }

  function greyScale() {
    for (var i = -count; i < 1; i++) {
      var hex = Hex.create(i, count, hexRadius);
      var pixel = hex.toPixel();
      polygon(c, 6, pixel[0] + centerX, pixel[1] + centerY, hexRadius);
      var color = colorToHex(map(i, -count, 1, 210, 0));
      c.fillStyle = "#" + color + color + color;
      c.fill();
    }
  }

  function outlineSelected() {
    var hex = Hex.fromPixel(mouse[0] - centerX, mouse[1] - centerY, hexRadius);
    if (inRange(hex)) {
      var hexPixel = hex.toPixel();
      c.beginPath();
      polygon(c, 6, hexPixel[0] + centerX, hexPixel[1] + centerY, hexRadius - 2);
      c.lineWidth = 2;
      c.fillStyle = '#000000';
      c.stroke();
    }
    if (selected) {
      var hexPixel = selected.toPixel();
      c.beginPath();
      polygon(c, 6, hexPixel[0] + centerX, hexPixel[1] + centerY, hexRadius - 2);
      c.lineWidth = 2;
      c.fillStyle = '#000000';
      c.stroke();
    }
  }

  function getColor(hex) {
    var pixel = hex.toPixel();
    var x = pixel[0];
    var y = pixel[1];
    var h = Math.floor(Math.atan2(y, x) * 180 / Math.PI);
    var l = map(hex.distanceFromCenter() / (count - 1), 0, 1, 100, 39);
    var hsl = "hsl(" + h + ", 100%, " + l + "%)";
    return hsl;
  }

  function inRange(hex) {
    var d = hex.distanceFromCenter();
    return (d < count || (hex.r == count && hex.q >= -count && hex.q < 1));
  }

  document.body.addEventListener("mousemove", function(event) {
    mouse[0] = event.clientX;
    mouse[1] = event.clientY;
  });
  document.body.addEventListener("click", function(event) {
    var hex = Hex.fromPixel(event.clientX - centerX, event.clientY - centerY, hexRadius);
    if (inRange(hex)) {
      selected = hex;
    }
  });
};
