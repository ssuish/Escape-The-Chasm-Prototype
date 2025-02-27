import { GameObjects, Scene } from "phaser";

export class LevelSelectButton extends GameObjects.Image {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "card1");
        this.setInteractive()
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
            this.setTint(0xdedede)
        })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            this.setTint(0xffffff)
        })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.setTint(0x8afbff)
        })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            this.setTint(0xffffff)
        })
    
        this.on("pointerdown", callback);

        this.setScale(1); // Increase the size of the sprite

        scene.add.existing(this);
    }
}