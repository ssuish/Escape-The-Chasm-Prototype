import { Physics, Scene } from "phaser";
import { BaseEnemy } from "./BaseEnemy";
import { EventBus } from "../EventBus";
import CollisionIdentifier from "../logic/CollisionIdentifier";
import { BaseLevel } from "../levels/BaseLevel";

export class EnemyFootman extends BaseEnemy {
    private health: number;
    private maxHealth: number;
    private damage: number;
    private id: number;

    constructor(
        sprite: Physics.Matter.Sprite,
        obstacles: CollisionIdentifier,
        player: Phaser.GameObjects.Sprite,
        scene: Scene
    ) {
        const instanceID =
            "enemy-footman-" + (sprite.body as MatterJS.BodyType).id;

        super(instanceID, sprite, obstacles, player, scene);

        this.maxHealth = 30;
        this.health = this.maxHealth;
        this.damage = 3;
        this.scene = scene;
        this.player = player;
        const body = sprite.body as MatterJS.BodyType;
        this.id = body.id;
        this.lastPlayerX = player.x;
        this.lastPlayerY = player.y;

        scene.add.existing(sprite);
        this.sprite.setScale(1.8);
        this.sprite.setFixedRotation();
        // this.sprite.setRectangle(this.sprite.width, this.sprite.height * 2);
        // if (this.sprite.body) {
        //     (this.sprite.body as MatterJS.BodyType & { label: string }).label = "enemy-footman"; // Manually set the label back
        // }

        this.sprite.setTexture("enemy_idle");
        console.log(
            `Sprite dimensions: width=${this.sprite.width}, height=${this.sprite.height}`
        );
        console.log(`Sprite body: `, this.sprite.body);

        // Event listeners
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
        //this.sprite.play("patrol");
    }

    protected attackOnEnter() {
        console.log("Enemy attacking player");
        this.stateMachine.setState("patrol");
    }

    private Jump() {
        const player = this.getPlayer();
        console.log("Jump method called");

        if (player) {
            this.lastPlayerX = player.x;
            this.lastPlayerY = player.y;
        } else {
            console.error(
                "Player object is undefined, using last known position"
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
            normalizedDirectionY = Math.max(normalizedDirectionY, 0.1);
        }

        const speed = 5;
        if (directionY < 0) {
            // Player is above, frog hop
            this.sprite.setVelocity(
                normalizedDirectionX * speed,
                normalizedDirectionY * speed * 2
            );
        } else {
            this.sprite.setVelocity(normalizedDirectionX * speed, 0);
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
            this.sprite.destroy();
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

                // Apply knockback
                this.sprite.setVelocityX(this.sprite.flipX ? 10 : -10);

                if (this.health <= 0) {
                    this.stateMachine.setState("defeated");
                } else {
                    this.stateMachine.setState("enemyHurt");
                }
            }
        }
        EventBus.off("projectile-hit", this.onEnemyHurt);
    }

    private getPlayer(): Phaser.GameObjects.Sprite {
        return this.player;
    }

    update(deltaTime: number) {
        const player = this.getPlayer();
        if (player) {
            this.lastPlayerX = player.x;
            this.lastPlayerY = player.y;
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

