import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { BackButton } from "../UIComponents/UIButton";

export class Achievements extends Scene {
    logo: Phaser.GameObjects.Image;
    tileSprite: Phaser.GameObjects.TileSprite;
    scrollSpeed: number;

    constructor() {
        super("Achievements");
    }

    create() {
        //autoscroll backgound
        this.tileSprite = this.add.tileSprite(0, 0, 2048, 1536, 'background')
        this.tileSprite.setTilePosition(0,0);
        this.tileSprite.setScrollFactor(1);
        this.scrollSpeed = 0.3;

        new BackButton(this, 50, 50, () => {
            this.changeScene("MainMenu");
        });
        this.logo = this.add.image(512, 60, "achieve").setScale(.7); 
        EventBus.emit("current-scene-ready", this);
        
    }
    
    changeScene(scene: string) {
        this.scene.start(scene);
    }

    update() {
        this.tileSprite.tilePositionY -= this.scrollSpeed;
    }

      
}

