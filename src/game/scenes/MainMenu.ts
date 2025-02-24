import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { AchievementsButton, InventoryButton, PlayButton, SettingsButton} from "../UIComponents/UIButton";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    spawnButton: GameObjects.Text;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(512, 384, "background");
        this.background.setDisplaySize(
            this.sys.canvas.width,
            this.sys.canvas.height
        );

        this.logo = this.add.image(512, 250, "escape").setDepth(100);

        // Create buttons to switch scenes
        new PlayButton(this, 512, 450, () => {
            this.changeScene("LevelSelection");
        });

        new InventoryButton(this, 512, 520, () => {
            this.changeScene("Inventory");
        });

        new AchievementsButton(this, 512, 590, () => {
            this.changeScene("Achievements");
        });

        new SettingsButton(this, 512, 660, () => {
            this.changeScene("Settings");
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene(scene?: string) {
        this.scene.start(scene ?? "MainMenu");
    }

    // moveLogo(vueCallback: ({ x, y }: { x: number; y: number }) => void) {
    //     if (this.logoTween) {
    //         if (this.logoTween.isPlaying()) {
    //             this.logoTween.pause();
    //         } else {
    //             this.logoTween.play();
    //         }
    //     } else {
    //         this.logoTween = this.tweens.add({
    //             targets: this.logo,
    //             x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
    //             y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
    //             yoyo: true,
    //             repeat: -1,
    //             onUpdate: () => {
    //                 if (vueCallback) {
    //                     vueCallback({
    //                         x: Math.floor(this.logo.x),
    //                         y: Math.floor(this.logo.y),
    //                     });
    //                 }
    //             },
    //         });
    //     }
    // }
}

