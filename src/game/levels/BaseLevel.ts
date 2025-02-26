import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { PlayerController } from "../entities/PlayerController";

export class BaseLevel extends Scene {
    levelName: string;
    playerController: PlayerController;
    player?: Player;

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

        let spawnX = this.scale.width / 2;
        let spawnY = this.scale.height / 2;

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

            const objectsLayer = map.getObjectLayer("objects");

            if (objectsLayer) {
                objectsLayer.objects.forEach((objData) => {
                    const { x = 0, y = 0, name } = objData;
                    if (name === "spawner") {
                        spawnX = x;
                        spawnY = y;
                    }
                });
            }
        } else {
            console.error("Tileset is null");
        }

        const playerSprite = this.matter.add.sprite(spawnX, spawnY, "player");

        this.matter.world.setGravity(0, 2);

        // Camera Settings
        const mapHeight = map.heightInPixels;
        this.cameras.main.scrollY = mapHeight - this.cameras.main.height;
        
        // Instantiate the Player class
        this.player = new Player(playerSprite);

        if (this.player) {
            // Player Controls
            this.playerController = new PlayerController(this, this.player);
        }
    }

    update(deltaTime: number) {
        this.playerController.update(deltaTime);
    }
}

