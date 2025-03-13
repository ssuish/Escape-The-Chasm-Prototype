import { Scene, Physics } from "phaser";
import { gameConfig } from "../config/gameConfig";
import StateMachine from "../logic/StateMachine";
import { ProjectilePool } from "./ProjectilePool";
import CollisionIdentifier from "../logic/CollisionIdentifier";
import { EventBus } from "../EventBus";

const SCALE_FACTOR = 2;
const FIRE_COOLDOWN = gameConfig.basicGunConfig.fireRate; // Firing rate in milliseconds
const MAX_HEALTH = gameConfig.playerConfig.maxHealth;
const KNOCKBACK_VELOCITY_X = 10;
const KNOCKBACK_VELOCITY_Y = -10;
const FADE_OUT_DURATION = 2000;
const FADE_OUT_COLOR = 0x000000;
const TINT_START_COLOR = 0xffffff;
const TINT_END_COLOR = 0xb10000;
const TINT_DURATION = 100;
const TINT_REPEAT = 2;
const TINT_YOYO = true;

export class Player {
    private jumpForce: number;
    private speed: number;
    private sprite: Physics.Matter.Sprite;
    private stateMachine: StateMachine;
    private isTouchingGround: boolean = false;
    private projectilePool: ProjectilePool;
    private fireCooldown: number = FIRE_COOLDOWN;
    private lastFireTime: number = 0;
    private obstacles!: CollisionIdentifier;
    private scene: Scene;
    private health: number;
    private music: Phaser.Sound.BaseSoundManager;
    private maxHealth: number = MAX_HEALTH;

    constructor(
        sprite: Physics.Matter.Sprite,
        obstacles: CollisionIdentifier,
        scene: Scene
    ) {
        this.sprite = sprite;
        this.speed = gameConfig.playerSpeed;
        this.jumpForce = gameConfig.jumpForce * 1.5;
        this.obstacles = obstacles;
        this.scene = scene; // Ensure the scene is assigned here
        this.health = this.maxHealth;
        this.music = scene.sound;
        this.health = this.maxHealth;

        this.sprite.setScale(SCALE_FACTOR);
        this.sprite.setTexture(this.sprite.texture.key, 0);

        const { width, height } = this.sprite;
        this.sprite.setBody(
            {
                type: "rectangle",
                width: width * SCALE_FACTOR * 0.5,
                height: height * SCALE_FACTOR * 1.7,
            },
            {
                position: {
                    x: this.sprite.x,
                    y: this.sprite.y + height * SCALE_FACTOR,
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
        if (
            this.stateMachine.isCurrentState("fire") ||
            this.stateMachine.isCurrentState("jump")
        ) {
            return;
        }
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
        this.sprite.setVelocityY(KNOCKBACK_VELOCITY_Y);

        // Apply knockback
        this.sprite.setVelocityX(
            this.sprite.flipX ? KNOCKBACK_VELOCITY_X : -KNOCKBACK_VELOCITY_X
        );

        const startColor = Phaser.Display.Color.ValueToColor(TINT_START_COLOR);
        const endColor = Phaser.Display.Color.ValueToColor(TINT_END_COLOR);

        // TODO: Add enemy hit animation and sound effect
        this.scene.tweens.addCounter({
            from: 0,
            to: 100,
            duration: TINT_DURATION,
            repeat: TINT_REPEAT,
            yoyo: TINT_YOYO,
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

                this.sprite.setTintFill(color);
            },
            onComplete: () => {
                this.sprite.clearTint();
            },
        });

        console.log("Current player health: ", this.health);
        EventBus.emit("player-hurt");

        // Receiving damage from enemy
        EventBus.on("enemy-hit", this.handleEnemyHit);
        console.log("New player health: ", this.health);

        if (this.health >= 25) {
            EventBus.emit("percent25Health");
        }

        this.stateMachine.setState("idle");
    }

    private defeatedOnEnter() {
        // TODO: Alternative can't play death animation
        if (this.sprite) {
            this.sprite.setVelocity(0);
            this.sprite.setAngularVelocity(0);
            this.sprite.setInteractive(false);
            this.health = 0;

            this.sprite.play("death");

            const camera = this.scene.cameras.main;
            const fadeOutRect = this.scene.add.rectangle(
                camera.scrollX + camera.width / 2,
                camera.scrollY + camera.height / 2,
                camera.width,
                camera.height,
                FADE_OUT_COLOR
            );
            fadeOutRect.setAlpha(0);

            // Fade out the black rectangle
            this.scene.tweens.add({
                targets: fadeOutRect,
                alpha: 1,
                duration: FADE_OUT_DURATION,
                onComplete: () => {
                    this.cleanup();
                    //this.BaseLevel.restartLevel();
                    EventBus.emit("player-defeated");
                },
            });
        } else {
            console.error("Sprite is not defined in defeatedOnEnter");
        }
    }

    public cleanup() {
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
            const offsetX = facingLeft ? -70 : 70; // Adjust the offset value
            const offsetY = -2; // Adjust the vertical offset
            projectile.fireFromPlayer(
                this.sprite.x + offsetX,
                this.sprite.y + offsetY,
                facingLeft,
                gameConfig.basicGunConfig.bulletSpeed
            );

            projectile.setFlipX(facingLeft);

            this.music.play("gunshot");
        }

        this.sprite.once("animationcomplete", () => {
            console.log("Fire animation complete");
            if (this.stateMachine.isCurrentState("fire")) {
                this.stateMachine.setState("idle");
            }
        });
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
        scene.load.setPath("assets/");
        scene.load
            .audio("gunshot", "sounds/gunshots.mp3")
            .on("loaderror", () => {
                console.error(`Failed to load gunshot sound.`);
            });

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

        scene.load.image("projectile", "projectile.png").on("loaderror", () => {
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
            frameRate: 12,
        });

        this.sprite.anims.create({
            key: "walk",
            frames: this.sprite.anims.generateFrameNames("player_walk", {
                prefix: "player_walk_0",
                start: 1,
                end: 4,
                suffix: ".png",
            }),
            frameRate: 12,
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
            frameRate: 12,
        });

        this.sprite.anims.create({
            key: "fire",
            frames: this.sprite.anims.generateFrameNames("player_fire", {
                prefix: "player_fire_0",
                start: 0,
                end: 4,
                suffix: ".png",
            }),
            frameRate: 12,
        });

        this.sprite.anims.create({
            key: "death",
            frames: this.sprite.anims.generateFrameNames("player_death", {
                prefix: "player_death_0",
                start: 0,
                end: 7,
                suffix: ".png",
            }),
            frameRate: 12,
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
        if (
            this.sprite &&
            !this.stateMachine.isCurrentState("fire") &&
            !this.stateMachine.isCurrentState("jump")
        ) {
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
            console.log("Firing gun");
            if (currentTime - this.lastFireTime > this.fireCooldown) {
                this.sprite.play("fire", true);
                this.stateMachine.setState("fire");
                this.lastFireTime = currentTime;
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
