import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";

// This is basic button based on the Phaser textstyle.
// TODO: Refactor the UI Button component into Image-based.
// child classes should take image paramenter to make changes.
export class UIButton extends GameObjects.Sprite {
    constructor(
        scene: Scene, //current scene
        x: number, //position in x axis
        y: number, //position in y axis
        text: string, //name ng button
        callback: () => void //any function
    ) {
        super(scene, x, y, text);
        this.on("pointerdown", callback);

        scene.add.existing(this);
    }
}

export class PlayButton extends UIButton {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "button-rectangle", callback);
        scene.add.image(512, 470, 'play').setScale(0.2);

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.setTint(0x8afbff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
    }
}

export class AchievementsButton extends UIButton {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "button-rectangle", callback);
        scene.add.image(512, 595, 'achieve').setScale(0.35);

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.setTint(0x8afbff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
    }
}

export class MusicButton extends UIButton {
    musicButton: GameObjects.Image;
    music: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "button", callback);

        this.musicButton = scene.add.image(980, 40, 'musicOn').setScale(0.07).setDepth(100)

        this.musicButton.setInteractive().setDepth(100)
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.setTint(0x8afbff);
                EventBus.emit('toggleMusic'); //When clicked the event will start
                this.updateButtonImage(); //calls the function 
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
    }
    //function to change the texture
    updateButtonImage(){
        const musicEnabled = this.scene.registry.get('musicEnabled');
        this.musicButton.setTexture( musicEnabled ? 'musicOn' : 'musicOff' );
    }
}

export class BackButton extends UIButton {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "button", callback);
        scene.add.image(45, 40, 'back').setScale(0.07);
        this.setScale(0.9)

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.setTint(0x8afbff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
    }
}

/*export class PauseButton extends UIButton {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "Pause", callback, { backgroundColor: "#ffff00" });
    }
}

export class RestartButton extends UIButton {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "Restart", callback, { backgroundColor: "#ff0000" });
    }
}

export class ShootButton extends UIButton {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "Shoot", callback, { backgroundColor: "#ff00ff" });
    }
}*/
