import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { BackButton } from "../UIComponents/UIButton";

export class Credits extends Scene {
    constructor() {
        super("Credits");
    }

    create() {
        new BackButton(this, 15, 10, () => {
            this.changeScene("MainMenu");
        });

        EventBus.emit("current-scene-ready", this);

        this.add.text(512, 100, "ATTRIBUTIONS", {
            fontFamily: 'Rubik Dirt', fontSize: 48,
            color: '#ffffff',
            stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(512, 200, " + Joel Steudler | Modern Day Massive - Pyscho Analysis", {
            fontFamily: 'Rubik Dirt', fontSize: 22,
            color: '#ffffff',
            stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(512, 250, " + Floraphonic | Metal Hit 95", {
            fontFamily: 'Rubik Dirt', fontSize: 22,
            color: '#ffffff',
            stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(512, 300, " + Yael Gomez | Gunshot Sound - Heavy FX", {
            fontFamily: 'Rubik Dirt', fontSize: 22,
            color: '#ffffff',
            stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(512, 400, "We are Escapicism!", {
            fontFamily: 'Rubik Dirt', fontSize: 36,
            color: '#ffffff',
            stroke: '#000000', strokeThickness: 5
        }).setOrigin(1);

        this.add.text(150, 420, "We are looking for developers and artists who share the same vision with us to" + 
            " revolutionize this Web3 game industry. So please join our community.", {
            fontFamily: 'Rubik Dirt', fontSize: 22,
            color: '#ffffff',
            stroke: '#000000', strokeThickness: 5, wordWrap: {width: 750, useAdvancedWrap: true}
        }).setOrigin(0);

        this.add.text(150, 520, "The Escape the Chasm art and graphics assets and scripts are © 2025 Escapicism.", {
            fontFamily: 'Rubik Dirt', fontSize: 22,
            color: '#ffffff',
            stroke: '#000000', strokeThickness: 5, wordWrap: {width: 750, useAdvancedWrap: true}
        }).setOrigin(0);

        this.add.text(512, 650, "All rights reserved.", {
            fontFamily: 'Rubik Dirt', fontSize: 22,
            color: '#ffffff',
            stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);
        
    }
    
    changeScene(scene: string) {
        this.scene.start(scene);
    }
}

