var Cell = {
  particle: null,
  values: null, //system calculated hints
  notes: null, //manual notes
  locked: null,
  error: null,
  //used in generate
  testValues: null,
  testIndex: null,

  create: function() {
    var obj = Object.create(this);
    obj.values = new Array(9);
    obj.notes = new Array(9);
    obj.values.fill(true);
    obj.notes.fill(true)
    return obj;
  }
}
