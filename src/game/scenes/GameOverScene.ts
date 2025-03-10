import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { MainMenuButton, RestartButton } from '../UIComponents/UIButton';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xd34242);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameOverText = this.add.text(512, 200, 'Game Over', {
            fontFamily: 'Rubik Dirt', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        new RestartButton(this, 512, 380, () => {
            this.changeScene("Level1");
        }).setOrigin(0.5);

        new MainMenuButton(this, 512, 480, () => {
            this.changeScene("MainMenu");
        }).setOrigin(0.5);
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene(scene: string) {
        this.scene.start(scene);
    }
}
