//import { Scene } from "phaser";
import { BaseLevel } from "./BaseLevel";
import { Player } from "../entities/Player";
import { EventBus } from "../EventBus";
import { Platforms } from "../objects/Platforms";
import { PlayerController } from "../entities/PlayerController";

export class Level1 extends BaseLevel {
    constructor() {
        super("Level 1");
    }

    create() {
        this.add.text(100, 100, "Test Level", {
            fontSize: "32px",
            color: "#fff",
        });

        // Add the player to the scene
        const { width, height } = this.scale;
        this.player = new Player(this, width / 2, height / 2);
        this.playerController = new PlayerController(this, this.player);

        this.basePlatform = new Platforms(this, 500, 600);
        this.basePlatform.create();

        // Add collision detection between player and platforms
        this.physics.add.collider(this.player, this.basePlatform.platforms, () => {
            this.player.setVelocityY(0);
        });

        EventBus.emit("current-scene-ready", this);
    }

    update(time: number, delta: number) {
        this.playerController.update();
    }
}

