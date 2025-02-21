import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
        this.load.image("logo", "assets/logo.png");
        this.load.image("background", "assets/bg.png");
        this.load.image("escape", "assets/escape.png");
        this.load.image("play", "assets/play.png");
        this.load.image("inventory", "assets/inventory.png");
        this.load.image("achieve", "assets/achieve.png");
        this.load.image("settings", "assets/settings.png");
        this.load.image("setting", "assets/setting.png");
        this.load.image("back", "assets/back.png");
    }

    create() {
        this.scene.start("Preloader");
    }
}

