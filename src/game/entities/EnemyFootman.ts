import { Physics } from "phaser";
import { BaseEnemy } from "./BaseEnemy";
import { EventBus } from "../EventBus";
import CollisionIdentifier from "../logic/CollisionIdentifier";

export class EnemyFootman extends BaseEnemy {
    private health: number;
    private damage: number;
    private id: number;

    constructor(sprite: Physics.Matter.Sprite, obstacles: CollisionIdentifier) {
        super(sprite, obstacles);

        // Event listeners
        EventBus.on("player-hurt", this.onPlayerHurt.bind(this)).on(
            "projectile-hit",
            this.onEnemyHurt.bind(this)
        );

        this.health = 100;
        this.damage = 10;
        const body = sprite.body as MatterJS.BodyType;
        this.id = body.id;
    }

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
        this.stateMachine.setState("idle");
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
                if (this.health <= 0) {
                    this.stateMachine.setState("defeated");
                } else {
                    this.stateMachine.setState("enemyHurt");
                }
            }
        }
        EventBus.off("projectile-hit", this.onEnemyHurt);
    }
}

