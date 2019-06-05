import Random from '../util/prng.js';
import Room from './room.js';

window.setup = setup;
window.windowResized = windowResized;
window.draw = draw;

const rand = new Random(performance.now());
const tileSize = 8;

let _map;

let _tilesWide;
let _tilesHigh;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();

    init();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    init();
}

function init() {
    clear();
    _tilesWide = Math.floor((windowWidth) / tileSize) - 1;
    _tilesHigh = Math.floor((windowHeight) / tileSize) - 1;
    _map = emptyMap();
    generateTile(0, 0);
}

function draw() {
    strokeWeight(3);
    stroke(55);

    //top and left
    let x2 = 5 + (tileSize * _tilesWide);
    let y2 = 5 + (tileSize * _tilesHigh);
    line(5, 5, x2, 5); //top
    line(5, 5, 5, y2); //left
    line(x2, y2, 5, y2); //bottom
    line(x2, y2, x2, 5); //right

    //draw walls
    for (let i = 0; i < _tilesWide; i++) {
        for (let j = 0; j < _tilesHigh; j++) {
            _map[i][j].draw(tileSize);
        }
    }

    //rays


}

function emptyMap() {
    return new Array(_tilesWide).fill().map(
        (x, xi) => new Array(_tilesHigh).fill().map(
            (y, yi) => new Room(xi, yi)
        )
    );
}

function generateTile(x, y) {
    _map[x][y].visit();
    let neighbors = ['n', 's', 'e', 'w'];

    while (neighbors.length > 0) {
        let i = rand.nextInt(0, neighbors.length);
        switch (neighbors.splice(i, 1)[0]) {
            case 'n':
                if (y - 1 >= 0) {
                    if (!_map[x][y - 1].visited()) {
                        _map[x][y - 1].south(false);
                        generateTile(x, y - 1);
                    }
                }
                break;
            case 's':
                if (y + 1 < _tilesHigh) {
                    if (!_map[x][y + 1].visited()) {
                        _map[x][y].south(false);
                        generateTile(x, y + 1);
                    }
                }
                break;
            case 'e':
                if (x + 1 < _tilesWide) {
                    if (!_map[x + 1][y].visited()) {
                        _map[x][y].east(false);
                        generateTile(x + 1, y);
                    }
                }
                break;
            case'w':
                if (x - 1 >= 0) {
                    if (!_map[x - 1][y].visited()) {
                        _map[x - 1][y].east(false);
                        generateTile(x - 1, y);
                    }
                }
                break;
        }
    }

}

