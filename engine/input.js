/**
 * CONTROLLING VIA KEYBOARD, NIPPLEJS and GAMEPAD
 */

import Engine from "./core.js";

Engine.data.keyboard = {};

export default class Input {
    static keys = [];

    static isAction() { return Input.keys[" "]; }

    static dispatch() {
        Engine.data.keyboard.left = Input.keys["ArrowLeft"];
        Engine.data.keyboard.up = Input.keys["ArrowUp"];
        Engine.data.keyboard.down = Input.keys["ArrowDown"];
        Engine.data.keyboard.right = Input.keys["ArrowRight"];
        Engine.data.keyboard.action = Input.keys[" "];
    }
}


window.onkeydown = (evt) => { Input.keys[evt.key] = true; Input.dispatch(); }
window.onkeyup = (evt) => { Input.keys[evt.key] = false; Input.dispatch(); }



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
        // console.log(nipple.angle.degree)
        const THRESHOLD = 32;
        Input.keys["ArrowUp"] = (Math.abs(nipple.angle.degree - 90) < THRESHOLD);
        Input.keys["ArrowDown"] = (Math.abs(nipple.angle.degree - 270) < THRESHOLD);
        Input.keys["ArrowLeft"] = (Math.abs(nipple.angle.degree - 180) < THRESHOLD);
        Input.keys["ArrowRight"] = (Math.abs(nipple.angle.degree - 0) < THRESHOLD) || (Math.abs(nipple.angle.degree - 360) < THRESHOLD);
        Input.dispatch();
    });
    s.on("end", (evt, nipple) => {
        Input.keys["ArrowUp"] = false;
        Input.keys["ArrowDown"] = false;
        Input.keys["ArrowLeft"] = false;
        Input.keys["ArrowRight"] = false;
        Input.dispatch();
    });

    elementButton.onmousedown = () => Input.keys[" "] = true;
    elementButton.onmouseup = () => Input.keys[" "] = false;

    elementButton.ontouchstart = () => Input.keys[" "] = true;
    elementButton.ontouchend = () => Input.keys[" "] = false;
}
catch (e) {
    alert(e)
}



requestAnimationFrame(
    () => {
        const gamepads = navigator.getGamepads();
        if (gamepads.length == 0) return;
        const gamepad = gamepads[0];

        Input.keys[" "] = gamepad.buttons[0].pressed;
        Input.dispatch();
    }
);


window.addEventListener("gamepaddisconnected", () => { });
