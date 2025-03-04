import { Physics } from "phaser";
import { BaseEnemy } from "./BaseEnemy";
import { EventBus } from "../EventBus";
import CollisionIdentifier from "../logic/CollisionIdentifier";

export class EnemyFootman extends BaseEnemy {
    constructor(sprite: Physics.Matter.Sprite, obstacles: CollisionIdentifier) {
        super(sprite, 10, 100, obstacles); // Example values for damage and health

        // Event listeners
        EventBus.on("player-hurt", this.onPlayerHurt.bind(this));
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

    protected playerHitOnEnter() {
        // Implement player hit behavior
    }

    protected defeatedOnEnter() {
        // Implement dead behavior
    }

    private onPlayerHurt() {
        this.stateMachine.setState("attack");
        EventBus.emit("enemy-hit", this.damage);
        EventBus.off("player-hurt", this.onPlayerHurt);
    }
}


