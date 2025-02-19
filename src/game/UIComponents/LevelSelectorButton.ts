import { GameObjects, Scene } from "phaser";

export class LevelSelectButton extends GameObjects.Image {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "star");
        this.setOrigin(0.5).setInteractive();

        this.on("pointerdown", callback);

        this.setScale(2); // Increase the size of the sprite

        scene.add.existing(this);
    } 


}