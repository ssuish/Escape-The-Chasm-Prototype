import { Scene } from "phaser";
import { Projectile } from "./Projectile";

const OFF_SCREEN_X = -100;
const OFF_SCREEN_Y = -100;
const PROJECTILE_KEY = "projectile";

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
                OFF_SCREEN_X,
                OFF_SCREEN_Y,
                PROJECTILE_KEY,
                this
            );
            this.projectiles.add(projectile, true);
        }
    }

    returnProjectile(proj: Projectile) {
        proj.setActive(false);
        proj.setVisible(false);
        proj.setPosition(OFF_SCREEN_X, OFF_SCREEN_Y); // Move off-screen
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
