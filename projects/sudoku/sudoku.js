window.onload = function() {
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    autoNotes = false,
    lastMouse = null,
    //Globals used to drag particles
    dragging = null,
    offsetX = 0,
    offsetY = 0,
    //Globals used to ahimate solve
    solving = -1,
    solveIndex = [],
    //Used to see if a number is complete
    completeCount = new Array(9);

  var top = 10;
  var bottom = height - 10;
  var cellSize = (bottom - top) / 9;
  var left = 2 * cellSize;
  var right = height + left - 20;

  var numbers = [];
  for (var i = 1; i <= 9; i++) {
    var number = Particle.create(left - cellSize, map(i, 0, 10, 0, height));
    var hue = map(i, 1, 10, 0, 360);
    if (hue == 80) {
      hue = 60;
    };
    number.color = "hsl(" + hue + ", 100%, 50%)";
    number.colorDim = "hsl(" + hue + ", 100%, 25%)";
    number.radius = cellSize / 2 - 10;
    number.sudoku = i;
    numbers.push(number);
  }

  var data = new Array(9);
  for (var i = 0; i < data.length; i++) {
    data[i] = new Array(9);
    for (var j = 0; j < data.length; j++) {
      data[i][j] = Cell.create();
    }
  }

  newPuzzle();

  checkCells();
  update();

  function update() {
    c.clearRect(0, 0, width, height);
    drawGrid();
    drawParticles();
    if (solving > -1) {
      solveStep();
    }
    requestAnimationFrame(update);
  }

  function drawGrid() {
    c.strokeStyle = "#000";
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].length; j++) {
        if (data[i][j].locked) {
          c.fillStyle = "#555";
          c.fillRect(left + i * cellSize, top + j * cellSize, cellSize, cellSize);
        } else if (data[i][j].error) {
          c.fillStyle = "#AF0000";
          c.fillRect(left + i * cellSize + 1, top + j * cellSize + 1, cellSize - 2, cellSize - 2);
        }
      }
    }
    for (var i = 0; i <= 9; i++) {
      var x = map(i, 0, 9, left, right);
      c.beginPath();
      c.moveTo(x, top - 4.5);
      c.lineTo(x, bottom + 4.5);
      c.lineWidth = 3 * (i % 3 == 0 ? 3 : 1);
      c.stroke();
    }
    for (var i = 0; i <= 9; i++) {
      var y = map(i, 0, 9, top, bottom);
      c.beginPath();
      c.moveTo(left, y);
      c.lineTo(right, y);
      c.lineWidth = 3 * (i % 3 == 0 ? 3 : 1);
      c.stroke();
    }
  }

  function drawParticles() {
    for (var i = 0; i < numbers.length; i++) {
      drawParticle(numbers[i], true);
    }
    var draggingValue = null;
    if (dragging) {
      draggingValue = dragging.sudoku - 1;
    }
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].length; j++) {
        if (data[i][j].particle) {
          drawParticle(data[i][j].particle);
        } else {
          for (var k = 0; k < 9; k++) {
            //This shit is ugly as hell.
            var value = autoNotes ? data[i][j].values[k] : data[i][j].notes[k];
            if (value) {
              c.fillStyle = numbers[k].color;
              c.beginPath();
              var xOffset = 1.5 * ((i % 3 == 0) - (i % 3 == 2)) + 1;
              var yOffset = 1.5 * ((j % 3 == 0) - (j % 3 == 2)) + 1;
              var kOffsetX = 2 * ((k % 3 == 0) - (k % 3 == 2));
              var kOffsetY = 2 * ((k < 3) - (k > 5));
              var x = left + i * cellSize + (k % 3 * cellSize / 3) + cellSize / 18 + kOffsetX + xOffset;
              var y = top + j * cellSize + Math.floor(k / 3) * (cellSize / 3) + cellSize / 18 + kOffsetY + yOffset;
              if (draggingValue == null || draggingValue != k) {
                c.globalAlpha = 0.5;
                c.lineWidth = 1;
              } else {
                c.lineWidth = 2;
              }

              c.fillRect(x, y, cellSize / 5, cellSize / 5);
              c.strokeRect(x, y, cellSize / 5, cellSize / 5);
              c.globalAlpha = 1.0;
            }
          }
        }
      }
    }
    drawParticle(dragging);
  }

  function drawParticle(particle, allowDim) {
    if (particle) {
      c.fillStyle = particle.color;
      c.lineWidth = 5;
      if (!completeCount[particle.sudoku - 1] && allowDim) {
        c.fillStyle = particle.colorDim;
      }
      c.strokeRect(particle.x - particle.radius, particle.y - particle.radius, particle.radius * 2, particle.radius * 2);
      c.fillRect(particle.x - particle.radius, particle.y - particle.radius, particle.radius * 2, particle.radius * 2);

      c.fillStyle = '#000';
      c.font = "bolder 17pt serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.shadowColor = "#ccc";
      c.shadowOffsetX = c.shadowOffsetY = 2;
      c.shadowBlur = 2;
      c.fillText(particle.sudoku, particle.x + 0.5, particle.y + 1);
      c.shadowColor = "#00000000";
      c.shadowColor = "rgba(0, 0, 0, 0)";
    }
  }

  function toCoordinate(x, y) {
    var i = Math.floor((x - left) / cellSize);
    var j = Math.floor((y - top) / cellSize);
    var cellX = i * cellSize + left;
    var cellY = j * cellSize + top;
    var k = Math.floor((x - cellX) / (cellSize / 3)) + 3 * Math.floor((y - cellY) / (cellSize / 3));
    return [i, j, k];
  }

  function isInsideCircle(particle, x, y) {
    var px = particle.x;
    var py = particle.y;
    var dx = x - px;
    var dy = y - py
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance < particle.radius;
  }

  function cloneParticle(index, x, y) {
    var sourceParticle = numbers[index - 1];
    var particle = sourceParticle.clone();
    particle.sudoku = sourceParticle.sudoku;
    var xOffset = 1.5 * ((x % 3 == 0) - (x % 3 == 2));
    var yOffset = 1.5 * ((y % 3 == 0) - (y % 3 == 2));
    particle.x = (x + 0.5) * cellSize + left + xOffset;
    particle.y = (y + 0.5) * cellSize + top + yOffset;
    data[x][y].particle = particle;
  }

  //This gets ran a lot and is used to check for errors
  //and to fill in the auto hints. The auto hints
  //are also used by other algorithms for things like solving
  function checkCells() {
    var errors;
    completeCount.fill(0);
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data.length; j++) {
        for (var k = 0; k < data.length; k++) {
          data[i][j].values[k] = 1;
        }
      }
    }
    for (var x = 0; x < data.length; x++) {
      for (var y = 0; y < data[x].length; y++) {
        data[x][y].error = false;
        if (data[x][y].particle) {
          var sudoku = data[x][y].particle.sudoku;
          for (var i = 0; i < 9; i++) {
            var particle = data[i][y].particle;
            if (i != x && particle && particle.sudoku == sudoku) {
              data[x][y].error = true;
              errors = true;
            }

            var particle = data[x][i].particle;
            if (i != y && particle && particle.sudoku == sudoku) {
              data[x][y].error = true;
              errors = true;
            }
            var x2 = 3 * Math.floor(x / 3) + i % 3;
            var y2 = 3 * Math.floor(y / 3) + Math.floor(i / 3);
            var particle = data[x2][y2].particle;
            if (x != x2 && y != y2 && particle && particle.sudoku == sudoku) {
              data[x][y].error = true;
              errors = true;
            }
            data[x][i].values[sudoku - 1] = 0;
            data[i][y].values[sudoku - 1] = 0;
            data[x2][y2].values[sudoku - 1] = 0;
            data[x][y].values[sudoku - 1] = 1;
          }
        }
      }
    }
    //Checks cells with no possible values left.
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].length; j++) {
        var hasValues = false;
        for (var k = 0; k < data[i][j].values.length; k++) {
          if (data[i][j].values[k]) {
            hasValues = true;
            if (!data[i][j].particle) {
              completeCount[k]++;
            }
          }
        }
        if (!hasValues) {
          data[i][j].error = true;
          errors = true;
        }
      }
    }
    return errors;
  }

  //Methods to help solving
  function getNextCell() {
    var max = 10;
    var cellIndex = new Array();
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        var cell = data[i][j];
        if (cell.particle) {
          continue;
        }
        var count = 0;
        for (var k = 0; k < 9; k++) {
          if (cell.values[k]) {
            count++
          }
        }
        if (count < max) {
          cellIndex = new Array();
          max = count;
          cellIndex.push([i, j]);
        } else if (count == max) {
          cellIndex.push([i, j]);
        }
      }
    }
    var random = randomInt(0, cellIndex.length - 1);
    var result = cellIndex[random];
    return result;
  }

  function getCellValues(x, y) {
    var values = [];
    var random = new Array();
    random.randomFillInt(9);
    var cellValues = data[x][y].values;
    for (var i = 0; i < random.length; i++) {
      if (cellValues[random[i] - 1]) {
        values.push(random[i]);
      }
    }
    return values;
  }

  function clearPuzzle(clearLocked) {
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].length; j++) {
        if (data[i][j].locked) {
          if (clearLocked) {
            data[i][j].particle = null;
            data[i][j].locked = false;
          }
        } else {
          data[i][j].particle = null;
        }
      }
    }
    checkCells();
  }

  //Methods to animate solving
  function solve() {
    if (solving == -1) {
      solving++;
      solveIndex = new Array();
      dragging = null;
      checkCells();
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
          data[i][j].testValues = null;
        }
      }
    }
  }

  function solveStep() {
    var cellIndex = solveIndex[solving];
    if (!cellIndex) {
      cellIndex = getNextCell();
      if (!cellIndex) {
        solving = -1;
        return;
      }
      solveIndex[solving] = cellIndex;
    }
    var x = cellIndex[0];
    var y = cellIndex[1];
    var cell = data[x][y];
    if (!cell.testValues) {
      cell.testValues = getCellValues(x, y);
      cell.testIndex = 0;
    }

    if (cell.testIndex >= cell.testValues.length) {
      cell.testValues = null;
      cell.testIndex = null;
      cell.particle = null;
      solveIndex[solving] = null;
      solving--;
      checkCells();
      return;
    }
    var testValue = cell.testValues[cell.testIndex];
    cloneParticle(testValue, x, y);
    cell.testIndex++;

    var errors = checkCells();
    if (!errors) {
      solving++;
      if (solving > 80) {
        solving = -1;
      }
    }
  }

  function newPuzzle() {
    clearPuzzle(true);
    createSolution();
    var failCount = 0;
    while (failCount < 5) {
      var x = randomInt(0, 8);
      var y = randomInt(0, 8);
      var particle = data[x][y].particle;
      if (!particle) {
        continue;
      }
      data[x][y].particle = null;
      c.clearRect(0, 0, width, height);
      checkCells();
      var solutions = solveCount();
      if (solutions == 0) {
        return;
      }
      if (solutions > 1) {
        failCount++;
        data[x][y].particle = particle;
      } else {
        failCount = 0;
      }
    }
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].length; j++) {
        if (data[i][j].particle) {
          data[i][j].locked = true;
        }
      }
    }
    checkCells();
  }

  function createSolution() {
    var cellIndex = getNextCell();
    if (!cellIndex) {
      return 1;
    }
    var x = cellIndex[0];
    var y = cellIndex[1];
    var cell = data[x][y];
    var cellValues = getCellValues(x, y);

    for (var i = 0; i < cellValues.length; i++) {
      var testValue = cellValues[i];
      cloneParticle(testValue, x, y);
      var errors = checkCells();
      if (errors) {
        continue;
      } else {
        if (createSolution()) {
          return 1;
        }
      }
    }
    cell.particle = null;
    return 0;
  }

  //Methods to count solutions
  function solveCount() {
    var solutionCount = 0;
    var cellIndex = getNextCell();
    if (!cellIndex) {
      return 1;
    }
    var x = cellIndex[0];
    var y = cellIndex[1];
    var cell = data[x][y];
    var cellValues = getCellValues(x, y);

    for (var i = 0; i < cellValues.length; i++) {
      var testValue = cellValues[i];
      var sourceParticle = numbers[testValue - 1];
      var particle = sourceParticle.clone();
      particle.sudoku = sourceParticle.sudoku;
      cell.particle = particle;
      var errors = checkCells();
      if (errors) {
        continue;
      } else {
        solutionCount += solveCount();
        if (solutionCount > 1) {
          cell.particle = null;
          return solutionCount;
        }
      }
    }
    cell.particle = null;
    return solutionCount;
  }
  //******
  //Mouse and Keyboard events
  //******
  function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
  document.body.addEventListener("mousedown", function(event) {
    if (event.target.tagName != 'CANVAS' || solving > -1) {
      return;
    }
    var mouse = getMousePos(event)
    for (var i = numbers.length - 1; i >= 0; i--) {
      if (isInsideCircle(numbers[i], mouse.x, mouse.y)) {
        dragging = numbers[i].clone();
        dragging.sudoku = numbers[i].sudoku;
        offsetX = dragging.x - mouse.x;
        offsetY = dragging.y - mouse.y;
        break;
      }
    }
    if (!dragging) {
      var coord = toCoordinate(mouse.x, mouse.y);
      var i = coord[0];
      var j = coord[1];
      if (i >= 0 && i < 9 && j >= 0 && j < 9) {
        var particle = data[i][j].particle;
        if (particle && !data[i][j].locked) {
          data[i][j].particle = null;
          dragging = particle;
          offsetX = particle.x - mouse.x;
          offsetY = particle.y - mouse.y;
        }
      }
    }
  });

  document.body.addEventListener("mouseup", function(event) {
    if (event.target.tagName != 'CANVAS') {
      return;
    }
    //Drop particle
    if (dragging) {
      var particle = dragging;
      var x = particle.x;
      var y = particle.y;
      if (x > left && x < right && y > top && y < right) {
        var coord = toCoordinate(x, y);
        var i = coord[0];
        var j = coord[1];
        if (!data[i][j].locked) {
          var xOffset = 1.5 * ((i % 3 == 0) - (i % 3 == 2));
          var yOffset = 1.5 * ((j % 3 == 0) - (j % 3 == 2));
          particle.x = (i + 0.5) * cellSize + left + xOffset;
          particle.y = (j + 0.5) * cellSize + top + yOffset;
          particle.cell = coord;
          data[i][j].particle = particle;
          data[i][j].values[particle.sudoku] = true;
        }
      }
    } else if (!autoNotes) {
      //toggle note
      var mouse = getMousePos(event)
      var coord = toCoordinate(mouse.x, mouse.y);
      var i = coord[0];
      var j = coord[1];
      var k = coord[2];
      if (i >= 0 && i < 9 && j >= 0 && j < 9) {
        var cell = data[i][j];
        cell.notes[coord[2]] = !cell.notes[coord[2]];
      }
    }
    dragging = null;
    checkCells();
  });
  document.body.addEventListener("mousemove", function(event) {
    if (event.target.tagName != 'CANVAS') {
      return;
    }
    var mouse = getMousePos(event);
    lastMouse = mouse;
    if (dragging) {
      dragging.x = mouse.x + offsetX;
      dragging.y = mouse.y + offsetY;
    }
  });
  document.body.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
      case 48: //0
      case 49: //1
      case 50: //2
      case 51: //3
      case 52: //4
      case 53: //5
      case 54: //6
      case 55: //7
      case 56: //8
      case 57: //9
        var n = event.keyCode - 48;
        if (n) {
          dragging = numbers[n - 1].clone();
          dragging.sudoku = numbers[n - 1].sudoku;
          dragging.x = lastMouse.x - 10;
          dragging.y = lastMouse.y - 10;
          offsetX = -10;
          offsetY = -10;
        } else {
          dragging = null;
        }
        break;
      default:
        break;
    }
  });
  document.getElementById("createButton").addEventListener("click", function() {
    newPuzzle();
  });
  document.getElementById("solveButton").addEventListener("click", function() {
    solve();
  });
  document.getElementById("clearButton").addEventListener("click", function() {
    clearPuzzle();
  });
  document.getElementById("hintsButton").addEventListener("click", function() {
    autoNotes = !autoNotes;
    this.textContent = autoNotes ? "Automatic Hints" : "Manual Notes";
  });
}
