
export default class Room {

    constructor(x, y, tileSize) {
        this._pos = createVector(x, y);
        this._tileSize = tileSize;
        this._east = true;
        this._south = true;
        this._visited = false;
        this._neighbors = ['n', 's', 'e', 'w'];
        this._walls = this.generateWalls(tileSize);
    }

    pos() {
        return this._pos;
    }

    east(east) {
        this._east = east;
    }

    south(south) {
        this._south = south;
    }

    visit() {
        this._visited = true;
    }

    visited() {
        return this._visited;
    }

    neighbors() {
        return this._neighbors;
    }

    walls() {
        let walls = [];
        if (this._east) {
            walls.push(this._walls.east);
        }
        if (this._south) {
            walls.push(this._walls.south);
        }
        return walls;
    }

    draw() {
        let walls = this._walls;
        if (this._east) {
            line(walls.east.p0.x, walls.east.p0.y, walls.east.p1.x, walls.east.p1.y);
        }
        if (this._south) {
            line(walls.south.p0.x, walls.south.p0.y, walls.south.p1.x, walls.south.p1.y);
        }
    }

    generateWalls(tileSize) {
        let walls = {};

        //east
        let x = 5 + tileSize + (tileSize * this._pos.x);
        let y1 = 5 + (tileSize * this._pos.y);
        let y2 = y1 + tileSize;
        walls.east = {
            p0: createVector(x, y1),
            p1: createVector(x, y2)
        };

        //south
        let y = 5 + tileSize + (tileSize * this._pos.y);
        let x1 = 5 + (tileSize * this._pos.x);
        let x2 = x1 + tileSize;
        walls.south = {
            p0: createVector(x1, y),
            p1: createVector(x2, y)
        };

        return walls;
    }
}
