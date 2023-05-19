/**
 * CONTROLLING VIA KEYBOARD, NIPPLEJS and GAMEPAD
 */


window.onkeydown = (evt) => Game.keys[evt.key] = true;
window.onkeyup = (evt) => Game.keys[evt.key] = false;

try {
    const elementNippleJS = document.createElement("div");
    elementNippleJS.style.width = "50%";
    elementNippleJS.style.height = "100%";
    elementNippleJS.style.position = "absolute";
    document.body.appendChild(elementNippleJS);

    const elementButton = document.createElement("div");
    elementButton.style.width = "50%";
    elementButton.style.left = "50%";
    elementButton.style.height = "100%";
    elementButton.style.position = "absolute";
    document.body.appendChild(elementButton);

    let s = nipplejs.create({
        zone: elementNippleJS,
        mode: 'dynamic',
        position: { left: '50%', top: '50%' },
        color: 'red'
    });

    s.on("move", (evt, nipple) => {
        console.log(nipple.angle.degree)
        const THRESHOLD = 32;
        Game.keys["ArrowUp"] = (Math.abs(nipple.angle.degree - 90) < THRESHOLD);
        Game.keys["ArrowDown"] = (Math.abs(nipple.angle.degree - 270) < THRESHOLD);
        Game.keys["ArrowLeft"] = (Math.abs(nipple.angle.degree - 180) < THRESHOLD);
        Game.keys["ArrowRight"] = (Math.abs(nipple.angle.degree - 0) < THRESHOLD) || (Math.abs(nipple.angle.degree - 360) < THRESHOLD);
    });
    s.on("end", (evt, nipple) => {
        Game.keys["ArrowUp"] = false;
        Game.keys["ArrowDown"] = false;
        Game.keys["ArrowLeft"] = false;
        Game.keys["ArrowRight"] = false;
    });

    elementButton.onmousedown = () => Game.keys[" "] = true;
    elementButton.onmouseup = () => Game.keys[" "] = false;

    elementButton.ontouchstart = () => Game.keys[" "] = true;
    elementButton.ontouchend = () => Game.keys[" "] = false;
}
catch (e) {
    alert(e)
}


requestAnimationFrame(
    () => {
        const gamepads = navigator.getGamepads();
        if (gamepads.length == 0) return;
        const gamepad = gamepads[0];

        Game.keys[" "] = gamepad.buttons[0].pressed;
    }
);


window.addEventListener("gamepaddisconnected", () => { });

const ctx = canvas.getContext("2d");
const beginningTime = Date.now();

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
        Game.objects.push(this);
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

    delete() { Game.objects.splice(Game.objects.indexOf(this), 1); }
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

export default class Game {
    static keys = [];
    static objects = [];
    static cameraFollows = undefined;
    static drawFixed = (ctx) => { };

    static _draw = () => {
        ctx.resetTransform();
        ctx.clearRect(0, 0, 640, 480);

        if (Game.cameraFollows)
            ctx.translate(-Game.cameraFollows.position.x + 320, -Game.cameraFollows.position.y + 240);

        Game.objects.sort((o1, o2) => (o1.z > o2.z || ((o1.z == o2.z) && (o1.position.y > o2.position.y))));

        if (!Game.isPause)
            for (const o of Game.objects) o._live(ctx);
        for (const o of Game.objects) o.draw(ctx);

        ctx.resetTransform();
        Game.drawFixed(ctx);
    }


    static reset() {
        Game.objects = []
    }
    static cameraAttach(o) {
        Game.cameraFollows = o;
    }

    static live = () => { };

    static get time() { return Date.now() - beginningTime; }

    static pause() {
        Game.isPause = true;
    }
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

function animate() {
    requestAnimationFrame(animate);
    Game.live();
    Game._draw(ctx);
}

animate();






/**
 * sound
 */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export class Sound {
    static play(freq, duration) {
        console.log(audioCtx)
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.set
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        setInterval(() => oscillator.stop(), duration);
        return oscillator;
    }
}


export class Control {
    static isAction() { return keys[" "]; }

    static control2DCross(object) {
        if (Game.keys["ArrowLeft"])
            object.left();
        if (Game.keys["ArrowRight"])
            object.right();
        if (Game.keys["ArrowUp"])
            object.up();
        if (Game.keys["ArrowDown"])
            object.down();
        if (Game.keys[" "])
            object.action();
    }
}

export function intersects(o1, o2) { return Geometry.distance(o1, o2) < o1.r + o2.r; }
export function isInside(o1, o2) { return Geometry.distance(o1, o2) < o2.r - o1.r; }

export function ensurePositionInside(o1, collection) {
    if (Array.from(collection).filter((b) => isInside(o1, b)).length > 0)
        return;
    const cI = Array.from(collection).filter((b) => intersects(o1, b));

    if (cI.length == 0)
        return; //too bad

    if (cI.length > 1)
        return;

    const o2 = cI[0];
    const angle = Math.atan2(o1.position.y - o2.position.y, o1.position.x - o2.position.x);
    const dr = o2.r - o1.r;
    o1.position = { x: o2.position.x + dr * Math.cos(angle), y: o2.position.y + dr * Math.sin(angle) }

}




export class Geometry {
    static pointFromCenterRadiusAngle(cx, cy, r, a) {
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    }

