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
        new BackButton(this, 50, 50, () => {
            this.changeScene("MainMenu");
        });
        this.logo = this.add.image(512, 60, "achieve").setScale(.7); 
        EventBus.emit("current-scene-ready", this);
        
    }
    
    changeScene(scene: string) {
        this.scene.start(scene);
    }
}

