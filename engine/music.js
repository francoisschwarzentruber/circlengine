export class Music {

    static music = undefined;
    static play(name) {
        if (this.music) {
            this.music.stop();
        }
        this.music = new Audio('/music/' + name);
        this.music.play();

    }
}