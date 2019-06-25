
import Random from '../util/prng.js';
import Room from './room.js';
import Ray from './ray.js';

window.setup = setup;
window.windowResized = windowResized;
window.draw = draw;

const rand = new Random(performance.now());
const tileSize = 75;

let map;

let tilesWide;
let tilesHigh;

let rays = [];

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
    //frameRate(30);
    clear();
    tilesWide = Math.floor((windowWidth) / tileSize) - 1;
    tilesHigh = Math.floor((windowHeight) / tileSize) - 1;

    map = new Array(tilesWide).fill().map(
        (x, xi) => new Array(tilesHigh).fill().map(
            (y, yi) => new Room(xi, yi, tileSize)
        )
    );

    generateMaze();

    let count = 64;
    for(let i = 0; i < 360; i += 360 / count) {
        rays.push(new Ray(mouseX, mouseY, i));
    }
}

function draw() {
    clear();
    strokeWeight(4);
    stroke(0);

    //top and left
    let x2 = 5 + (tileSize * tilesWide);
    let y2 = 5 + (tileSize * tilesHigh);
    line(5, 5, x2, 5); //top
    line(5, 5, 5, y2); //left

    let playerX = 5;
    let playerY = 5;
    let viewDistance = 20;

    //draw walls
    let walls = [];
    walls.push({p0: createVector(5, 5), p1: createVector(x2, 5)});
    walls.push({p0: createVector(5, 5), p1: createVector(5, y2)});

    for (let i = 0; i < tilesWide; i++) {
        for (let j = 0; j < tilesHigh; j++) {
            map[i][j].draw();

            if (i - viewDistance <= playerX
                && i + viewDistance >= playerX
                && j - viewDistance <= playerY
                && j + viewDistance >= playerY) {
                walls = walls.concat(map[i][j].walls());
            }
        }
    }

    //find first wall vector hits
    let mouse = createVector(mouseX, mouseY);
    rays.forEach(ray => {
        ray.setMouse(mouse);
        walls.forEach(wall => {
            let p1 = ray.p0;
            let p2 = ray.p1;
            let p3 = wall.p0;
            let p4 = wall.p1;

            let nomA = ((p3.y - p4.y)) * (p1.x - p3.x) + ((p4.x - p3.x) * (p1.y - p3.y));
            let denomA = ((p4.x - p3.x) * (p1.y - p2.y)) - ((p1.x - p2.x) * (p4.y - p3.y));

            let nomB = ((p1.y - p2.y)) * (p1.x - p3.x) + ((p2.x - p1.x) * (p1.y - p3.y));
            let denomB = ((p4.x - p3.x) * (p1.y - p2.y)) - ((p1.x - p2.x) * (p4.y - p3.y));

            if (denomB === 0) {
                return;
            }

            let tA = nomA / denomA;
            let tB = nomB / denomB;
            if (tA >= 0
                && tA < 1
                && tB >= 0
                && tB <= 1) {
                let x = p1.x + (tA * (p2.x - p1.x));
                let y = p1.y + (tA * (p2.y - p1.y));

                ray.p1 = createVector(x, y);
            }
        })
    });

    rays.forEach(ray => ray.draw());
}

function generateMaze() {
    let stack = [];
    stack.push(map[0][0]);

    while (stack.length > 0) {
        let room = stack[stack.length - 1];
        let neighbors = room.neighbors();

        if (neighbors.length === 0) {
            stack.pop();
            continue;
        }

        room.visit();

        let i = rand.nextInt(0, neighbors.length);
        let x = room.pos().x;
        let y = room.pos().y;

        switch (neighbors.splice(i, 1)[0]) {
            case 'n':
                if (y - 1 >= 0) {
                    if (!map[x][y - 1].visited()) {
                        map[x][y - 1].south(false);
                        stack.push(map[x][y - 1]);
                    }
                }
                break;
            case 's':
                if (y + 1 < tilesHigh) {
                    if (!map[x][y + 1].visited()) {
                        room.south(false);
                        stack.push(map[x][y + 1]);
                    }
                }
                break;
            case 'e':
                if (x + 1 < tilesWide) {
                    if (!map[x + 1][y].visited()) {
                        room.east(false);
                        stack.push(map[x + 1][y]);
                    }
                }
                break;
            case'w':
                if (x - 1 >= 0) {
                    if (!map[x - 1][y].visited()) {
                        map[x - 1][y].east(false);
                        stack.push(map[x - 1][y]);
                    }
                }
                break;
        }
    }
}
