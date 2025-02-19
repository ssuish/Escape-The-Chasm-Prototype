import { Scene, Physics } from "phaser";

export class Platforms extends Physics.Arcade.Sprite {
    public platforms: Physics.Arcade.StaticGroup;
    private platformWidth: number;
    private platformHeight: number;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        platformWidth: number = 200,
        platformHeight: number = 32
    ) {
        super(scene, x, y, "platforms");
        //scene.add.existing(this);

        this.platformWidth = platformWidth;
        this.platformHeight = platformHeight;
    }

    static preload(scene: Scene) {
        scene.load.image("platform", "assets/star.png");
    }

    create() {
        this.platforms = this.scene.physics.add.staticGroup();
        this.scene.physics.add.collider(this, this.platforms);
        this.platforms
            .create(this.x, this.y, "platform")
            .setScale(this.platformWidth / 200, this.platformHeight / 32)
            .refreshBody();

        // Show collider boundary
        this.platforms.children.iterate((platform: Phaser.GameObjects.GameObject) => {
            const body = platform.body as Phaser.Physics.Arcade.Body;
            const graphics = this.scene.add.graphics();
            graphics.lineStyle(2, 0xff0000, 1);
            graphics.strokeRect(body.x, body.y, body.width, body.height);
            return null;
        });
    }
}

