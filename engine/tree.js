import Engine from "./core.js";
const ctx = canvas.getContext("2d");


Engine.addRule((X) => {
    if (X.tree) {
        if (!X.trunk)
            X.trunk = { disk: true, position: X.position, radius: 24, color: "brown", solid: true, fixed: true };
        if (!X.theta)
            X.theta = 2 * Math.random();
        X.theta += Math.random() / 10;
        X.leaves = {
            disk: true, position: {
                x: X.position.x + 5 * Math.cos(X.theta),
                y: X.position.y - 40 + 5 * Math.sin(X.theta)
            }, z: 1, radius: 48, color: "#008800DD"
        };
    };

}
);