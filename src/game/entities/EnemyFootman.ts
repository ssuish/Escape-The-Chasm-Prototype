import { Physics, Scene } from "phaser";
import { BaseEnemy } from "./BaseEnemy";
import { EventBus } from "../EventBus";
import CollisionIdentifier from "../logic/CollisionIdentifier";
import { BaseLevel } from "../levels/BaseLevel";
import { gameConfig } from "../config/gameConfig";

const MAX_HEALTH = gameConfig.enemyFootmanConfig.maxHealth;
const DAMAGE = gameConfig.enemyFootmanConfig.damage;
const SCALE = gameConfig.enemyFootmanConfig.scale;
const SPEED = gameConfig.enemyFootmanConfig.speed;
const JUMP_FORCE = gameConfig.enemyFootmanConfig.jumpForce;
const MIN_NORMALIZED_DIRECTION_Y = 0.1;
const KNOCKBACK_VELOCITY = 10;

export class EnemyFootman extends BaseEnemy {
    private health: number;
    private maxHealth: number;
    private damage: number;
    private id: number;

    constructor(
        sprite: Physics.Matter.Sprite,
        obstacles: CollisionIdentifier,
        player: Phaser.Physics.Matter.Sprite,
        scene: Scene
    ) {
        const instanceID =
            "enemy-footman-" + (sprite.body as MatterJS.BodyType).id;

        super(instanceID, sprite, obstacles, player, scene);

        this.speed = SPEED;
        this.jumpForce = JUMP_FORCE;
        this.maxHealth = MAX_HEALTH;
        this.health = MAX_HEALTH;
        this.damage = DAMAGE;
        this.scene = scene;
        this.player = player;

        const body = sprite.body as MatterJS.BodyType;
        this.id = body.id;

        // Initialize last player position
        this.lastPlayerX = player.x;
        this.lastPlayerY = player.y;

        scene.add.existing(sprite);
        this.sprite.setScale(SCALE);
        this.sprite.setFixedRotation();
        this.sprite.setTexture("enemy_idle");

        EventBus.on("player-hurt", this.onPlayerHurt.bind(this)).on(
            "projectile-hit",
            this.onEnemyHurt.bind(this)
        );
    }

    GetHealth = () => {
        this.health;
    };

    GetMaxHealth = () => {
        this.maxHealth;
    };

    static preload(scene: Scene) {
        scene.load.setPath("assets/sounds");
        scene.load.audio("metalHit", "metal-hit.mp3").on("loaderror", () => {
            console.error(`Failed to load metalHit sound.`);
        });

        scene.load.setPath("assets/enemy");
        scene.load
            .atlas(
                "enemy_idle",
                "enemy_idle/enemy_idle.png",
                "enemy_idle/enemy_idle.json"
            )
            .on("loaderror", () => {
                console.error(`Failed to load atlas.`);
            })
            .on("load", () => {
                console.log("Enemy assets loaded successfully.");
            });

        scene.load
            .atlas(
                "enemy_attack",
                "enemy_attack/enemy_attack.png",
                "enemy_attack/enemy_attack.json"
            )
            .on("loaderror", () => {
                console.error(`Failed to load atlas.`);
            })
            .on("load", () => {
                console.log("Enemy assets loaded successfully.");
            });
    }

    protected createAnimation(): void {
        this.sprite.anims.create({
            key: "patrol",
            frames: this.sprite.anims.generateFrameNames("enemy_idle", {
                prefix: "enemy_idle_0",
                start: 0,
                end: 3,
                suffix: ".png",
            }),
            frameRate: 2,
            repeat: -1,
        });
        console.log("Enemy animation created.");
        this.sprite.anims.create({
            key: "attack",
            frames: this.sprite.anims.generateFrameNames("enemy_attack", {
                prefix: "enemy_attack_0",
                start: 0,
                end: 6,
                suffix: ".png",
            }),
            frameRate: 2,
            repeat: -1,
        });
        console.log("Enemy animation created.");
    }

