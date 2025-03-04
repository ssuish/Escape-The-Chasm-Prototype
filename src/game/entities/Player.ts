import { Scene, Physics } from "phaser";
import { gameConfig } from "../config/gameConfig";
import StateMachine from "../logic/StateMachine";
import { ProjectilePool } from "./ProjectilePool";
import CollisionIdentifier from "../logic/CollisionIdentifier";

export class Player {
    private jumpForce: number;
    private speed: number;
    private sprite: Physics.Matter.Sprite;
    private stateMachine: StateMachine;
    private isTouchingGround: boolean = false;
    private projectilePool: ProjectilePool;
    private fireCooldown: number = 300; // Firing rate in milliseconds
    private lastFireTime: number = 0;
    private obstacles!: CollisionIdentifier;

    constructor(sprite: Physics.Matter.Sprite, obstacles: CollisionIdentifier) {
        this.sprite = sprite;
        this.speed = gameConfig.playerSpeed;
        this.jumpForce = gameConfig.jumpForce * 1.5;
        this.obstacles = obstacles;

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

        this.projectilePool = new ProjectilePool(this.sprite.scene, 5);

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            // const { bodyA, bodyB } = data;
            // if (bodyA === this.sprite.body || bodyB === this.sprite.body) {
            //     this.isTouchingGround = true;
            //     if (this.stateMachine.isCurrentState("jump")) {
            //         this.stateMachine.setState("idle");
            //     }
            // }

            const { bodyA, bodyB } = data;

            const playerBody = this.sprite.body as MatterJS.BodyType;
            const otherBody =
                bodyA === playerBody
                    ? (bodyB as MatterJS.BodyType)
                    : (bodyA as MatterJS.BodyType);
            const gameObject = otherBody.gameObject;

            console.log(`Collided with: ${otherBody.label}`);
            if (this.obstacles.is("deadEnd", otherBody))
            {
                console.log("Dead end");
            }

            if (!gameObject) {
                console.error(
                    "Failed to get game object from body: " + otherBody.label
                );
                return;
            }

            this.handleCollisionWith(gameObject);
        });

        this.sprite.setFixedRotation();
        this.createAnimation();
    }

    private handleCollisionWith(gameObject: Phaser.GameObjects.GameObject) {
        if (gameObject instanceof Physics.Matter.TileBody) {
            this.isTouchingGround = true;
            if (this.stateMachine.isCurrentState("jump")) {
                this.stateMachine.setState("idle");
            }
        }


    }

    private idleOnEnter() {
        this.sprite.play("idle", true);
    }

    private walkOnEnter() {
        this.sprite.play("walk", true);
    }

    private jumpOnEnter() {
        if (this.isTouchingGround) {
            this.sprite.setVelocityY(this.jumpForce);
            this.isTouchingGround = false;
        }
    }

    // TODO: Fix sprite projectile renderer and physics
    private fireOnEnter() {
        const projectile = this.projectilePool.getProjectile();
        if (projectile) {
            const facingLeft = this.sprite.flipX;
            const offsetX = facingLeft ? -30 : 30; // Adjust the offset value as needed
            const offsetY = 0; // Adjust the vertical offset if needed
            projectile.fireFromPlayer(
                this.sprite.x + offsetX,
                this.sprite.y + offsetY,
                facingLeft,
                20
            );
        }
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
        scene.load.image("projectile", "star.png").on("loaderror", () => {
            console.error(`Failed to load sprite.`);
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
        const currentTime = this.sprite.scene.time.now;
        if (currentTime - this.lastFireTime > this.fireCooldown) {
            this.stateMachine.setState("fire");
            this.lastFireTime = currentTime;
        }
    }

    interact() {
        this.stateMachine.setState("interact");
    }

    pauseGame() {
        this.stateMachine.setState("pause");
    }

    update(deltaTime: number) {
        this.stateMachine.update(deltaTime);
        this.projectilePool.update();
    }
}





