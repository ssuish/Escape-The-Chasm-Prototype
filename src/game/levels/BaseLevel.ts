import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { PlayerController } from "../entities/PlayerController";
import CollisionIdentifier from "../logic/CollisionIdentifier";
import { EnemyFootman } from "../entities/EnemyFootman";
import PlayerHealthBar from "../UIComponents/PlayerHealthBar";
import { EventBus } from "../EventBus";
import { Achievement, achievements } from "../logic/PlayerAchievement";

const TILESET_PATH = "assets/tileset";
const TILESET_IMAGE = "platformerPack_industrial_tilesheet.png";
const TILEMAP_JSON = "game-map.tmj";
const TILEMAP_KEY = "tilemap";
const TILESET_KEY = "tilesheet";
const GRAVITY_Y = 2;
const CAMERA_ZOOM = 1;
const ENEMY_SPAWN_INTERVAL = 5000; // Interval in milliseconds
const ENEMY_SPAWN_DURATION = 60000; // Total duration in milliseconds
const PLAYER_HEALTHBAR_X = 90;
const PLAYER_HEALTHBAR_Y = 20;

export interface PlayerStats {
    enemiesDefeated: number;
    currentHealth: number;
    maxHealth: number;
}

export class BaseLevel extends Scene {
    levelName: string;
    playerController: PlayerController;
    player: Player;
    enemyFootman: EnemyFootman;
    private obstacles!: CollisionIdentifier;
    private numberOfEnemies: number;
    private enemySpawnTimer!: Phaser.Time.TimerEvent;
    private map!: Phaser.Tilemaps.Tilemap;
    private enemiesSpawned: number = 0;
    playerHealthBar: PlayerHealthBar;
    private defeatedEnemies: number = 0;
    private playerSprite: Phaser.Physics.Matter.Sprite;

    constructor(levelName: string, numberOfEnemies: number) {
        super(levelName);
        this.levelName = levelName;
        this.numberOfEnemies = numberOfEnemies;
    }

    init() {
        this.obstacles = new CollisionIdentifier();
    }

    preload() {
        this.load.setPath(TILESET_PATH);

        this.load.image(TILESET_KEY, TILESET_IMAGE).on("loaderror", () => {
            console.error(`Failed to load tilesheet image.`);
        });

        this.load
            .tilemapTiledJSON(TILEMAP_KEY, TILEMAP_JSON)
            .on("loaderror", () => {
                console.error(`Failed to load tilemap.`);
            });

        Player.preload(this);
        EnemyFootman.preload(this);
    }

