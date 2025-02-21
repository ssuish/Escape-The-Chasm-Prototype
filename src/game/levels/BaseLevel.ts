import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { PlayerController } from "../entities/PlayerController";

export class BaseLevel extends Scene {
    levelName: string;
    playerController: PlayerController;

    constructor(levelName: string) {
        super(levelName);
        this.levelName = levelName;
    }

    preload() {
        this.load.setPath("/public/assets/");

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
                this.matter.world.convertTilemapLayer(elevator);
            }
        } else {
            console.error("Tileset is null");
        }

        const mapHeight = map.heightInPixels;
        this.cameras.main.scrollY = mapHeight - this.cameras.main.height + 25;

        const { width, height } = this.scale;

        this.matter.add.sprite(width * 0.5, height * 5, "player");
    }

    update() {
        //this.playerController.update();
    }
}

