import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { BackButton } from "../UIComponents/UIButton";

export class Credits extends Scene {
    constructor() {
        super("Credits");
    }

    create() {
        new BackButton(this, 15, 10, () => {
            this.changeScene("MainMenu");
        });

        EventBus.emit("current-scene-ready", this);
        
    }
    
    changeScene(scene: string) {
        this.scene.start(scene);
    }
}

