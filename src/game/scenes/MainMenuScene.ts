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
        this.logo = this.add.image(512, 250, "escape").setDepth(100);

        // Create buttons to switch scenes
        new PlayButton(this, 450, 425, () => {
            this.changeScene("LevelSelection");
        });

        new AchievementsButton(this, 320, 520, () => {
            this.changeScene("Achievements");
        });

        new CreditsButton(this, 400, 615, () => {
            this.changeScene("Credits");
        });
    
        EventBus.emit("current-scene-ready", this);
    }

    changeScene(scene?: string) {
        this.scene.start(scene ?? "MainMenu");
    }
}

