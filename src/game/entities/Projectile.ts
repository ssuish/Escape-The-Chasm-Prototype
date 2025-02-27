import { Physics, Scene } from "phaser";
import { ProjectilePool } from "./ProjectilePool";

export class Projectile extends Physics.Matter.Sprite {
    private pool: ProjectilePool;

    constructor(scene: Scene, x: number, y: number, texture: string, pool: ProjectilePool) {
        super(scene.matter.world, x, y, texture);
        scene.add.existing(this);
        this.setActive(false);
        this.setVisible(false);
        this.pool = pool;

        // Adjust the size of the collider box
        this.setBody({
            type: "rectangle",
            width: this.width * 0.25,
            height: this.height * 0.25,
        });

        this.setIgnoreGravity(true);
        this.setFixedRotation();

        this.scene.matter.world.on(
            "collisionstart",
            this.handleCollision,
            this
        );
    }

    fire(x: number, y: number, velocityX: number, velocityY: number) {
        this.setPosition(x, y);
        this.setVelocity(velocityX, velocityY);
        this.setActive(true);
        this.setVisible(true);
    }

    fireFromPlayer(
        playerX: number,
        playerY: number,
        facingLeft: boolean,
        speed: number
    ) {
        const velocityX = facingLeft ? -speed : speed;
        const velocityY = 0; // No vertical component since aiming is horizontal
        this.fire(playerX, playerY, velocityX, velocityY);
    }

    update() {
        if (
            this.x > this.scene.scale.width
        ) {
            this.setActive(false);
            this.setVisible(false);
            this.setVelocity(0, 0);
            console.log("Projectile location:", this.x, this.y);
        }
    }

    handleCollision(event: Phaser.Physics.Matter.Events.CollisionStartEvent) {
        const pairs = event.pairs;
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            const { bodyA, bodyB } = pair;

            if (bodyA === this.body || bodyB === this.body) {
                const otherBody = bodyA === this.body ? bodyB : bodyA;
                console.log("Projectile collided with:", otherBody.label);
                console.log("Projectile location:", this.x, this.y);
                this.setActive(false);
                this.setVisible(false);
                this.setVelocity(0, 0);
                this.pool.returnProjectile(this);
                break;
            }
        }
    }
}




