export default class Ray {

    constructor(x, y, angle) {
        this.angle = angle;

        this.p0 = createVector(x, y);
        this.p1 = p5.Vector.fromAngle(radians(angle), 150);
        this.p1 = p5.Vector.add(this.p1, this.p0);
    }

    setMouse(mouse) {
        this.angle += 0.1;
        this.p0 = mouse;
        this.p1 = p5.Vector.fromAngle(radians(this.angle), 150);
        this.p1 = p5.Vector.add(this.p1, this.p0);
    }

    draw() {
        stroke('yellow');
        line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
    }

}