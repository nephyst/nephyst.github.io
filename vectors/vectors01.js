
var v1 = Vector.create(10, 5);
console.log(v1.getX(), v1.getY(), v1.getAngle(), v1.getLength());

v1.setAngle(Math.PI / 6);
v1.setLength(100);
console.log(v1.getX(), v1.getY(), v1.getAngle(), v1.getLength());

var v2 = Vector.create(10, 5);
var v3 = Vector.create(3, 4);
var v4 = v2.add(v3);
console.log(v4.getX(), v4.getY());

var v5 = v2.multiply(2);
console.log(v2.getLength(), v5.getLength());
