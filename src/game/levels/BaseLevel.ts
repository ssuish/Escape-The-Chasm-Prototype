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

            const objectsLayer = map.getObjectLayer("Objects");

            objectsLayer?.objects.forEach((objData) => {
                const {
                    x = this.scale.width / 2,
                    y = this.scale.height / 2,
                    width = 0,
                    name,
                } = objData;

                switch (name) {
                    case "playerSpawn": {
                        this.handlePlayerSpawn(x, y);
                        break;
                    }

                    case "enemySpawn": {
                        this.handleEnemySpawn(x, y, width);
                        break;
                    }

                    default:
                        console.error(`Object: ${name} is not implemented.`);
                        break;
                }
            });
        } else {
            console.error("Tileset is null");
        }

        // Entities will fall down faster
        this.matter.world.setGravity(0, 2);

        // Camera Settings
        const mapHeight = map.heightInPixels;
        this.cameras.main.scrollY = mapHeight - this.cameras.main.height;
    }

    handlePlayerSpawn(x: number, y: number) {
        const playerSprite = this.matter.add.sprite(x, y, "player", 0, {label: "player"});
        this.player = new Player(playerSprite);

        if (this.player) {
            this.playerController = new PlayerController(this, this.player);
        }
    }

    handleEnemySpawn(x: number, y: number, width: number) {
        const randomX = x + Math.random() * width;
        const enemySprite = this.matter.add.sprite(randomX, y, "enemy", 0, {label: "enemy"});
        console.error("Enemy is not implemented yet.");
        // this.enemy = new Enemy(enemySprite);

        // if (this.enemy)
        // {
        //     // Enemy AI
        //     // Enemy Event Handling
        // }
    }

    update(deltaTime: number) {
        this.playerController.update(deltaTime);
    }
}

