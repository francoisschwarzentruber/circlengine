export function randomAmplitude(a) { return (Math.random() - 0.5) * a; }

export function randomColor(r, g, b, AMPLI = 128) {
    const minmax = (v) => Math.min(255, Math.max(v, 0));
    return `rgb(${minmax(r + randomAmplitude(AMPLI))}, ${minmax(g + randomAmplitude(AMPLI))}, ${minmax(b + randomAmplitude(AMPLI), 0)})`
}

export function randomColorAlpha(r, g, b, a, AMPLI = 128) {
    const minmax = (v) => Math.min(255, Math.max(v, 0));
    return `rgba(${minmax(r + randomAmplitude(AMPLI))}, ${minmax(g + randomAmplitude(AMPLI))},  ${minmax(b + randomAmplitude(AMPLI), 0)}, ${a})`
}