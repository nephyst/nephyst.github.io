function norm(value, min, max) {
  return (value - min) / (max - min);
}

function lerp(value, min, max) {
  return (max - min) * value + min;
}
