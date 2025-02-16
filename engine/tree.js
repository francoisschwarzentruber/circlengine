import Engine from "./core.js";
const ctx = canvas.getContext("2d");


Engine.addRule((X) => {
    if (X.tree) {
        X.disk = true;
        X.trunk = { disk: true, position: X.position, radius: 24, color: "brown", solid: true, fixed: true };
        X.leaves = { disk: true, position: { x: X.position.x, y: X.position.y - 40 }, z: 1, radius: 48, color: "green" };
    };

}
);