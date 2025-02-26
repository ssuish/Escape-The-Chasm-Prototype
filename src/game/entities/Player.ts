import { Scene, Physics } from "phaser";
import { EventBus } from "../EventBus";
import { gameConfig } from "../config/gameConfig";

export class Player {
    private jumpForce: number;
    private speed: number;
    private sprite: Physics.Matter.Sprite;
    isTouchingGround: boolean = false;

    constructor(sprite: Physics.Matter.Sprite) {
        this.sprite = sprite;
        this.speed = gameConfig.playerSpeed;
        this.jumpForce = gameConfig.jumpForce * 1.5; // Adjust jump force as needed

        this.createAnimation();
        this.registerEventListeners();
    }

    private createAnimation() {
        this.sprite.anims.create({
            key: "idle",
            frames: [{ key: "player", frame: "penguin_walk01.png" }],
        });

        this.sprite.anims.create({
            key: "walk",
            frames: this.sprite.anims.generateFrameNames("player", {
                prefix: "penguin_walk0",
                start: 1,
                end: 4,
                suffix: ".png",
            }),
            frameRate: 10,
            repeat: -1,
        });
    }

    private registerEventListeners() {
        EventBus.on("player-move-left", this.moveLeft.bind(this));
        EventBus.on("player-move-right", this.moveRight.bind(this));
        EventBus.on("player-idle", this.idle.bind(this));
        EventBus.on("player-jump", this.jump.bind(this));
        EventBus.on("player-fire", this.fireGun.bind(this));
        EventBus.on("player-interact", this.interact.bind(this));
        EventBus.on("player-pause", this.pauseGame.bind(this));
    }

    private checkSprite() {
        if (!this.sprite) {
            console.error("Player sprite is not defined");
            return false;
        }
        return true;
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
        if (this.checkSprite()) {
            this.sprite.flipX = true;
            this.sprite.setVelocityX(-this.speed);
            this.sprite.play("walk", true);
        }
    }

    moveRight() {
        if (this.checkSprite()) {
            this.sprite.flipX = false;
            this.sprite.setVelocityX(this.speed);
            this.sprite.play("walk", true);
        }
    }

    idle() {
        if (this.checkSprite()) {
            this.sprite.setVelocityX(0);
            this.sprite.play("idle", true);
        }
    }

    jump() {
        if (this.checkSprite() && this.isTouchingGround) {
            this.sprite.setVelocityY(this.jumpForce);
            this.isTouchingGround = false;
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

