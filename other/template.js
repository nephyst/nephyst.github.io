window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

  update();

  function update() {
    c.clearRect(0, 0, width, height);

    requestAnimationFrame(update);
  }

};
