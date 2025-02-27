export class Background extends Phaser.Scene {
    background: Phaser.GameObjects.TileSprite;
  
    constructor() {
      super({ key: 'Background', active: true });
    }

    preload(){
        this.load.image('background', './assets/bg.png');
    }
  
    create() {
      this.background = this.add.tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        'background'
      ).setOrigin(0);
    }
  
    update() {
      this.background.tilePositionY -= 0.3;
    }
  }