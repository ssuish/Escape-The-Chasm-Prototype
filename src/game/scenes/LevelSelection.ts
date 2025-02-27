import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { LevelSelectButton } from "../UIComponents/LevelSelectorButton";
import { BackButton } from "../UIComponents/UIButton";

// Import all levels dynamically
//const levels = require(`../levels/${}`);

export class LevelSelection extends Scene {
    background: GameObjects.Image;
    levelImages: GameObjects.Image[] = []; // Array of level pictures

    constructor() {
        super("LevelSelection");
    }

    create() {
        this.background = this.add.image(512, 384, "background");
        this.background.setDisplaySize(
            this.sys.canvas.width,
            this.sys.canvas.height
        );

        this.add
            .text(512, 200, "Select a Level", {
                fontSize: "32px",
                color: "#fff",
            })
            .setOrigin(0.5);
        
        new BackButton(this, 50, 50, () => {
            this.changeScene("MainMenu");
        });

        new LevelSelectButton(this, 512, 400, () => {
            this.changeScene("levels/Level1");
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene(scene: string) {
        this.scene.start(scene);
    }
}

