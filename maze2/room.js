export default class Room {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._east = true;
        this._south = true;
        this._visited = false;
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

    walls(tileSize) {
        let walls = [];

        //east
        let x = 5 + tileSize + (tileSize * this._x);
        let y1 = 5 + (tileSize * this._y);
        let y2 = y1 + tileSize;
        walls.push([x, y1, x, y2]);

        //south
        let y = 5 + tileSize + (tileSize * this._y);
        let x1 = 5 + (tileSize * this._x);
        let x2 = x1 + tileSize;
        walls.push([x1, y, x2, y]);

        return walls;
    }

    draw(tileSize) {
        let walls = this.walls(tileSize);
        if (this._east) {
            let wall = walls[0];
            line(wall[0], wall[1], wall[2], wall[3]);
        }
        if (this._south) {
            let wall = walls[1];
            line(wall[0], wall[1], wall[2], wall[3]);
        }
    }
}
