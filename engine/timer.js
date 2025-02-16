import Engine from "./core.js";


Engine.addRule((X) => {
    if (X.timer) {
        X.timer--;
    }
});