//
// Normals
//
function norm(value, min, max) {
  return (value - min) / (max - min);
}

function lerp(value, min, max) {
  return (max - min) * value + min;
}

function map(value, srcMin, srcMax, destMin, destMax) {
  var normal = norm(value, srcMin, srcMax);
  return lerp(normal, destMin, destMax);
}
//
// Range
//
function inRange(value, min, max) {
  return value > min && value < max;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
//
// Random
//
function randomRange(min, max) {
  return lerp(Math.random(), min, max);
}

function randomInt(min, max) {
  return Math.floor(randomRange(max + 1, min));
}

function randomColor() {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

function colorToHex(color) {
  return Math.round(color).toString(16).padLeft(2, '0');
}
//
// Shapes
//
function polygon(c, sides, x, y, radius, angle) {
  angle = angle || 0;
  //sin x
  //cos y
  c.beginPath();
  c.moveTo(x + radius * Math.sin(angle), y - radius * Math.cos(angle));
  for (var i = 0; i < sides; i++) {
    angle += Math.PI * 2 / sides;
    c.lineTo(x + radius * Math.sin(angle), y - radius * Math.cos(angle));
  }
  c.closePath();
}

function roundRect(c, x, y, width, height, radius) {
  radius = radius || 5;
  c.beginPath();
  c.moveTo(x + radius, y);
  c.lineTo(x + width - radius, y);
  c.quadraticCurveTo(x + width, y, x + width, y + radius);
  c.lineTo(x + width, y + height - radius);
  c.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  c.lineTo(x + radius, y + height);
  c.quadraticCurveTo(x, y + height, x, y + height - radius);
  c.lineTo(x, y + radius);
  c.quadraticCurveTo(x, y, x + radius, y);
  c.closePath();
}
//
// Prototype definition
//
Number.prototype.padLeft = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
}
String.prototype.padLeft = function(size, char) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = char + s;
  }
  return s;
}

Array.prototype.randomFillInt = function(value) {
  var temp = [];
  for (var i = 1; i <= value; i++) {
    temp.push(i);
  }
  while (temp.length > 0) {
    var random = randomInt(0, temp.length - 1);
    this.push(temp.splice(random, 1)[0]);
  }
}

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}
