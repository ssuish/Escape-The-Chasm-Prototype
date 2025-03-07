import { GameObjects, Scene } from "phaser";
import { Player } from "../entities/Player";


export default class PlayerHealthBar extends GameObjects.Graphics {
    barWidth: number;
    barHeight: number;
    player:  Player;
    constructor(scene: Scene, x: number, y: number, player: Player) {
        super(scene, { x: x, y: y });
        this.scene = scene;
        this.player = player;
        this.barWidth = 100;
        this.barHeight = 20;

        this.draw();
        scene.add.existing(this);
        this.setScrollFactor(0); // Fix it to the camera
    }

    draw() {
        this.clear();

        // Background
        this.fillStyle(0x000000);
        this.fillRect(0, 0, this.barWidth, this.barHeight);

        // Health fill
        let percent = this.player.GetHealth() / this.player.GetMaxHealth();
        let fillWidth = this.barWidth * percent;

        let color = 0xFF0000; // Red
        if (percent > 0.5) {
            color = 0xFFFF00; // Yellow
        }
        if (percent > 0.75) {
            color = 0x00FF00; // Green
        }

        this.fillStyle(color);
        this.fillRect(0, 0, fillWidth, this.barHeight);
    }

    update() {
        this.draw();
    }
}