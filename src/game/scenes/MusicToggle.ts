import { EventBus } from "../EventBus";
import { MusicButton } from "../UIComponents/UIButton";

export class MusicToggle extends Phaser.Scene {
    musicToggle: MusicButton;
    music:
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound
        | Phaser.Sound.WebAudioSound;

    constructor() {
        super({ key: "MusicToggle", active: true });
    }

    preload() {
        this.load.image("button", "./assets/btn-grey.png");
        this.load.image("musicOn", "./assets/volume.png");
        this.load.image("musicOff", "./assets/mute.png");
        //this.load.audio("bgm", "./assets/sounds/metal.m4a");
    }

    create() {
        this.musicToggle = new MusicButton(this, 980, 40, () => {});

        if (!this.registry.has("musicEnabled")) {
            this.registry.set("musicEnabled", true);
            this.music = this.sound.add("bgm", { loop: true });
            this.music.play();
        } else {
            this.music = this.sound.add("bgm");
            this.music.play();
            this.music.pause();
            if (this.registry.get("musicEnabled")) {
                this.music.resume();
            }
        }

        //Event where the music is toggled on/off
        EventBus.on(
            "toggleMusic",
            () => {
                console.log("Music Toggle Clicked");
                const musicEnabled = !this.registry.get("musicEnabled");
                this.registry.set("musicEnabled", musicEnabled);

                if (musicEnabled) {
                    this.music.resume();
                } else {
                    this.music.pause();
                }
            },
            this
        );
    }
}

