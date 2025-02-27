import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { AchievementsButton, InventoryButton, PlayButton} from "../UIComponents/UIButton";
import SettingsMenu from "./SettingsMenu";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    spawnButton: GameObjects.Text;
    settingsMenu: SettingsMenu;
    tileSprite: GameObjects.TileSprite;
    scrollSpeed: number;

    constructor() {
        super("MainMenu");
    }

    create() {
        const { width } = this.scale

        //autoscroll backgound
        this.tileSprite = this.add.tileSprite(0, 0, 2048, 1536, 'background')
        this.tileSprite.setTilePosition(0,0);
        this.tileSprite.setScrollFactor(1);
        this.scrollSpeed = 0.3;

        this.logo = this.add.image(512, 250, "escape").setDepth(100);

        // Create buttons to switch scenes
        new PlayButton(this, 512, 500, () => {
            this.changeScene("LevelSelection");
        });

        //new InventoryButton(this, 512, 520, () => {
        //    this.changeScene("Inventory");
        //});

        new AchievementsButton(this, 512, 580, () => {
            this.changeScene("Achievements");
        });

        //settings modal
        this.settingsMenu = new SettingsMenu(this)

        const settingsButton = this.add.image(width - 10, 10, 'button').setOrigin(1,0)
        this.add.image(
            settingsButton.x - settingsButton.width * 0.5, 
            settingsButton.y + settingsButton.height * 0.47,
            'gear'
        ).setScale(0.07)

        settingsButton.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                settingsButton.setTint(0xdedede)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                settingsButton.setTint(0xffffff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                settingsButton.setTint(0x8afbff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                settingsButton.setTint(0xffffff)

                //toggle the settings
                if (this.settingsMenu.isOpen){
                    this.settingsMenu.hide()
                }else{
                    this.settingsMenu.show()
                }
                
            })
        
        EventBus.emit("current-scene-ready", this);
    }

    changeScene(scene?: string) {
        this.scene.start(scene ?? "MainMenu");
    }

    update() {
        this.tileSprite.tilePositionY -= this.scrollSpeed;
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

