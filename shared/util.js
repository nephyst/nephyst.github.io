//
//Normals
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
//
//Prototype definition
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
