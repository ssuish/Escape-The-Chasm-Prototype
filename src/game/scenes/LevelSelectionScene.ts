import { Scene } from "phaser";
import { EventBus } from "../EventBus";
//import { LevelSelectButton } from "../UIComponents/LevelSelectorButton";
import { BackButton, PlayButton } from "../UIComponents/UIButton";
import { LevelManager } from '../UIComponents/LevelManager'; // Import LevelManager

// Import all levels dynamically
//const levels = require(`../levels/${}`);

export class LevelSelection extends Scene {
    selectedLevelKey: string | null = null;
    levelManager: LevelManager;

    constructor() {
        super("LevelSelection");
    }

    create() {
        new BackButton(this, 45, 40, () => {
            this.changeScene("MainMenu");
        });

        this.levelManager = new LevelManager(this, 512, 348);

        // Select a default level (e.g., 'level1')
        this.selectedLevelKey = 'level1';

        // Display the default level portrait
        this.levelManager.drawLevelPortrait(this.selectedLevelKey);

        new PlayButton(this, 512, 530, () => {
            this.changeScene('Level1');
        }).setOrigin(0.5).setDepth(1000);

        EventBus.emit("current-scene-ready", this);
    }

    changeScene(scene: string) {
        this.scene.start(scene);
    }
}


