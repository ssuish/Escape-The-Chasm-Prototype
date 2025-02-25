import { Scene, Physics } from "phaser";
import { gameConfig } from "../config/gameConfig";

export class Player extends Physics.Matter.Sprite {
    private jumpForce: number;
    private speed: number;
    isTouchingGround: boolean = false;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        texture: string,
        speed: number
    ) {
        super(scene.matter.world, x, y, texture);
        this.speed = speed;
        this.jumpForce = gameConfig.jumpForce; // Adjust jump force as needed

        scene.add.existing(this);
    }

    static preload(scene: Scene) {
        scene.load.setPath("assets");
        scene.load
            .atlas(
                "player",
                "/player/player_placeholder.png",
                "/player/player_placeholder.json"
            )
            .on("loaderror", () => {
                console.error(`Failed to load atlas.`);
            });
    }

    moveLeft() {
        this.flipX = true;
        this.setVelocityX(-this.speed);
        this.play("walk", true);
    }

    moveRight() {
        this.flipX = false;
        this.setVelocityX(this.speed);
        this.play("walk", true);
    }

    idle() {
        this.setVelocityX(0);
        this.play("idle", true);
    }

    jump() {
        if (this.isTouchingGround) {
            this.setVelocityY(this.jumpForce);
            this.isTouchingGround = false;
        }
    }

    createAnimation(scene: Scene) {
        scene.anims.create({
            key: "idle",
            frames: [{ key: "player", frame: "penguin_walk01.png" }],
        });

        scene.anims.create({
            key: "walk",
            frames: scene.anims.generateFrameNames("player", {
                prefix: "penguin_walk0",
                start: 1,
                end: 4,
                suffix: ".png",
            }),
            frameRate: 10,
            repeat: -1,
        });
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

