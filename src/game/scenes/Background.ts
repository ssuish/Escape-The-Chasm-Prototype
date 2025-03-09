export class Background extends Phaser.Scene {
    background: Phaser.GameObjects.TileSprite;
    overlayShadow: Phaser.GameObjects.Image;
    overlayDodge: Phaser.GameObjects.Image;

    constructor() {
        super({ key: "Background", active: true });
    }

    preload() {
        this.load.image("background", "./assets/bg.png");
        this.load.image("overlay-shadow", "./assets/bg-shadow.png");
        this.load.image("overlay-dodge", "./assets/bg-dodge.png");
    }

    create() {
        this.background = this.add
            .tileSprite(
                0,
                0,
                this.game.config.width as number,
                this.game.config.height as number,
                "background"
            )
            .setOrigin(0);

        // Create a RenderTexture
        const renderTexture = this.add
            .renderTexture(
                0,
                0,
                this.game.config.width as number,
                this.game.config.height as number
            )
            .setOrigin(0);

        // Draw overlayShadow with MULTIPLY blend mode
        renderTexture.draw(
            this.add
                .image(
                    (this.game.config.width as number) / 2,
                    (this.game.config.height as number) / 2,
                    "overlay-shadow"
                )
                .setOrigin(0.5)
                .setBlendMode(Phaser.BlendModes.MULTIPLY)
        );

        // Draw overlayDodge with COLOR_DODGE blend mode
        renderTexture.draw(
            this.add
                .image(
                    (this.game.config.width as number) / 2,
                    (this.game.config.height as number) / 2,
                    "overlay-dodge"
                )
                .setOrigin(0.5)
                .setBlendMode(Phaser.BlendModes.SCREEN)
        );
    }

    update() {
        this.background.tilePositionY -= 0.3;
    }
}

