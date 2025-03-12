import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { BackButton, PlayButton } from "../UIComponents/UIButton";
import { LevelManager } from '../UIComponents/LevelManager'; 

// Import all levels dynamically
//const levels = require(`../levels/${}`);

export class LevelSelection extends Scene {
    selectedLevelKey: string | null = null;
    levelManager: LevelManager;

    constructor() {
        super("LevelSelection");
    }

    create() {
        new BackButton(this, 15, 10, () => {
            this.changeScene("MainMenu");
        });

        this.levelManager = new LevelManager(this, 512, 348);
        this.selectedLevelKey = 'level1';
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


