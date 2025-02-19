import { Scene } from "phaser";
import { Platforms as Base } from "../objects/Platforms";
import { Player } from "../entities/Player";
import { PlayerController } from "../entities/PlayerController";

export class BaseLevel extends Scene {
    levelName: string;
    basePlatform: Base;
    player: Player;
    playerController: PlayerController;

    constructor(levelName: string) {
        super(levelName);
        this.levelName = levelName;
    }

    preload() {
        Player.preload(this);
        Base.preload(this);
    }
}


