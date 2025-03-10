import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameVictory extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;
    defeat5enemiesText: Phaser.GameObjects.Text;
    defeat10enemiesText: Phaser.GameObjects.Text;
    complete25Health: Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameVictory');
    }

    create ()
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x000000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameOverText = this.add.text(512, 150, 'Victory', {
            fontFamily: 'Rubik Dirt', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        
        EventBus.emit('current-scene-ready', this);


        //Reference of what the Game Victory scene should look like 
        /*this.defeat5enemiesText = this.add.text(450, 350, 'Defeated 5 Enemies', {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
             align: 'center'
        }).setOrigin(0).setDepth(100);
        
        this.defeat10enemiesText = this.add.text(450, 400, 'Defeated 10 Enemies', {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0).setDepth(100);
        
        this.complete25Health = this.add.text(450, 450, 'Complete the stage above 25% health', {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
               stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0).setDepth(100);*/
    }

    changeScene () {
        this.scene.start('MainMenu');
    }
}
