import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { BackButton } from "../UIComponents/UIButton";


export class Inventory extends Scene {
    constructor() {
        super("Inventory");
    }

    create() {
        this.add.text(100, 100, "Inventory", {
            fontSize: "32px",
            color: "#fff",
        });
        
        new BackButton(this, 50, 50, () => {
            this.changeScene("MainMenu");
        });
        
        EventBus.emit("current-scene-ready", this);
    }
    changeScene(scene: string) {
        this.scene.start(scene);
    }
}
