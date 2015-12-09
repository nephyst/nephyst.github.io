var Hex = {
  q: null,
  r: null,
  s: null,
  size: null,

  create: function(q, r, size) {
    var obj = Object.create(this);
    obj.q = q;
    obj.r = r;
    obj.s = -q - r;
    obj.size = size;
    return obj;
  },
  fromPixel: function(x, y, size) {
    var q = (x * Math.sqrt(3) / 3 - y / 3) / size
    var r = y * 2 / 3 / size
    return Hex.create(q, r, size).cubeRound();
  },
  toPixel: function() {
    var x = this.size * Math.sqrt(3) * (this.q + this.r / 2);
    var y = this.size * 3 / 2 * this.r;
    return [x, y];
  },
  distanceFromCenter: function() {
    var q = Math.abs(this.q);
    var r = Math.abs(this.r);
    var s = Math.abs(this.s);
    return Math.max(q, r, s);
  },
  cubeRound: function() {
    var q = Math.round(this.q);
    var r = Math.round(this.r);
    var s = Math.round(this.s);

    var qDiff = Math.abs(q - this.q);
    var rDiff = Math.abs(r - this.r);
    var sDiff = Math.abs(s - this.s);

    if (qDiff > rDiff && qDiff > sDiff) {
      q = -r - s;
    } else if (rDiff > sDiff) {
      r = -q - s;
    } else {
      s = -q - r;
    }
    this.q = q;
    this.r = r;
    this.s = s;
    return this
  }
}
