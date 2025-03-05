import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { LevelSelectButton } from "../UIComponents/LevelSelectorButton";
import { BackButton } from "../UIComponents/UIButton";

// Import all levels dynamically
//const levels = require(`../levels/${}`);

export class LevelSelection extends Scene {
    background: GameObjects.Image;
    levelImages: GameObjects.Image[] = []; // Array of level pictures
    tileSprite: GameObjects.TileSprite;
    scrollSpeed: number;

    constructor() {
        super("LevelSelection");
    }

    create() {
        new BackButton(this, 45, 40, () => {
            this.changeScene("MainMenu");
        });

        new LevelSelectButton(this, 512, 400, () => {
            this.changeScene("Level1");
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene(scene: string) {
        this.scene.start(scene);
    }
}


