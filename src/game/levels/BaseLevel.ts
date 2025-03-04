import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { PlayerController } from "../entities/PlayerController";
import CollisionIdentifier from "../logic/CollisionIdentifier";

export class BaseLevel extends Scene {
    levelName: string;
    playerController: PlayerController;
    player?: Player;
    private obstacles!: CollisionIdentifier;

    constructor(levelName: string) {
        super(levelName);
        this.levelName = levelName;
    }

    init() {
        this.obstacles = new CollisionIdentifier();
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

            if (wall) {
                wall.setCollisionByProperty({ collides: true });
                this.matter.world.convertTilemapLayer(wall);
                // wall.forEachTile((tile) => {
                //     if (tile.collides) {
                //         // TODO: Tiles stickyness not yet fixed.
                //     }
                // });
            }
            if (elevator) {
                elevator.setCollisionByProperty({ collides: true });
                this.matter.world.convertTilemapLayer(elevator);
            } else {
                console.error("Failed to create Elevator layer");
            }

            const objectsLayer = map.getObjectLayer("Objects");

            objectsLayer?.objects.forEach((objData) => {
                const { x = 0, y = 0, width = 0, height = 0, name } = objData;

                switch (name) {
                    case "playerSpawn": {
                        this.handlePlayerSpawn(x, y);
                        break;
                    }

                    case "enemySpawn": {
                        this.handleEnemySpawn(x, y, width);
                        break;
                    }

                    case "deadEnd": {
                        this.handleDeadEnd(x, y, width, height);
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
        const mapWidth = map.widthInPixels;
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.setZoom(1);
        this.cameras.main.scrollY = mapHeight - this.cameras.main.height;
        this.cameras.main.scrollX = mapWidth / 2 - this.cameras.main.width;
    }

    handlePlayerSpawn(x: number, y: number) {
        const playerSprite = this.matter.add.sprite(x, y, "player", 0, {
            label: "player",
        });
        this.player = new Player(playerSprite, this.obstacles, this);

        if (this.player) {
            this.playerController = new PlayerController(this, this.player);
        }
    }

    handleEnemySpawn(x: number, y: number, width: number) {
        const randomX = x + Math.random() * width;
        const enemySprite = this.matter.add.sprite(
            randomX,
            y,
            "enemy-footman",
            0,
            { label: "enemy-footman" }
        );
        enemySprite.name = "enemy-footman";
        console.error("Enemy is not implemented yet.");
        // this.enemy = new Enemy(enemySprite);

        // if (this.enemy)
        // {
        //     // Enemy AI
        //     // Enemy Event Handling
        // }
    }

    handleDeadEnd(x: number, y: number, width: number, height: number) {
        const adjustedX = x + width / 2;
        const adjustedY = y + height / 2;
        const deadEnd = this.matter.add.rectangle(
            adjustedX,
            adjustedY,
            width,
            height,
            {
                isStatic: true,
                isSensor: true,
                label: "deadEnd",
            }
        );
        this.obstacles.add("deadEnd", deadEnd);
    }

    update(deltaTime: number) {
        this.playerController.update(deltaTime);
    }
}

