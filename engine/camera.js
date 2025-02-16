import Engine from "./core.js";
const ctx = canvas.getContext("2d");


Engine.addRule((G) => {
    if(G.camera)
    if (G.camera.follows) {
        let p = G.camera.follows;
        ctx.translate(-p.x + 320, -p.y + 240);
    }
});