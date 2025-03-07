import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { BackButton } from "../UIComponents/UIButton";

export class Achievements extends Scene {
    constructor() {
        super("Achievements");
    }

    create() {
        new BackButton(this, 45, 40, () => {
            this.changeScene("MainMenu");
        });

        EventBus.emit("current-scene-ready", this);
        
    }
    
    changeScene(scene: string) {
        this.scene.start(scene);
    }
}

