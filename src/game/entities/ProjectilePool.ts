import { Scene } from "phaser";
import { Projectile } from "./Projectile";

export class ProjectilePool {
    private scene: Scene;
    private projectiles: Phaser.GameObjects.Group;

    constructor(scene: Scene, maxSize: number) {
        this.scene = scene;

        this.projectiles = this.scene.add.group({
            classType: Projectile,
            maxSize: maxSize,
            runChildUpdate: true,
        });

        for (let i = 0; i < maxSize; i++) {
            const projectile = new Projectile(
                scene,
                -100,
                -100,
                "projectile",
                this
            );
            this.projectiles.add(projectile, true);
            console.log(`Projectile ${i} added to pool`);
        }
    }

    returnProjectile(proj: Projectile) {
        proj.setActive(false);
        proj.setVisible(false);
        proj.setPosition(-100, -100); // Move off-screen
        console.log("Projectile returned to pool");
    }

    getProjectile(): Projectile | null {
        const projectile = this.projectiles.getFirstDead(false);
        if (projectile) {
            console.log("Projectile retrieved from pool");
        } else {
            console.log("No available projectiles in pool");
        }
        return projectile ? projectile : null;
    }

    update() {
        this.projectiles.children.iterate(
            (projectile: Phaser.GameObjects.GameObject) => {
                const proj = projectile as Projectile;
                if (proj.active) {
                    proj.update();
                }
                return null;
            }
        );
    }
}

