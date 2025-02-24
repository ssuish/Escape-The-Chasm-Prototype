import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { BackButton } from "../UIComponents/UIButton";

export class Settings extends Scene {
    constructor() {
        super("Settings");
    }

    create() {
        this.add.text(100, 100, "Settings", {
            fontSize: "32px",
            color: "#fff",
        });
        EventBus.emit("current-scene-ready", this);

        new BackButton(this, 50, 50, () => {
            this.changeScene("MainMenu");
        });
    }
    
    changeScene(scene: string) {
        this.scene.start(scene);
    }
}
