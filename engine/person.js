import Engine from "./core.js";

Engine.addRule((X) => {
    if (X.person) {
        X.disk = true;
        X.solid = true;
        X.radius = 32;
        X.eye1 = { eye: true, position: { x: 0, y: 0 } };
        X.eye2 = { eye: true, position: { x: 0, y: 0 } };
        X.eye1.position.y = X.position.y - 12;
        X.eye2.position.y = X.position.y - 12;
        if (X.direction.x == 1 && X.direction.y == 0) {
            X.eye1.direction = X.direction;
            X.eye1.position.x = X.position.x + 16;
            X.eye2 = undefined;
        }
        else if (X.direction.x == -1 && X.direction.y == 0) {
            X.eye1.direction = X.direction;
            X.eye1.position.x = X.position.x - 16;
            X.eye2 = undefined;
        }
        else if (X.direction.x == 0 && X.direction.y == -1) {
            X.eye1 = undefined;
            X.eye2 = undefined;
        }
        else {
            X.eye1.position.x = X.position.x + 12;
            X.eye1.direction = X.direction;
            X.eye2.position.x = X.position.x - 12;
            X.eye2.direction = X.direction;

        }
    }

});

Engine.addRule((X) => {
    if (X.eye) {
        X.disk = true;
        X.color = "white";
        X.radius = 8;
        X.eyeinside = { disk: true, position: { x: X.position.x + 4 * X.direction.x, y: X.position.y + 4 * X.direction.y }, radius: 4, color: "black" };
    }

});