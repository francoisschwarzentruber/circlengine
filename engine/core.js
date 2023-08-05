import Input from "./input.js";

const ctx = canvas.getContext("2d");
const beginningTime = Date.now();



export class Scene {

    constructor() {
        this.beginningTime = Date.now();
    }

    objects = [];
    cameraFollows = undefined;
    drawFixed(ctx) { }

    draw(ctx) {
        ctx.resetTransform();
        ctx.clearRect(0, 0, 640, 480);

        if (this.cameraFollows)
            ctx.translate(-this.cameraFollows.position.x + 320, -this.cameraFollows.position.y + 240);

        this.objects.sort((o1, o2) => (o1.z > o2.z || ((o1.z == o2.z) && (o1.position.y > o2.position.y)) ? 1 : -1));

        if (!Game.isPause)
            for (const o of this.objects) o._live(ctx);
        for (const o of this.objects) o.draw(ctx);

        for (const o of this.objects)
            if (o.isDeleted)
                this.delete(o);

    }


    cameraAttach(o) {
        this.cameraFollows = o;
    }

    live() { }

    get time() { return Date.now() - this.beginningTime; }

    pause() {
        this.isPause = true;
    }

    groups = [];

    createGroup() {
        const G = new Set();
        this.groups.push(G);
        return G;
    }

    delete(obj) {
        this.objects.splice(this.objects.indexOf(obj), 1);
        for (const G of this.groups)
            G.delete(obj);
    }


    add(obj) {
        this.objects.push(obj);
    }
}

CanvasRenderingContext2D.prototype.clear = function () {
    this.clearRect(0, 0, 640, 480);
}

CanvasRenderingContext2D.prototype.point = function (x, y) {
    this.beginPath();
    this.arc(x, y, 1, 0, 2 * Math.PI);
    this.fill();
}

CanvasRenderingContext2D.prototype.circle = function (x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0, 2 * Math.PI);
}

CanvasRenderingContext2D.prototype.disk = function (x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0, 2 * Math.PI);
    this.fill();
}

CanvasRenderingContext2D.prototype.line = function (x1, y1, x2, y2) {
    this.beginPath();
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    this.stroke();
}



CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
}

CanvasRenderingContext2D.prototype.arrow = function (x, y, angle, S = 16, A = 0.3) {
    ctx.beginPath();
    ctx.moveTo(x - S * Math.cos(angle - A), y - S * Math.sin(angle - A));
    ctx.lineTo(x, y);
    ctx.lineTo(x - S * Math.cos(angle + A), y - S * Math.sin(angle + A));
}




export class GameOverScene extends Scene {
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.font = "bold 48px serif";
        ctx.fillText("Game over", 100, 200);
    }
}

export class TitleScene extends Scene {

    constructor(title, startFunction) {
        super();
        this.title = title;
        this.startFunction = startFunction;
    }

    live() {
        if (this.time > 500 && Input.isAction())
            this.startFunction();
    }
    draw(ctx) {
        ctx.clear();
        ctx.fillStyle = "white";
        ctx.font = "bold 48px sans serif";
        const lines = this.title.split('\n');
        for (let i = 0; i < lines.length; i++)
            ctx.fillText(lines[i], 100, 200 + i * 48);
        ctx.font = " 15px sans serif";
        ctx.fillText("Press enter to start", 250, 300);
    }
}


export class CircleEngineLogoScene extends Scene {
    constructor(future) {
        super();
        this.future = future;
    }

    live() {
        if (this.time > 500 && Input.isAction())
            this.future();
        if (this.time > 2000)
            this.future();
    }
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.disk(250, 240, Math.min(32, this.time * 0.05));

        ctx.font = "bold 32px sans serif";
        ctx.fillText("engine", 290, 250);
    }
}


export class Game {
    static setScene(scene) {
        Game.scene = scene;
    }
}


Game.setScene(new CircleEngineLogoScene(() => { }));


function animate() {
    requestAnimationFrame(animate);
    Game.scene.live();
    const ctx = canvas.getContext("2d")
    Game.scene.draw(ctx);
    ctx.resetTransform();
    Game.scene.drawFixed(ctx);
}

animate();









