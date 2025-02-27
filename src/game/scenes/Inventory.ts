import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { BackButton } from "../UIComponents/UIButton";


export class Inventory extends Scene {
    logo: Phaser.GameObjects.Image;
    constructor() {
        super("Inventory");
    }

    create() {
        new BackButton(this, 50, 50, () => {
            this.changeScene("MainMenu");
        });
        this.logo = this.add.image(512, 60, "inventory").setScale(.7); 
        EventBus.emit("current-scene-ready", this);
    }
    changeScene(scene: string) {
        this.scene.start(scene);
    }
}
