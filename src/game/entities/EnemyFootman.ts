import { Physics, Scene } from "phaser";
import { BaseEnemy } from "./BaseEnemy";
import { EventBus } from "../EventBus";
import CollisionIdentifier from "../logic/CollisionIdentifier";

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
        super(sprite, obstacles, player, scene);

        // Event listeners
        EventBus.on("player-hurt", this.onPlayerHurt.bind(this)).on(
            "projectile-hit",
            this.onEnemyHurt.bind(this)
        );

        this.maxHealth = 30;
        this.health = this.maxHealth;
        this.damage = 10;
        this.scene = scene;
        this.player = player;
        const body = sprite.body as MatterJS.BodyType;
        this.id = body.id;
    }

    GetHealth = () => {
        this.health;
    };

    GetMaxHealth = () => {
        this.maxHealth;
    };

    protected handleCollisionWith(
        gameObject: Phaser.GameObjects.GameObject | undefined
    ): void {}

    protected createAnimation(): void {}

    protected idleOnEnter() {
        // Implement idle behavior
    }

    protected patrolOnEnter() {
        // Implement patrol behavior
    }

    protected attackOnEnter() {
        // Implement attack behavior
        console.log("Enemy attacking player");

        // Assuming you have a reference to the player object
        const player = this.getPlayer(); // Implement this method to get the player object

        // Calculate direction towards the player
        const directionX = player.x - this.sprite.x;
        const directionY = player.y - this.sprite.y;

        // Normalize direction
        const magnitude = Math.sqrt(
            directionX * directionX + directionY * directionY
        );
        const normalizedDirectionX = directionX / magnitude;
        const normalizedDirectionY = directionY / magnitude;

        // Set velocity to move towards the player
        const speed = 5; // Adjust speed as needed
        this.sprite.setVelocity(
            normalizedDirectionX * speed,
            normalizedDirectionY * speed
        );

        // Set a timer to reset to idle state after a short duration
        this.scene.time.delayedCall(1000, () => {
            this.sprite.setVelocity(0, 0);
            this.stateMachine.setState("idle");
        });
    }

    protected enemyHitOnEnter() {
        console.log("New health: ", this.health);
        this.stateMachine.setState("idle");
    }

    protected defeatedOnEnter() {
        // Implement dead behavior
        console.log("Enemy defeated");
        this.sprite.destroy();
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
            console.log(
                `Enemy ${projectileHit.id} is taking ${projectileHit.damage} damage.`
            );

            if (projectileHit.id === this.id) {
                this.health -= projectileHit.damage;

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
}

