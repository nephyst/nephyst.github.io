import Random from '../util/prng.js';

window.setup = setup;
window.windowResized = windowResized;
window.draw = draw;

let rand = new Random("Anthony");//performance.now());
let randomFillPercent = 49;
let tileSize = 9;

let map;
let cells;
let cellIndex;

let mapWidth;
let mapHeight;

let frame;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    //frameRate(1);
    //noLoop();

    init();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    init();
}

function init() {
    frame = 0;
    mapWidth = Math.floor(windowWidth / tileSize) + 1;
    mapHeight = Math.floor(windowHeight / tileSize) + 1;
    map = generateMap(mapWidth, mapHeight);

    let cellCount = (mapWidth) * (mapHeight);
    cells = Array.from(new Array(cellCount).keys());
    cells.sort(() => rand.nextFloat() - 0.5);

    cellIndex = 0;
}

function draw() {
    if(frame >= 7) {
        init();
    }
    smoothMap(map, Math.ceil(cells.length / 38));
    map.forEach((row, xIndex) => {
        row.forEach((cell, yIndex) => {
            cell ? fill(0) : fill(200);
            rect(xIndex * tileSize, yIndex * tileSize, tileSize, tileSize);
        });
    });
}

function generateMap(width, height) {
    return new Array(width).fill().map(
        (x, xIndex) => new Array(height).fill().map(
            (y, yIndex) => {
                if (xIndex === 0
                    || xIndex === width - 1
                    || yIndex === 0
                    || yIndex === height - 1) {
                    return 1;
                } else {
                    return rand.nextInt(0, 100) < randomFillPercent ? 1 : 0
                }
            }
        )
    );
}

function smoothMap(map, times) {
    for (let i = 0; i < times; i++) {
        let index = cells[cellIndex++];

        let i = (index % (mapWidth - 2)) + 1;
        let j = Math.floor((index / mapWidth) - 2) + 1;

        let wallCount = getWallCount(map, i, j);
        if (wallCount < 4) {
            map[i][j] = 0;
        } else if (wallCount > 4) {
            map[i][j] = 1;
        }

        if(cellIndex >= cells.length) {
            cellIndex = 0;
            frame++;
        }
    }
}

function getWallCount(map, x, y) {
    let count = 0;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i === x && j === y) {
                continue;
            }
            count += map[i][j];
        }
    }
    return count;
}

