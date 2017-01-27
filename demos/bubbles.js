window.onload = function() {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    fl = 200,
    cards = [],
    numCards = 700,
    centerZ = 1000,
    baseAngle = 0,
    rotationSpeed = 0.02;

    // var bernie = new Image();
    // bernie.src = 'http://i.imgur.com/B7G8S6o.png';

  for (var i = 0; i < numCards; i += 1) {
    var card = {
      angle: randomRange(0, Math.PI * 2),
      radius: randomRange(50, 1200),
      y: randomRange(2000, -2000)
    };
    card.x = Math.cos(card.angle + baseAngle) * card.radius;
    card.z = centerZ + Math.sin(card.angle + baseAngle) * card.radius;
    cards.push(card);
  }

  context.translate(width / 2, height / 2);
  context.fillStyle = "white";

  document.body.addEventListener("mousemove", function(event) {
    rotationSpeed = (event.clientX - width / 2) * 0.0001;
    ypos = (event.clientY - height / 2) * 2;
  });


  update();

  function update() {
    baseAngle += rotationSpeed;
    cards.sort(zsort);
    context.clearRect(-width / 2, -height / 2, width, height);
    for (var i = 0; i < numCards; i += 1) {
      var card = cards[i],
        perspective = fl / (fl + card.z);

      context.save();
      context.scale(perspective, perspective);
      context.translate(card.x, card.y);
      context.globalAlpha = map(card.y, 2000, -2000, 1, 0);

      // context.drawImage(bernie, 0, 0, 200, 200);
      context.beginPath();
      context.arc(0, 0, 20, 0, Math.PI * 2, false);
      context.fill();

      context.restore();

      card.x = Math.cos(card.angle + baseAngle * (400 / card.radius)) * card.radius;
      card.z = centerZ + Math.sin(card.angle + baseAngle * (400 / card.radius)) * card.radius;
      card.y -= 10;

      if (card.y < -2000) {
        card.y = 2000;
      }
    }
    requestAnimationFrame(update);
  }

  function zsort(cardA, cardB) {
    return cardB.z - cardA.z;
  }
};
