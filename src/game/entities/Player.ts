import { Scene, Physics } from "phaser";

export class Player extends Physics.Arcade.Sprite {
    body: Physics.Arcade.Body;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "player");
        scene.add.existing(this);

        if (!scene.physics) {
            throw new Error("Physics system not found in the scene");
        }
        scene.physics.add.existing(this);

        this.body = this.body as Physics.Arcade.Body;
        this.setCollideWorldBounds(true);
    }

    static preload(scene: Scene) {
        scene.load.image("player", "assets/star.png");
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
