import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { PlayButton, UIButton } from "../UIComponents/UIButton";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    //logo: GameObjects.Image;
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

        //this.logo = this.add.image(512, 300, "logo").setDepth(100);

        this.title = this.add
            .text(512, 300, "Escape the Chasm", {
                fontFamily: "Arial Black",
                fontSize: 48,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        // Create buttons to switch scenes
        new PlayButton(this, 512, 450, () => {
            this.changeScene("LevelSelection");
        });

        new UIButton(this, 512, 500, "Inventory", () => {
            this.changeScene("Inventory");
        });

        new UIButton(this, 512, 550, "Achievements", () => {
            this.changeScene("Achievements");
        });

        new UIButton(this, 512, 600, "Settings", () => {
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

