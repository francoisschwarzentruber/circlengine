import Engine from "./core.js";

Engine.data.SCENE_CIRCLEENGINE_LOGO = Engine.newId();

Engine.addRule((G) => {
    if (G.scene.sceneName == G.SCENE_CIRCLEENGINE_LOGO)
        return;

    if (G.sceneName == G.SCENE_CIRCLEENGINE_LOGO) {
        G.scene = {};
        G.scene.sceneName = G.SCENE_CIRCLEENGINE_LOGO;
        G.scene.d = { disk: true, position: { x: 240, y: 240 }, radius: 0, color: "white" };
        G.scene.t = { text: "Circle engine", position: { x: 280, y: 240 }, color: "white" };
    }
});


Engine.addRule((X, G) => {
    if (G.sceneName == G.SCENE_CIRCLEENGINE_LOGO)
        if (X.disk) {
            X.radius = Math.min(32, X.radius + 1);
        }
});


