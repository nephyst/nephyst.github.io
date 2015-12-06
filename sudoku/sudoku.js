window.onload = function() {
  var canvas = document.getElementById("canvas"),
    textArea = document.getElementById("textarea"),
    c = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    dragging = null,
    offsetX = 0,
    offsetY = 0,
    solving = -1,
    solveIndex = [];

  var top = 10;
  var bottom = height - 10;
  var left = width / 2 - (height - 20) / 2;
  var right = width / 2 + (height - 20) / 2;
  var cellSize = (right - left) / 9;

  var numbers = [];
  for (var i = 1; i <= 9; i++) {
    var number = Particle.create(left - cellSize, map(i, 0, 10, 0, height));
    var hue = map(i, 1, 10, 0, 360);
    if (hue == 80) {
      hue = 60;
    };
    var hsl = "hsl(" + hue + ", 100%, 50%)";
    number.color = hsl;
    number.radius = cellSize / 2 - 7;
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
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].length; j++) {
        if (data[i][j].locked) {
          c.fillStyle = "#000";
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
      drawParticle(numbers[i]);
    }
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].length; j++) {
        if (data[i][j].particle) {
          drawParticle(data[i][j].particle);
        } else {
          for (var k = 0; k < 9; k++) {
            //This shit is ugly as hell.
            var value = data[i][j].values[k];
            if (value) {
              c.fillStyle = numbers[k].color;
              c.beginPath();
              var xOffset = 1.5 * ((i % 3 == 0) - (i % 3 == 2));
              var yOffset = 1.5 * ((j % 3 == 0) - (j % 3 == 2));
              var kOffsetX = 2 * ((k % 3 == 0) - (k % 3 == 2));
              var kOffsetY = 2 * ((k < 3) - (k > 5));
              var x = left + i * cellSize + (k % 3 * cellSize / 3) + cellSize / 18 + kOffsetX + xOffset;
              var y = top + j * cellSize + Math.floor(k / 3) * (cellSize / 3) + cellSize / 18 + kOffsetY + yOffset;
              roundRect(c, x, y, cellSize / 5, cellSize / 5, 3);
              c.fill();
              c.lineWidth = 1;
              c.stroke();
            }
          }
        }
      }
    }
    drawParticle(dragging);
  }

  function drawParticle(particle) {
    if (particle) {
      roundRect(c, particle.x - particle.radius, particle.y - particle.radius, particle.radius * 2, particle.radius * 2, 15);
      c.fillStyle = particle.color;
      c.fill();
      c.lineWidth = 3;
      c.stroke();

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

  function checkCells(fast) {
    var errors;
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
              if (errors && fast) {
                return true;
              }
            }

            var particle = data[x][i].particle;
            if (i != y && particle && particle.sudoku == sudoku) {
              data[x][y].error = true;
              errors = true;
              if (errors && fast) {
                return true;
              }
            }
            var x2 = 3 * Math.floor(x / 3) + i % 3;
            var y2 = 3 * Math.floor(y / 3) + Math.floor(i / 3);
            var particle = data[x2][y2].particle;
            if (x != x2 && y != y2 && particle && particle.sudoku == sudoku) {
              data[x][y].error = true;
              errors = true;
              if (errors && fast) {
                return true;
              }
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
            break;
          }
        }
        if (!hasValues) {
          data[i][j].error = true;
          errors = true;
          if (errors && fast) {
            return true;
          }
        }
      }
    }
    return errors;
  }

  document.body.addEventListener("mousedown", function(event) {
    if (event.target.tagName != 'CANVAS' || solving > -1) {
      return;
    }
    var x = event.clientX;
    var y = event.clientY;
    for (var i = numbers.length - 1; i >= 0; i--) {
      if (isInsideCircle(numbers[i], x, y)) {
        dragging = numbers[i].clone();
        dragging.sudoku = numbers[i].sudoku;
        offsetX = dragging.x - x;
        offsetY = dragging.y - y;
        break;
      }
    }
    if (!dragging) {
      var coord = toCoordinate(x, y);
      var i = coord[0];
      var j = coord[1];
      if (i >= 0 && i < 9 && j >= 0 && j < 9) {
        var particle = data[i][j].particle;
        if (particle && !data[i][j].locked) {
          data[i][j].particle = null;
          dragging = particle;
          offsetX = particle.x - x;
          offsetY = particle.y - y;
        }
      }
    }
  });

  document.body.addEventListener("mouseup", function(event) {
    if (event.target.tagName != 'CANVAS') {
      return;
    }
    if (dragging) {
      //Drop particle
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
      dragging = null;
    } else {
      //toggle note
      var x = event.clientX;
      var y = event.clientY;
      var coord = toCoordinate(x, y);
      var i = coord[0];
      var j = coord[1];
      var k = coord[2];
      if (i >= 0 && i < 9 && j >= 0 && j < 9) {
        var cell = data[i][j];
        cell.values[coord[2]] = !cell.values[coord[2]];
      }
    }
    checkCells(false);
  });
  document.body.addEventListener("mousemove", function(event) {
    if (event.target.tagName != 'CANVAS') {
      return;
    }
    if (dragging) {
      dragging.x = event.clientX + offsetX;
      dragging.y = event.clientY + offsetY;
    }
  });
  document.body.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
      case 78: //n
        solve();
        solveStep();
        break;
      case 77: //m
        console.log("Counting");
        console.log(solveCount());
        checkCells();
        break;
      default:
        console.log(event.keyCode);
        break;
    }
  });

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
    random.randomFill(9);
    var cellValues = data[x][y].values;
    for (var i = 0; i < random.length; i++) {
      if (cellValues[random[i] - 1]) {
        values.push(random[i]);
      }
    }
    return values;
  }

  //Methods to animate solving
  function solve() {
    if (solving == -1) {
      solving++;
      solveIndex = new Array();
      dragging = null;
      checkCells();
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data.length; j++) {
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
      //if (solving == -1) {
      //Puzzle has no solution.
      //}
      return;
    }
    var testValue = cell.testValues[cell.testIndex];
    var sourceParticle = numbers[testValue - 1];
    var particle = sourceParticle.clone();
    particle.sudoku = sourceParticle.sudoku;
    var xOffset = 1.5 * ((x % 3 == 0) - (x % 3 == 2));
    var yOffset = 1.5 * ((y % 3 == 0) - (y % 3 == 2));
    particle.x = (x + 0.5) * cellSize + left + xOffset;
    particle.y = (y + 0.5) * cellSize + top + yOffset;
    data[x][y].particle = particle;

    cell.testIndex++;

    var errors = checkCells();
    if (!errors) {
      solving++;
      if (solving > 80) {
        solving = -1;
      }
    }
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
      particle.x = (x + 0.5) * cellSize + left;
      particle.y = (y + 0.5) * cellSize + top;
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

};
