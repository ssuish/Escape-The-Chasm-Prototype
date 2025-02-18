import { Scene, Physics } from "phaser";

export class Player extends Physics.Arcade.Sprite {
    static interact() {
        throw new Error("Sprite not yet implemented");
    }
    body: Physics.Arcade.Body;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "player");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body = this.body as Physics.Arcade.Body;
        this.setCollideWorldBounds(true);
    }

    moveLeft() {
        this.setVelocityX(-160);
    }

    moveRight() {
        this.setVelocityX(160);
    }

    jump() {
        if (this.body && this.body.touching.down) {
            this.setVelocityY(-330);
        }
    }

    fireGun() {
        console.log("Fire gun");
    }

    interact() {
        console.log("Interact");
    }

    pauseGame() {
        console.log("Pause game");
    }
}
