import Engine from "./core.js";
import { intersects, moveOutside } from "./physicsHelper.js";


/****** acceleration and velocity */

const dt = 1;

Engine.addRule((X, G) => {
    if (X.acceleration == true)
        X.acceleration = { x: 0, y: 0 };

    if (X.acceleration)
        if (!X.velocity)
            X.velocity = { x: 0, y: 0 };

    if (X.velocity == true)
        X.velocity = { x: 0, y: 0 };

    if (X.acceleration) {
        X.velocity.x += dt * X.acceleration.x;
        X.velocity.y += dt * X.acceleration.y;
    }

    if (X.velocity) {
        X.position.x += dt * X.velocity.x;
        X.position.y += dt * X.velocity.y;
    }
});




/** gravity */

Engine.addRule((X) => {
    if (X.gravity) {
        X.acceleration = { x: 0, y: 0 };
    }
});

Engine.addRule((X) => {
    if (X.gravity) {
        X.acceleration.y += 1;
    }
});




/** collisions */


Engine.addRule((X, Y) => {
    if (X != Y)
        if (X.solid && !X.fixed && Y.solid && Y.fixed && intersects(X, Y)) {
            moveOutside(X, Y);
        }
});