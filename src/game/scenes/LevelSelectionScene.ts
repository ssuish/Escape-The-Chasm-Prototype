import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { BackButton, PlayButton } from "../UIComponents/UIButton";
import { LevelManager } from '../UIComponents/LevelManager'; 
import { levelObjectives } from "../logic/LevelObjectives";

// Import all levels dynamically
//const levels = require(`../levels/${}`);

export class LevelSelection extends Scene {
    selectedLevelKey: string | null = null;
    levelManager: LevelManager;

    constructor() {
        super("LevelSelection");
    }

    preload(){
        this.load.image("complete", "assets/hex-c.png");
        this.load.image("fail", "assets/hex-inc2.png");
    }

    create(data: { levelCompleted: boolean; completedLevelKey: string }): void {

        if (data && data.levelCompleted && data.completedLevelKey) {
            const levelData = levelObjectives[data.completedLevelKey];
            if (levelData) {
                levelData.stars.forEach(star => {
                    star.completed = true; // Mark all objectives as completed
                });
            }
        }
        this.levelManager = new LevelManager(this, this.cameras.main.centerX, this.cameras.main.centerY);
        this.levelManager.drawLevelPortrait('level1'); // Display level1 by default
        
        new BackButton(this, 15, 10, () => {
            this.changeScene("MainMenu");
        });

        new PlayButton(this, 512, 530, () => {
            this.changeScene('Level1');
        }).setOrigin(0.5).setDepth(1000);

        EventBus.emit("current-scene-ready", this);
    }

    changeScene(scene: string) {
        this.scene.start(scene);
    }
}


