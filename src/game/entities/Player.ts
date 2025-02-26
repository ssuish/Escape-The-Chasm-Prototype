import { Scene, Physics } from "phaser";
import { gameConfig } from "../config/gameConfig";
import StateMachine from "../logic/StateMachine";

export class Player {
    private jumpForce: number;
    private speed: number;
    private sprite: Physics.Matter.Sprite;
    private stateMachine: StateMachine;
    private isTouchingGround: boolean = false;

    constructor(sprite: Physics.Matter.Sprite) {
        this.sprite = sprite;
        this.speed = gameConfig.playerSpeed;
        this.jumpForce = gameConfig.jumpForce * 1.5;

        this.stateMachine = new StateMachine(this, "player");
        this.stateMachine
            .addState("idle", {
                onEnter: this.idleOnEnter,
            })
            .addState("walk", {
                onEnter: this.walkOnEnter,
            })
            .addState("jump", {
                onEnter: this.jumpOnEnter,
            })
            .addState("fire", {
                onEnter: this.fireOnEnter,
            })
            .addState("interact", {
                onEnter: this.interactOnEnter,
            })
            .addState("pause", {
                onEnter: this.pauseOnEnter,
            })
            .setState("idle");

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const { bodyA, bodyB } = data;
            if (bodyA === this.sprite.body || bodyB === this.sprite.body) {
                this.isTouchingGround = true;
                if (
                    this.stateMachine.isCurrentState("jump")
                ) {
                    this.stateMachine.setState("idle");
                }
            }
        });

        this.sprite.setFixedRotation();
        this.createAnimation();
    }

    private idleOnEnter() {
        this.sprite.play("idle");
    }

    private walkOnEnter() {
        this.sprite.play("walk");
    }

    private jumpOnEnter() {
        if (this.isTouchingGround) {
            this.sprite.setVelocityY(this.jumpForce);
            this.isTouchingGround = false;
        }
    }

    private fireOnEnter() {
        console.log("Fire gun");
    }

    private interactOnEnter() {
        console.log("Interact");
    }

    private pauseOnEnter() {
        console.log("Pause game");
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
        if (this.sprite) {
            this.sprite.flipX = true;
            this.sprite.setVelocityX(-this.speed);
            this.stateMachine.setState("walk");
        }
    }

    moveRight() {
        if (this.sprite) {
            this.sprite.flipX = false;
            this.sprite.setVelocityX(this.speed);
            this.stateMachine.setState("walk");
        }
    }

    idle() {
        if (this.sprite) {
            this.sprite.setVelocityX(0);
            this.stateMachine.setState("idle");
        }
    }

    jump() {
        if (this.isTouchingGround) {
            this.stateMachine.setState("jump");
        }
    }

    fireGun() {
        this.stateMachine.setState("fire");
    }

    interact() {
        this.stateMachine.setState("interact");
    }

    pauseGame() {
        this.stateMachine.setState("pause");
    }

    update(deltaTime: number) {
        this.stateMachine.update(deltaTime);
    }
}

