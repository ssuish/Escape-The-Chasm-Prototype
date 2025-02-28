import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { BackButton, MusicButton } from "../UIComponents/UIButton";

export class Achievements extends Scene {
    logo: Phaser.GameObjects.Image;
    tileSprite: Phaser.GameObjects.TileSprite;
    scrollSpeed: number;

    constructor() {
        super("Achievements");
    }

    create() {
        new BackButton(this, 45, 40, () => {
            this.changeScene("MainMenu");
        });
        
        //this.logo = this.add.image(512, 60, "achieve").setScale(.7);
        
        new MusicButton(this, 980, 40, () => {
                
        });

        EventBus.emit("current-scene-ready", this);
        
    }
    
    changeScene(scene: string) {
        this.scene.start(scene);
    }
}

