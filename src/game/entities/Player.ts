import { Scene, Physics } from "phaser";
import { gameConfig } from "../config/gameConfig";
import StateMachine from "../logic/StateMachine";
import { ProjectilePool } from "./ProjectilePool";
import CollisionIdentifier from "../logic/CollisionIdentifier";
import { EventBus } from "../EventBus";

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
    private scene: Scene;
    private health: number;
    private maxHealth: number = 100;

    constructor(
        sprite: Physics.Matter.Sprite,
        obstacles: CollisionIdentifier,
        scene: Scene
    ) {
        this.sprite = sprite;
        this.speed = gameConfig.playerSpeed;
        this.jumpForce = gameConfig.jumpForce * 1.5;
        this.obstacles = obstacles;
        this.scene = scene;
        this.health = this.maxHealth;

        const scaleFactor = 2;
        this.sprite.setScale(scaleFactor);
        this.sprite.setTexture(this.sprite.texture.key, 0);

        const { width, height } = this.sprite;
        this.sprite.setBody(
            {
                type: "rectangle",
                width: width * scaleFactor * 0.5,
                height: height * scaleFactor * 1.7,
            },
            {
                position: {
                    x: this.sprite.x,
                    y: this.sprite.y + height * scaleFactor,
                },
            }
        );

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
            .addState("enemyHit", {
                onEnter: this.enemyHitOnEnter,
            })
            .addState("defeated", {
                onEnter: this.defeatedOnEnter,
            })
            .addState("win", {
                onEnter: this.gameFinishedOnEnter,
            })
            .setState("idle");

        this.projectilePool = new ProjectilePool(this.sprite.scene, 5);

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const { bodyA, bodyB } = data;

            const playerBody = this.sprite.body as MatterJS.BodyType;
            const otherBody =
                bodyA === playerBody
                    ? (bodyB as MatterJS.BodyType)
                    : (bodyA as MatterJS.BodyType);
            const gameObject = otherBody.gameObject;

            console.log(`Collided with: ${otherBody.label}`);

            if (this.obstacles.is("deadEnd", otherBody)) {
                this.stateMachine.setState("defeated");
                return;
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

        this.handleEnemyHit = this.handleEnemyHit.bind(this);
    }

    GetHealth = () => {
        return this.health;
    };

    GetMaxHealth = () => {
        return this.maxHealth;
    };

    private handleCollisionWith(gameObject: Phaser.GameObjects.GameObject) {
        if (gameObject instanceof Physics.Matter.TileBody) {
            this.isTouchingGround = true;
            if (this.stateMachine.isCurrentState("jump")) {
                this.stateMachine.setState("idle");
            }
        }

        // Just testing hit animation
        if (gameObject instanceof Physics.Matter.Sprite) {
            if (gameObject.name === "enemy-footman") {
                this.stateMachine.setState("enemyHit");
            }
        }

        // TODO: Add collision handling for other game objects
        // if (gameObject instanceof Enemy) {
        //     this.stateMachine.setState("enemyHit");
        // }
    }

    private gameFinishedOnEnter() {}

    private idleOnEnter() {
        this.sprite.play("idle", true);
    }

    private walkOnEnter() {
        this.sprite.play("walk", true);
    }

    private jumpOnEnter() {
        this.sprite.play("jump", true);
        if (this.isTouchingGround) {
            this.sprite.setVelocityY(this.jumpForce);
            this.isTouchingGround = false;
        }
    }

    private enemyHitOnEnter() {
        this.sprite.setVelocityY(-10);

        // Apply knockback
        this.sprite.setVelocityX(this.sprite.flipX ? 10 : -10);

        const startColor = Phaser.Display.Color.ValueToColor(0xffffff);
        const endColor = Phaser.Display.Color.ValueToColor(0xff0000);

        // TODO: Add enemy hit animation and sound effect
        this.scene.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 100,
            repeat: 2,
            yoyo: true,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: (tween) => {
                const value = tween.getValue();
                const colorObject =
                    Phaser.Display.Color.Interpolate.ColorWithColor(
                        startColor,
                        endColor,
                        100,
                        value
                    );

                const color = Phaser.Display.Color.GetColor(
                    colorObject.r,
                    colorObject.g,
                    colorObject.b
                );

                this.sprite.setTint(color);
            },
        });

        console.log("Current player health: ", this.health);
        EventBus.emit("player-hurt");

        // Receiving damage from enemy
        EventBus.on("enemy-hit", this.handleEnemyHit);
        console.log("New player health: ", this.health);

        if (this.health >= 25){
            EventBus.emit('percent25Health')
        }

        this.stateMachine.setState("idle");
    }

    private defeatedOnEnter() {
        // TODO: Alternative can't play death animation
        if (this.sprite) {
            this.sprite.setInteractive(false);
            this.health = 0;
            console.log("Starting fade out");

            const camera = this.scene.cameras.main;
            const fadeOutRect = this.scene.add.rectangle(
                camera.scrollX + camera.width / 2,
                camera.scrollY + camera.height / 2,
                camera.width,
                camera.height,
                0x000000
            );
            fadeOutRect.setAlpha(0);

            // Fade out the black rectangle
            this.scene.tweens.add({
                targets: fadeOutRect,
                alpha: 1,
                duration: 2000,
                onComplete: () => {
                    console.log("Fade out complete");
                    EventBus.emit("player-defeated");
                    this.cleanup();
                    this.scene.scene.start("GameOver");
                },
            });
        } else {
            console.error("Sprite is not defined in defeatedOnEnter");
        }
    }

    private cleanup() {
        this.sprite.setVelocity(0);
        this.sprite.setAngularVelocity(0);
        this.sprite.setTint(0xffffff);
        this.health = this.maxHealth;
        this.stateMachine.setState("idle");
        EventBus.off("enemy-hit", this.handleEnemyHit);
    }

    private handleEnemyHit(damage: number) {
        this.health = Math.max(this.health - damage, 0);
        console.log("Health: ", this.health);
        if (this.health <= 0) {
            this.stateMachine.setState("defeated");
        }
        EventBus.off("enemy-hit", this.handleEnemyHit);
    }

    // TODO: Fix sprite projectile renderer and physics
    private fireOnEnter() {
        const projectile = this.projectilePool.getProjectile();
        if (projectile) {
            const facingLeft = this.sprite.flipX;
            const offsetX = facingLeft ? -40 : 40; // Adjust the offset value
            const offsetY = 0; // Adjust the vertical offset
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

    getPlayerSprite = () => {
        if (this.sprite) {
            return this.sprite;
        }
        return null;
    };

    static preload(scene: Scene) {
        scene.load.setPath("assets/player_final");
        scene.load
            .atlas(
                "player_idle",
                "/player_idle/player_idle.png",
                "/player_idle/player_idle.json"
            )
            .on("loaderror", () => {
                console.error(`Failed to load atlas.`);
            });

        scene.load
            .atlas(
                "player_death",
                "/player_death/player_death.png",
                "/player_death/player_death.json"
            )
            .on("loaderror", () => {
                console.error(`Failed to load atlas.`);
            });

        scene.load
            .atlas(
                "player_fire",
                "/player_fire/player_fire.png",
                "/player_fire/player_fire.json"
            )
            .on("loaderror", () => {
                console.error(`Failed to load atlas.`);
            });

        scene.load
            .atlas(
                "player_jump",
                "/player_jump/player_jump.png",
                "/player_jump/player_jump.json"
            )
            .on("loaderror", () => {
                console.error(`Failed to load atlas.`);
            });

        scene.load
            .atlas(
                "player_walk",
                "/player_walk/player_walk.png",
                "/player_walk/player_walk.json"
            )
            .on("loaderror", () => {
                console.error(`Failed to load atlas.`);
            });

        scene.load.image("projectile", "star.png").on("loaderror", () => {
            console.error(`Failed to load sprite.`);
        });
    }

    private createAnimation() {
        this.sprite.anims.create({
            key: "idle",
            frames: this.sprite.anims.generateFrameNames("player_idle", {
                prefix: "player_idle_0",
                start: 1,
                end: 4,
                suffix: ".png",
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.sprite.anims.create({
            key: "walk",
            frames: this.sprite.anims.generateFrameNames("player_walk", {
                prefix: "player_walk_0",
                start: 1,
                end: 4,
                suffix: ".png",
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.sprite.anims.create({
            key: "jump",
            frames: this.sprite.anims.generateFrameNames("player_jump", {
                prefix: "player_jump_0",
                start: 1,
                end: 6,
                suffix: ".png",
            }),
            frameRate: 3,
        });

        this.sprite.anims.create({
            key: "fire",
            frames: this.sprite.anims.generateFrameNames("player_fire", {
                prefix: "player_fire_0",
                start: 0,
                end: 4,
                suffix: ".png",
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.sprite.anims.create({
            key: "death",
            frames: this.sprite.anims.generateFrameNames("player_death", {
                prefix: "player_death_0",
                start: 0,
                end: 7,
                suffix: ".png",
            }),
            frameRate: 6,
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

    fireGun(isHolding: boolean) {
        const currentTime = this.sprite.scene.time.now;
        if (isHolding) {
            if (this.sprite.anims.currentAnim?.key !== "fire") {
                this.sprite.play("fire", true);
            }
            if (currentTime - this.lastFireTime > this.fireCooldown) {
                if (!this.stateMachine.isCurrentState("fire")) {
                    this.stateMachine.setState("fire");
                    this.lastFireTime = currentTime;
                }
            }
        } else {
            if (this.stateMachine.isCurrentState("fire")) {
                this.stateMachine.setState("idle");
            }
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

    destroy() {
        this.sprite.destroy();
    }
}

