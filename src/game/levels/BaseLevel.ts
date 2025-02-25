import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { PlayerController } from "../entities/PlayerController";
import { gameConfig } from "../config/gameConfig";

export class BaseLevel extends Scene {
    levelName: string;
    playerController: PlayerController;
    player: Player;

    constructor(levelName: string) {
        super(levelName);
        this.levelName = levelName;
    }

    preload() {
        this.load.setPath("/assets/");

        Player.preload(this);

        this.load
            .image(
                "tilesheet",
                "/tileset/platformerPack_industrial_tilesheet.png"
            )
            .on("loaderror", () => {
                console.error(`Failed to load tilesheet image.`);
            });

        this.load
            .tilemapTiledJSON("tilemap", "/tileset/game-map.json")
            .on("loaderror", () => {
                console.error(`Failed to load tilemap.`);
            });

        // this.basePlatform = new Platforms(this, 500, 500, 200, 32);
        // this.basePlatform.create();
    }

    create() {
        this.load.setPath("assets");

        const map = this.make.tilemap({ key: "tilemap" });
        const tileset = map.addTilesetImage(
            "industrial_tilesheet",
            "tilesheet"
        );

        if (tileset) {
            const wall = map.createLayer("Wall", tileset);
            const elevator = map.createLayer("Elevator", tileset);

            wall?.setCollisionByProperty({ collides: true });

            if (wall) {
                this.matter.world.convertTilemapLayer(wall);
            }
            if (elevator) {
                elevator.setCollisionByProperty({ collides: true });
                this.matter.world.convertTilemapLayer(elevator);
            } else {
                console.error("Failed to create Elevator layer");
            }
        } else {
            console.error("Tileset is null");
        }

        // Camera Settings
        const mapHeight = map.heightInPixels;
        this.cameras.main.scrollY = mapHeight - this.cameras.main.height;

        const { width, height } = this.scale;

        // Instantiate the Player class and create animations
        this.player = new Player(
            this,
            width * 0.5,
            height * 0.5,
            "player",
            gameConfig.playerSpeed
        );

        this.player.createAnimation(this);

        // Create the player with a Matter.js body
        this.player.setRectangle(this.player.width, this.player.height);
        this.player.setFixedRotation();

        // Player Controls
        this.playerController = new PlayerController(this, this.player);

        // Player Animations
        this.player.play("idle");
    }

    update() {
        this.playerController.update();
    }
}