    create() {
        this.load.setPath("assets");

        this.map = this.make.tilemap({ key: TILEMAP_KEY });
        const tileset = this.map.addTilesetImage(
            "industrial_tilesheet",
            TILESET_KEY
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
        this.matter.world.setGravity(0, GRAVITY_Y);

        // Camera Settings
        const mapHeight = this.map.heightInPixels;
        const mapWidth = this.map.widthInPixels;
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.setZoom(CAMERA_ZOOM);
        this.cameras.main.scrollY = mapHeight - this.cameras.main.height;
        this.cameras.main.scrollX = mapWidth / 2 - this.cameras.main.width;

        // Timer
        this.startEnemySpawnTimer();

        //Achievements Event
        //Reference
        //EventBus.on("[event name]"), () => {
        //    this.awardAchievement("[id]");
        //    console.log("[console maeesage]");
        //});

        EventBus.on("defeated5Enemies", () => {
            this.awardAchievement("defeat5Enemies");
            console.log("EVENT: DEFEATED 5 ENEMIES");
        });

        EventBus.on("defeated10Enemies", () => {
            this.awardAchievement("defeat10Enemies");
            console.log("EVENT: DEFEATED 10 ENEMIES");
        });

        EventBus.on("health75", () => {
            this.awardAchievement("mvPlayer");
            console.log("EVENT: MVP");
        });

        EventBus.on("noDamage", () => {
            this.awardAchievement("opPlayer");
            console.log("EVENT: OP");
        });

        //EventBus.on('enemy-defeated-onDeadEnd')
        EventBus.on("player-defeated", this.handleDefeatCondition, this);
    }

    awardAchievement(achievementID: string) {
        console.log("awardAchievement called", achievementID);
        const achievement: Achievement = achievements[achievementID];
        console.log("Achievement object:", achievement);

        if (achievement) {
            if (!achievement.earned) {
                console.log(achievement.earned);
                achievement.earned = true;
                EventBus.emit("achievementUnlocked", achievement);
            }
        }
    }

    startEnemySpawnTimer() {
        this.enemySpawnTimer = this.time.addEvent({
            delay: ENEMY_SPAWN_INTERVAL,
            callback: this.spawnEnemies,
            callbackScope: this,
            repeat: ENEMY_SPAWN_DURATION / ENEMY_SPAWN_INTERVAL - 1,
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
                        "enemy_footman",
                        0,
                        { label: "enemy-footman" }
                    );

                    // Set additional properties for the sprite
                    // enemySprite.setScale(2.5);
                    // enemySprite.setFixedRotation();
                    enemySprite.name = "enemy-footman";

                    if (!this.player) {
                        console.error("player is missing");
                        return;
                    }

                    if (!this.playerSprite) {
                        console.error("Player sprite is missing");
                        return;
                    }

                    const enemyFootman = new EnemyFootman(
                        enemySprite,
                        this.obstacles,
                        this.playerSprite,
                        this
                    );

                    this.enemyFootman = enemyFootman;

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
        //Achievements
        if (this.defeatedEnemies === 5) {
            EventBus.emit("defeated5Enemies");
        }
        if (this.defeatedEnemies === 10) {
            EventBus.emit("defeated10Enemies");
        }
        if (this.defeatedEnemies === 10 && this.player.GetHealth() / this.player.GetMaxHealth() >= 0.75 ){
            EventBus.emit("health75");
        }
        if (this.defeatedEnemies === 10 && this.player.GetHealth() / this.player.GetMaxHealth() === 1 ){
            EventBus.emit("noDamage");
        }
    }

    handleWinCondition() {
        console.log("All enemies defeated! You win!");

        const playerStats: PlayerStats = {
            enemiesDefeated: this.defeatedEnemies,
            currentHealth: this.player.GetHealth(),
            maxHealth: this.player.GetMaxHealth(),
        };
        this.restartLevel();
        this.scene.start("GameVictory", {
            levelKey: "level1",
            playerStats: playerStats,
        });
    }

    handleDefeatCondition() {
        console.log("Player defeated! Restarting level...");

        // Clean up player and enemy objects
        this.player?.cleanup();
        this.enemyFootman?.destroy();

        // Reset necessary states
        this.defeatedEnemies = 0;
        this.enemiesSpawned = 0;

        // Restart the scene
        this.scene.start("GameOver");
    }

    handlePlayerSpawn(x: number, y: number) {
        this.playerSprite = this.matter.add.sprite(x, y, "player", 0, {
            label: "player",
        });
        this.player = new Player(this.playerSprite, this.obstacles, this);

        // Store the player in the scene's data
        this.data.set("player", this.playerSprite);

        if (this.player) {
            this.playerController = new PlayerController(this, this.player);
            this.playerHealthBar = new PlayerHealthBar(
                this,
                PLAYER_HEALTHBAR_X,
                PLAYER_HEALTHBAR_Y,
                this.player
            );
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
            this.enemyFootman?.update(deltaTime);
        }
    }

    restartLevel() {
        // Clean up player and enemy objects
        this.player?.cleanup();
        this.enemyFootman?.destroy();

        // Reset necessary states
        this.defeatedEnemies = 0;
        this.enemiesSpawned = 0;

        // Restart the scene
        this.scene.restart();
    }
}