    protected handleCollisionWith(
        gameObject: Phaser.GameObjects.GameObject | undefined
    ): void {
        this.Jump();

        if (gameObject instanceof Physics.Matter.TileBody) {
            this.isTouchingGround = true;
        }

        if (gameObject instanceof Physics.Matter.Sprite) {
            if (gameObject.name === "player") {
                console.log("Player collided with enemy");
                this.stateMachine.setState("attack");
                this.sprite.play("attack");
            }
        }

        return;
    }

    protected patrolOnEnter() {
        console.log("Enemy patrolling");
    }

    protected attackOnEnter() {
        console.log("Enemy attacking player");
        this.stateMachine.setState("patrol");
    }

    private Jump() {
        const player = this.getPlayer();
        console.log("Jump method called");

        if (
            player &&
            typeof player.x === "number" &&
            typeof player.y === "number"
        ) {
            this.lastPlayerX = player.x;
            this.lastPlayerY = player.y;
        } else {
            console.error(
                "Player object or its position is undefined, using last known position"
            );
        }

        const directionX = this.lastPlayerX - this.sprite.x;
        const directionY = this.lastPlayerY - this.sprite.y;
        const magnitude = Math.sqrt(
            directionX * directionX + directionY * directionY
        );
        const normalizedDirectionX = directionX / magnitude;
        let normalizedDirectionY = directionY / magnitude;

        if (directionY >= 0) {
            normalizedDirectionY = Math.max(
                normalizedDirectionY,
                MIN_NORMALIZED_DIRECTION_Y
            );
        }

        if (directionY < 0) {
            // Player is above, frog hop
            this.sprite.setVelocity(
                normalizedDirectionX * SPEED,
                normalizedDirectionY * SPEED * 2
            );
        } else {
            this.sprite.setVelocity(normalizedDirectionX * SPEED, 0);
        }

        this.isTouchingGround = false;
        this.stateMachine.setState("patrol");
    }

    protected enemyHitOnEnter() {
        console.log("New Enemy health: ", this.health);
        this.stateMachine.setState("patrol");
    }

    protected defeatedOnEnter(): void {
        console.log("Enemy defeated");
        EventBus.emit("enemy-defeated", this.id);
        if (this.sprite) {
            this.destroy();
            const baseLevel = this.scene as BaseLevel;
            baseLevel.incrementDefeatedEnemies();
        }
    }

    private onPlayerHurt() {
        this.stateMachine.setState("attack");
        EventBus.emit("enemy-hit", this.damage);
        EventBus.off("player-hurt", this.onPlayerHurt);
    }

    private onEnemyHurt(projectileHit: {
        id: number;
        type: string;
        damage: number;
    }) {
        if (projectileHit.type === "enemy-footman") {
            if (projectileHit.id === this.id) {
                this.health -= projectileHit.damage;
                this.scene.sound.play("metalHit");

                // Apply knockback force
                this.sprite.setVelocityX(
                    this.sprite.flipX ? KNOCKBACK_VELOCITY : -KNOCKBACK_VELOCITY
                );

                if (this.health <= 0) {
                    this.stateMachine.setState("defeated");
                } else {
                    this.stateMachine.setState("enemyHurt");
                }
            }
        }
        EventBus.off("projectile-hit", this.onEnemyHurt);
    }

    private getPlayer(): Phaser.Physics.Matter.Sprite {
        return this.scene.data.get("player") as Phaser.Physics.Matter.Sprite;
    }

    public destroy() {
        this.sprite.destroy();
        EventBus.off("projectile-hit", this.onEnemyHurt);
        EventBus.off("player-hurt", this.onPlayerHurt);
    }

    update(deltaTime: number) {
        const player = this.getPlayer();
        if (
            player &&
            typeof player.x === "number" &&
            typeof player.y === "number"
        ) {
            this.lastPlayerX = player.x;
            this.lastPlayerY = player.y;
        } else {
            console.error("Player object or its position is undefined");
            return;
        }

        if (this.sprite && this.sprite.body) {
            const playerX = this.lastPlayerX;
            const enemyX = this.sprite.x;

            if (playerX > enemyX) {
                this.sprite.setFlipX(false);
            } else if (playerX < enemyX) {
                this.sprite.setFlipX(true);
            } else {
                console.log(
                    "Player and enemy are at the same horizontal position"
                );
            }
        }

        this.stateMachine.update(deltaTime);
    }
}





