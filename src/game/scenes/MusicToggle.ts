import { GameObjects } from "phaser";
import { EventBus } from "../EventBus";
//import { MusicButton } from "../UIComponents/UIButton";

export class MusicToggle extends Phaser.Scene {
    music:
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound
        | Phaser.Sound.WebAudioSound;
    musicButton: GameObjects.Image;

    constructor() {
        super({ key: "MusicToggle", active: true });
    }

    preload() {
        this.load.image("button", "./assets/btn-grey.png");
        this.load.image("musicOn", "./assets/volume.png");
        this.load.image("musicOff", "./assets/mute.png");
        this.load.audio("bgm", "./assets/sounds/metal.m4a");
    }

    create() {
        //this.musicToggle = new MusicButton(this, 980, 40, () => {});

        this.musicButton = this.add.image(980, 40, 'musicOn').setScale(0.1).setDepth(100)

        this.musicButton.setInteractive().setDepth(100)
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.musicButton.setTint(0xdedede);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.musicButton.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.musicButton.setTint(0x8afbff);
                EventBus.emit('toggleMusic'); //When clicked the event will start
                this.updateButtonImage(); //calls the function 
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.musicButton.setTint(0xffffff);
            });

        
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
    updateButtonImage(){
        const musicEnabled = this.registry.get('musicEnabled');
        this.musicButton.setTexture( musicEnabled ? 'musicOn' : 'musicOff' );
    }
}

