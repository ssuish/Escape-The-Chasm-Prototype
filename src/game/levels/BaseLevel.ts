import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { PlayerController } from "../entities/PlayerController";
import CollisionIdentifier from "../logic/CollisionIdentifier";
import { EnemyFootman } from "../entities/EnemyFootman";
import PlayerHealthBar from "../UIComponents/PlayerHealthBar";

export class BaseLevel extends Scene {
    levelName: string;
    playerController?: PlayerController;
    player?: Player;
    enemyFootman?: EnemyFootman;
    private obstacles!: CollisionIdentifier;
    private numberOfEnemies: number;
    private enemySpawnTimer!: Phaser.Time.TimerEvent;
    private map!: Phaser.Tilemaps.Tilemap;
    private enemiesSpawned: number = 0;
    playerHealthBar: PlayerHealthBar;
    private defeatedEnemies: number = 0;

    constructor(levelName: string, numberOfEnemies: number) {
        super(levelName);
        this.levelName = levelName;
        this.numberOfEnemies = numberOfEnemies;
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

        this.map = this.make.tilemap({ key: "tilemap" });
        const tileset = this.map.addTilesetImage(
            "industrial_tilesheet",
            "tilesheet"
        );

        if (tileset) {
            const wall = this.map.createLayer("Wall", tileset);
            const elevator = this.map.createLayer("Elevator", tileset);

            if (wall) {
                wall.setCollisionByProperty({ collides: true });
                this.matter.world.convertTilemapLayer(wall);
            }
            if (elevator) {
                elevator.setCollisionByProperty({ collides: true });
                this.matter.world.convertTilemapLayer(elevator);
            } else {
                console.error("Failed to create Elevator layer");
            }

            const objectsLayer = this.map.getObjectLayer("Objects");

            objectsLayer?.objects.forEach((objData) => {
                const { x = 0, y = 0, width = 0, height = 0, name } = objData;

                switch (name) {
                    case "playerSpawn": {
                        this.handlePlayerSpawn(x, y);
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
        const mapHeight = this.map.heightInPixels;
        const mapWidth = this.map.widthInPixels;
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.setZoom(1);
        this.cameras.main.scrollY = mapHeight - this.cameras.main.height;
        this.cameras.main.scrollX = mapWidth / 2 - this.cameras.main.width;

        // Timer
        this.startEnemySpawnTimer();

        // Create the health bar
        if (this.player){
            this.playerHealthBar = new PlayerHealthBar(this, 10, 10, this.player); //display profileplayer
        }
    }

    startEnemySpawnTimer() {
        const spawnInterval = 5000; // Interval in milliseconds
        const spawnDuration = 60000; // Total duration in milliseconds

        this.enemySpawnTimer = this.time.addEvent({
            delay: spawnInterval,
            callback: this.spawnEnemies,
            callbackScope: this,
            repeat: spawnDuration / spawnInterval - 1,
        });
    }

    spawnEnemies() {
        if (this.enemiesSpawned >= this.numberOfEnemies) {
            this.enemySpawnTimer.remove(); // Stop the timer if the limit is reached
            return;
        }

        const objectsLayer = this.map.getObjectLayer("Objects");

        objectsLayer?.objects.forEach((objData) => {
            const { x = 0, y = 0, width = 0, name } = objData;

            if (name === "enemySpawn") {
                const spawnCount = Math.random() < 0.5 ? 1 : 2; // 50% chance to spawn 1 or 2 enemies
                
                for (let i = 0; i < spawnCount; i++) {

                    const randomX = x + Math.random() * width;
                    const enemySprite = this.matter.add.sprite(
                        randomX,
                        y,
                        "enemy-footman",
                        0,
                        { label: "enemy-footman" }
                    );
                    enemySprite.name = "enemy-footman";

                    if (!this.player) {
                        console.error("player is missing");
                        return;
                    }

                    const playerSprite = this.player?.getPlayerSprite();
                    if (!playerSprite) {
                        console.error("Player sprite is missing");
                        return;
                    }

                    const enemyFootman = new EnemyFootman(
                        enemySprite,
                        this.obstacles,
                        playerSprite,
                        this
                    );

                    if (enemyFootman) {
                        // TODO: Add methods to handle enemy behavior
                    }

                    this.enemiesSpawned++;
                    console.log("Enemy spawn count: ", this.enemiesSpawned);
                }
            }
        });
    }

    incrementDefeatedEnemies() {
        this.defeatedEnemies++;
        console.log(`Defeated enemies: ${this.defeatedEnemies}`);
        if (this.defeatedEnemies >= this.numberOfEnemies) {
            this.handleWinCondition();
        }
    }

    handleWinCondition() {
        console.log("All enemies defeated! You win!");

        // TODO Add win condition
        this.scene.stop(this.levelName);
        this.scene.start("GameVictory");
    }

    handlePlayerSpawn(x: number, y: number) {
        const playerSprite = this.matter.add.sprite(x, y, "player", 0, {
            label: "player",
        });
        this.player = new Player(playerSprite, this.obstacles, this);

        if (this.player) {
            this.playerController = new PlayerController(this, this.player);
            this.playerHealthBar = new PlayerHealthBar(this, x, y, this.player);
            this.playerHealthBar.draw();
        }
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
        if (this.player?.getPlayerSprite()) {
            this.playerController?.update(deltaTime);
            this.playerHealthBar.update();
        }
    }
}

