import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { CreditsButton,  DashboardButton,  PlayButton} from "../UIComponents/UIButton";

export class MainMenu extends Scene {
    logo: GameObjects.Image;
    userWallet: GameObjects.Text;
    constructor() {
        super("MainMenu");
    }

    create() {
        //Put the walletId/GoogleAuth info here
        this.userWallet = this.add.text(15, 10, 'Wallet: 01982njfjadsnfu10', {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#ffffff',
        });

        this.logo = this.add.image(512, 250, "escape").setOrigin(0.5).setDepth(100).setScale(0.7);

        new PlayButton(this, 512, 450, () => {
            this.changeScene("LevelSelection");
        }).setOrigin(0.5);

        new DashboardButton(this, 512, 550, () => {

        }).setOrigin(0.5);

        new CreditsButton(this, 1020, 760, () => {
            this.changeScene("Credits");
        }).setOrigin(1);
    
        EventBus.emit("current-scene-ready", this);
    }

    changeScene(scene?: string) {
        this.scene.start(scene ?? "MainMenu");
    }
}

