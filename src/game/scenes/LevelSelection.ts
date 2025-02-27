import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { LevelSelectButton } from "../UIComponents/LevelSelectorButton";
import { BackButton } from "../UIComponents/UIButton";
import SettingsMenu from "./SettingsMenu";

// Import all levels dynamically
//const levels = require(`../levels/${}`);

export class LevelSelection extends Scene {
    background: GameObjects.Image;
    levelImages: GameObjects.Image[] = []; // Array of level pictures
    tileSprite: GameObjects.TileSprite;
    scrollSpeed: number;
    settingsMenu: SettingsMenu;

    constructor() {
        super("LevelSelection");
    }

    create() {
        const { width } = this.scale

        //autoscroll backgound
        this.tileSprite = this.add.tileSprite(0, 0, 2048, 1536, 'background')
        this.tileSprite.setTilePosition(0,0);
        this.tileSprite.setScrollFactor(1);
        this.scrollSpeed = 0.3;

        new BackButton(this, 50, 50, () => {
            this.changeScene("MainMenu");
        });

        new LevelSelectButton(this, 512, 400, () => {
            this.changeScene("../levels/level1.ts");
        });

        //settings modal
        this.settingsMenu = new SettingsMenu(this)
        
        const settingsButton = this.add.image(width - 10, 10, 'button').setOrigin(1,0)
        this.add.image(
            settingsButton.x - settingsButton.width * 0.5, 
            settingsButton.y + settingsButton.height * 0.47,
             'gear').setScale(0.07)
        
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

    changeScene(scene: string) {
        this.scene.start(scene);
    }

    update() {
        this.tileSprite.tilePositionY -= this.scrollSpeed;  
    }

}

