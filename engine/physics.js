
export function intersects(o1, o2) { return Geometry.distance(o1, o2) < o1.r + o2.r; }
export function isInside(o1, o2) { return Geometry.distance(o1, o2) < o2.r - (o1.r ? o1.r : 0); }

export function ensurePositionInside(o1, collection) {
    if (Array.from(collection).filter((b) => isInside(o1, b)).length > 0)
        return;
    const cI = Array.from(collection).filter((b) => intersects(o1, b));

    if (cI.length == 0)
        return; //too bad

    if (cI.length > 1)
        return;

    const o2 = cI[0];
    const angle = Math.atan2(o1.position.y - o2.position.y, o1.position.x - o2.position.x);
    const dr = o2.r - o1.r;
    o1.position = { x: o2.position.x + dr * Math.cos(angle), y: o2.position.y + dr * Math.sin(angle) }

}




export class Geometry {
    static pointFromRadiusAngle(r, a) {
        return { x: r * Math.cos(a), y: r * Math.sin(a) };
    }
    static pointFromCenterRadiusAngle(cx, cy, r, a) {
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    }

    static angleBetween(o1, o2) {
        return Math.atan2(o2.y - o1.y, o2.x - o1.x)
    }

    static add(v, v2) { return { x: v.x + v2.x, y: v.y + v2.y }; }

    static norm(v) {
        return Math.sqrt((v.x) ** 2 + (v.y) ** 2);
    }

    static normalize(v) {
        const d = Geometry.norm(v);
        return { x: v.x / d, y: v.y / d };
    }
    static distance(a, b) {
        if (a.position)
            a = a.position;
        if (b.position)
            b = b.position;
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }


    static randomPointIn(obj) {
        if (obj.x != undefined) {
            const r = Math.random() * obj.r;
            const a = Math.random() * 2 * Math.PI;
            return { x: obj.x + r * Math.cos(a), y: obj.y + r * Math.sin(a) };
        }
        else {
            const A = Array.from(obj);
            return this.randomPointIn(A[Math.floor(Math.random() * A.length)]);
        }
    }



    static randomPointBorder(obj, extraRadius = 12) {
        if (obj.x != undefined) {
            const a = Math.random() * 2 * Math.PI;
            const r = obj.r + extraRadius;
            return { x: obj.x + r * Math.cos(a), y: obj.y + r * Math.sin(a) };
        }
        else {
            const A = Array.from(obj);

            while (true) {
                const pt = this.randomPointBorder(A[Math.floor(Math.random() * A.length)]);
                if (A.filter((o) => isInside(pt, o)).length <= 1)
                    return pt;
            }
        }
    }



    /**
 * 
 * @param {*} generatorFunction 
 * @param {*} obj
 * @returns a point generated by the generatorFunction but which is far from obj 
 */
    static generateFar(generatorFunction, obj, minDist = 64) {
        let pt = undefined;
        for (let i = 0; i < 20; i++) {
            const newpt = generatorFunction();
            const newd = (obj.x != undefined) ? Geometry.distance(newpt, obj) :
                Math.min(...Array.from(obj).map((o) => Geometry.distance(newpt, o)));
            if (newd > minDist) {
                return pt;
            }
        }
        return pt;
    }

    /**
     * 
     * @param {*} generatorFunction 
     * @param {*} obj
     * @returns a point generated by the generatorFunction but which is far from obj 
     */
    static generateFarest(generatorFunction, obj) {
        let d = 0;
        let pt = undefined;
        const nbAttempts = 50;
        for (let i = 0; i < nbAttempts; i++) {
            const newpt = generatorFunction();
            const newd = (obj.x != undefined) ?
                Geometry.distance(newpt, obj)
                : Math.min(...Array.from(obj).map((o) => Geometry.distance(newpt, o)));
            if (newd > d) {
                d = newd;
                pt = newpt;
            }
        }
        return pt;
    }



    static generateSuchthat(generatorFunction, condition) {
        let d = 0;
        let pt = undefined;
        const nbAttempts = 500;

        for (let i = 0; i < nbAttempts; i++) {
            pt = generatorFunction();
            if (condition(pt))
                return pt;
        }
        return pt;
    }

    /**
     * 
     * @param {*} region 
     * @returns true if the region is connected (we can go from any point to any point)
     */
    static isConnectedRegion(region) {
        const V = Array.from(region);
        console.log(V)
        const seen = [];

        function explore(u) {
            console.log("explore: ", u)
            seen[u] = true;
            for (let i = 0; i < V.length; i++)
                if (!seen[i] && intersects(V[u], V[i]))
                    explore(i);
        }
        explore(0);
        return V.every((u, i) => seen[i]);
    }

}

export function moveOutside(o1, o2) {
    const d = Geometry.distance(o1, o2);
    const dr = d - o1.r - o2.r;
    const angle = Math.atan2(o1.position.y - o2.position.y, o1.position.x - o2.position.x);
    o1.position = { x: o1.position.x - dr * Math.cos(angle), y: o1.position.y - dr * Math.sin(angle) }
}


export function bounce(o1, o2) {
    const SPEED = 1;
    const d = Geometry.distance(o1, o2);
    const dr = d - o1.r - o2.r;
    const angle = Math.atan2(o1.position.y - o2.position.y, o1.position.x - o2.position.x);
    o1.position = { x: o1.position.x - dr * Math.cos(angle), y: o1.position.y - dr * Math.sin(angle) }
    o1.speed = { x: SPEED * Math.cos(angle), y: SPEED * Math.sin(angle) }
}



