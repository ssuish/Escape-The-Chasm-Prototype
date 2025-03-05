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
        //this.setOrigin(0.5).setInteractive();
        this.on("pointerdown", callback);
        //this.setScale(0.);

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
    onVolume: GameObjects.Image;
    offVolume: GameObjects.Image;

    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "button", callback);

        this.setScale(0.9)

        let offVolume = scene.add.image(980, 40, 'volume-off').setScale(0.07);
        let onVolume = scene.add.image(980, 40, 'volume-on').setScale(0.07);

        onVolume.visible = true;
        offVolume.visible = false;

        onVolume.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.setTint(0x8afbff);
                onVolume.visible = false;
                offVolume.visible = true;
                console.log('Music Off');
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });

        offVolume.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.setTint(0x8afbff);
                onVolume.visible = true;
                offVolume.visible =false;
                console.log('Music On');
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
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
