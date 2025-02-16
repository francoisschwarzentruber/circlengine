
/**
 * sound
 */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export class Sound {
    static sounds = [];

    static playfreq(freq, duration) {
        console.log(audioCtx)
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.set
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        setInterval(() => oscillator.stop(), duration);
        return oscillator;
    }

    static play(name) {
        this.sounds[name] = new Audio('./sounds/' + name);
        this.sounds[name].play();

    }

    static playIfNot(name) {
        if (this.sounds[name] == undefined)
            this.sounds[name] = new Audio('./sounds/' + name);

        if (this.sounds[name].paused) {
            this.sounds[name].play();

        }


    }
}
