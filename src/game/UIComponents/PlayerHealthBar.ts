import { GameObjects, Scene } from "phaser";
import { Player } from "../entities/Player";

export default class PlayerHealthBar extends GameObjects.Graphics {
    barWidth: number;
    barHeight: number;
    player:  Player;
    borderThickness: number;
    borderRadius: number;
    borderColor: number;
    //playerProfile: GameObjects.Sprite;
    constructor(scene: Scene, x: number, y: number, player: Player, /*displayPlayer: GameObjects.Sprite*/) {
        super(scene)
        this.x = 90;
        this.y = 20;
        this.scene = scene;
        this.player = player;
        this.barWidth = (this.player.GetHealth() * 2);
        this.barHeight = 40;
        this.borderThickness = 7;
        this.borderRadius = 10;
        this.borderColor = 0x717171;

        //this.playerProfile = scene.add.sprite(x - 40, y + this.barHeight / 2, /*displayPlayer*/)

        this.draw();
        scene.add.existing(this);
        this.setScrollFactor(0); // Fix it to the camera
    }

    draw() {
        this.clear();

        // Background
        this.fillStyle(0xa9a9a9);
        this.fillRoundedRect(0, 0, this.barWidth, this.barHeight, this.borderRadius);

        //border
        this.lineStyle(this.borderThickness, this.borderColor, 1)
        this.strokeRoundedRect(0, 0, this.barWidth, this.barHeight, this.borderRadius);

        // Health fill
        let percent = this.player.GetHealth() / this.player.GetMaxHealth();
        if (percent > 0) {
            let fillWidth = this.barWidth * percent;
            let color = 0xb11414; // Red
            if (color)
            if (percent > 0.25) {
                color = 0xc0ca24; // Yellow
            }
            if (percent > 0.50) {
                color = 0x2daf2d; // Green
            }

        this.fillStyle(color); //fill color health
        this.fillRoundedRect(3, 3, fillWidth - 5, this.barHeight - 5, this.borderRadius);
        }
    }

    update() {
        this.draw();
    }
}