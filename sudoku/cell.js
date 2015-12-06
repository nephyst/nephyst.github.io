var Cell = {
  particle: null,
  values: null,
  locked: null,
  error: null,
  //used in generate
  testValues: null,
  testIndex: null,

  create: function() {
    var obj = Object.create(this);
    obj.values = new Array(9);
    for (var i = 0; i < obj.values.length; i++) {
      obj.values[i] = true;
    }
    return obj;
  }
}
