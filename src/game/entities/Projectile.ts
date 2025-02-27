import { Physics, Scene } from "phaser";

export class Projectile extends Physics.Matter.Sprite {
    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene.matter.world, x, y, texture);
        scene.add.existing(this);
        this.setActive(false);
        this.setVisible(false);
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
            this.x < 0 ||
            this.x > this.scene.scale.width ||
            this.y < 0 ||
            this.y > this.scene.scale.height
        ) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

