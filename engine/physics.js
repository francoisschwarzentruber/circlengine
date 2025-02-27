import Engine from "./core.js";
import { intersects, moveOutside, bounce } from "./physicsHelper.js";


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

//Engine.addRule((X) => X.onground = Engine.some((Y) => Y.solid && Y.fixed && intersects(X, Y) && (X.position.y < Y.position.y)));


Engine.addRule(() => {
    for (const X of Engine.objects)
        if (X.solid && !X.fixed)
            for (const Y of Engine.objects)
                if (X != Y)
                    if (Y.solid && Y.fixed && intersects(X, Y)) {
                        moveOutside(X, Y);
                    }
});

Engine.addRule(() => {
    for (const X of Engine.objects)
        if (X.solid && !X.fixed)
            for (const Y of Engine.objects)
                if (X != Y)
                    if (Y.solid && !Y.fixed && intersects(X, Y)) {
                        bounce(X, Y);
                    }
});
