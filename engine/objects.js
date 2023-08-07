import { randomAmplitude } from "./random.js";
import { Game } from "./core.js";

export class PhysicalObject {
    position;
    speed;

    constructor(x, y, z) {
        this.beginningTime = Date.now();
        this.z = z ? z : 0;
        this.position = { x: x, y: y };
        this.speed = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };

        this.RATIO = 0.5;
    }

    handlePhysics() {
        this.speed.x += this.acceleration.x;
        this.speed.y += this.acceleration.y;

        this.position = {
            x: this.position.x + this.speed.x,
            y: this.position.y + this.speed.y
        };
        this.speed.x = this.RATIO * this.speed.x;
        this.speed.y = this.RATIO * this.speed.y;
    }

    get time() { return Date.now() - this.beginningTime }

    delete() {
        this.isDeleted = true;
    }
}


export class Circle extends PhysicalObject {
    constructor(option) {
        super(option.x, option.y, option.z);
        Object.assign(this, option);
    }

    _live() {
        super.handlePhysics();
        if (this.live)
            this.live();
    }



    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.disk(this.position.x, this.position.y, this.r);
        if (this.stroke) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.stroke;
            ctx.stroke();
        }
    }
}

export class Particule extends Circle {
    constructor(option) {
        if (option.r == undefined)
            option.r = 2;
        const sx = randomAmplitude(0.5);
        const sy = 0.7 + randomAmplitude(0.5);
        const sy2 = 0.7 + randomAmplitude(0.5);
        option.live = () => {
            const t = this.time;
            if (t <= 1000) {
                this.speed.x = sx;
                if (t < 500)
                    this.speed.y = -sy;
                else
                    this.speed.y = sy2;

            }
            else
                this.delete();
        }
        super(option);

    }
}




export class MisterSaturn extends Circle {
    constructor({ x, y, color = "yellow", noiseColor = "orange" }) {
        super({
            x, y, z: 0, color, r: 16,
            pv: 3, coin: 0,
        });
        this.direction = { x: 0, y: 1 };
        this.noiseColor = noiseColor;
    }

    draw(ctx) {
        const t = this.time;
        function drawEye(x, y) {
            ctx.fillStyle = "white";
            ctx.disk(x, y, 6);
            ctx.fillStyle = "black";
            ctx.disk(x + Math.cos(t / 300), y + Math.sin(t / 300), 3);
        }

        const drawNoise = (x, y) => {
            ctx.fillStyle = this.noiseColor;
            ctx.disk(x, y, 5);
        }


        const drawFeet = (x, y, r) => {
            ctx.fillStyle = this.noiseColor;
            ctx.disk(x, y, r);
        }

        const s = Math.abs(this.direction.x) > 0 ? 5 * Math.abs(this.speed.x) : Math.abs(this.speed.y);
        const F = 0.015;

        if (Math.abs(this.direction.x) > 0) {
            drawFeet(this.position.x - s * Math.cos(this.time * F), this.position.y + 14 + s / 10 * Math.sin(this.time * F), 4);
        }

        if (Math.abs(this.direction.y) > 0) {
            drawFeet(this.position.x - 6, this.position.y + 14 + s * Math.sin(this.time * F), 4);
            drawFeet(this.position.x + 6, this.position.y + 14 - s * Math.sin(this.time * F), 4);
        }

        super.draw(ctx);

        if (this.direction.y >= 0) {
            if (this.direction.x <= 0) {
                drawEye(this.position.x - 5, this.position.y - 5);
            }
            if (this.direction.x >= 0) {
                drawEye(this.position.x + 5, this.position.y - 5);
            }
            drawNoise(this.position.x + this.direction.x * 16, this.position.y);

        }




        if (Math.abs(this.direction.x) > 0) {
            drawFeet(this.position.x + s * Math.cos(this.time * F), this.position.y + 14 + s / 10 * Math.sin(this.time * F), 4);
        }



    }

    go(d) {
        const speed = 2;
        this.direction = d;
        this.speed = { x: speed * d.x, y: speed * d.y };
    }
    left() { this.go({ x: -1, y: 0 }); }
    right() { this.go({ x: 1, y: 0 }); }
    up() { this.go({ x: 0, y: -1 }); }
    down() { this.go({ x: 0, y: 1 }); }

}