    static angleBetween(o1, o2) {
        return Math.atan2(o2.position.y - o1.position.y, o2.position.x - o1.position.x)
    }

    static add(v, v2) {
        return { x: v.x + v2.x, y: v.y + v2.y };
    }



    static distance(a, b) {
        if (a.position) {
            return Math.sqrt((a.position.x - b.position.x) ** 2 + (a.position.y - b.position.y) ** 2);
        }
        else
            return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }


    static randomPointIn(obj) {
        if (obj instanceof Circle) {
            const r = Math.random() * obj.r;
            const a = Math.random() * 2 * Math.PI;
            return { x: obj.x + r * Math.cos(a), y: obj.y + r * Math.sin(a) };
        }
        else {
            const A = Array.from(obj);
            return this.randomPointIn(A[Math.floor(Math.random() * A.length)]);
        }
    }



    static randomPointBorder(obj, extraRadius = 12) {
        if (obj instanceof Circle) {
            const a = Math.random() * 2 * Math.PI;
            const r =  obj.r + extraRadius;
            return { x: obj.x + r * Math.cos(a), y: obj.y + r * Math.sin(a) };
        }
        else {
            const A = Array.from(obj);

            while(true) {
                const pt = this.randomPointBorder(A[Math.floor(Math.random() * A.length)]);
                return pt;
            }
        }
    }



        /**
     * 
     * @param {*} generatorFunction 
     * @param {*} obj
     * @returns a point generated by the generatorFunction but which is far from obj 
     */
        static generateFar(generatorFunction, obj, minDist = 64) {
            let pt = undefined;
            for (let i = 0; i < 10; i++) {
                const newpt = generatorFunction();
                const newd = (obj instanceof Circle) ? Geometry.distance(newpt, obj) : Math.min(...Array.from(obj).map((o) => Geometry.distance(newpt, o)));
                if (newd > minDist) {
                    return pt;
                }
            }
            return pt;
        }

    /**
     * 
     * @param {*} generatorFunction 
     * @param {*} obj
     * @returns a point generated by the generatorFunction but which is far from obj 
     */
    static generateFarest(generatorFunction, obj) {
        let d = 0;
        let pt = undefined;
        for (let i = 0; i < 10; i++) {
            const newpt = generatorFunction();
            const newd = (obj instanceof Circle) ? Geometry.distance(newpt, obj) : Math.min(...Array.from(obj).map((o) => Geometry.distance(newpt, o)));
            if (newd > d) {
                d = newd;
                pt = newpt;
            }
        }
        return pt;
    }



/**
 * 
 * @param {*} region 
 * @returns true if the region is connected (we can go from any point to any point)
 */
    static isConnectedRegion(region) {
        const V = Array.from(region);
        console.log(V)
        const seen = [];

        function explore(u) {
            console.log("explore: ", u)
            seen[u] = true;
            for (let i = 0; i < V.length; i++)
                if (!seen[i] && intersects(V[u], V[i]))
                    explore(i);
        }
        explore(0);
        return V.every((u, i) => seen[i]);
    }

}

export function moveOutside(o1, o2) {
    const d = Geometry.distance(o1, o2);
    const dr = d - o1.r - o2.r;
    const angle = Math.atan2(o1.position.y - o2.position.y, o1.position.x - o2.position.x);
    o1.position = { x: o1.position.x - dr * Math.cos(angle), y: o1.position.y - dr * Math.sin(angle) }
}


export function bounce(o1, o2) {
    const SPEED = 1;
    const d = Geometry.distance(o1, o2);
    const dr = d - o1.r - o2.r;
    const angle = Math.atan2(o1.position.y - o2.position.y, o1.position.x - o2.position.x);
    o1.position = { x: o1.position.x - dr * Math.cos(angle), y: o1.position.y - dr * Math.sin(angle) }
    o1.speed = { x: SPEED * Math.cos(angle), y: SPEED * Math.sin(angle) }
}






export function randomAmplitude(a) { return (Math.random() - 0.5) * a; }
export function randomColor(r, g, b) {
    const AMPLI = 128;
    const minmax = (v) => Math.min(255, Math.max(v, 0));
    return `rgb(${minmax(r + randomAmplitude(AMPLI))}, ${minmax(g + randomAmplitude(AMPLI))}, ${minmax(b + randomAmplitude(AMPLI), 0)})`
}