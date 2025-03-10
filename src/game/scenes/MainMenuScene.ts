import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { AchievementsButton,  CreditsButton,  PlayButton} from "../UIComponents/UIButton";

export class MainMenu extends Scene {
    logo: GameObjects.Image;
    constructor() {
        super("MainMenu");
    }

    create() {
        //logo
        this.logo = this.add.image(512, 250, "escape").setOrigin(0.5).setDepth(100);

        // Create buttons to switch scenes
        new PlayButton(this, 512, 425, () => {
            this.changeScene("LevelSelection");
        }).setOrigin(0.5);

        new AchievementsButton(this, 512, 520, () => {
            this.changeScene("Achievements");
        }).setOrigin(0.5);

        new CreditsButton(this, 512, 615, () => {
            this.changeScene("Credits");
        }).setOrigin(0.5);
    
        EventBus.emit("current-scene-ready", this);
    }

    changeScene(scene?: string) {
        this.scene.start(scene ?? "MainMenu");
    }
}

