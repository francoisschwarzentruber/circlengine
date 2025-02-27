function* DFS(node) {
    if (node instanceof Object) {
        yield node;
        for (const attr in node)
            if (node[attr] != undefined)
                yield* DFS(node[attr]);
    }
}





const rules1 = [];
const rules2 = [];
const rulesS = [];
const rulesGlobal = [];

export default class Engine {
    static data = {};

    static addRule(f) {
        const str = f.toString();

        if (str.startsWith("(X)"))
            rules1.push(f);
        else if (str.startsWith("(X, G)"))
            rules1.push(f);
        else if (str.startsWith("(G)") || str.startsWith("()"))
            rulesGlobal.push(f);
        /* else if (str.startsWith("(X, Y)"))
             rules2.push(f);
         else if (str.startsWith("(X, Y, G)"))
             rules2.push(f);*/
        else
            console.error("signature of a rule unclear");
    }

    static newId() {
        return Math.floor(Math.random() * 1000000);
    }


    static some(predicate) {
        for (const Y of DFS(Engine.data))
            if (predicate(Y))
                return true;
        return false;
    }

    
    static get objects() {
        return DFS(Engine.data);
    }

}


window.data = Engine.data;

function step() {
    for (const r of rulesGlobal)
        r(Engine.data);

    for (const r of rules1) {
        const gen = DFS(Engine.data);
        for (const X of gen) {
            r(X, Engine.data)
        }
    }

    for (const r of rules2) {
        for (const X of DFS(Engine.data))
            for (const Y of DFS(Engine.data)) {
                r(X, Y, Engine.data);
            }
    }

}

const ctx = canvas.getContext("2d");
function animate() {
    ctx.resetTransform();
    ctx.clearRect(0, 0, 640, 480);
    requestAnimationFrame(animate);
    step();
}

animate();


