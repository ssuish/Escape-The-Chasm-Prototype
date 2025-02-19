//import { Scene } from "phaser";
import { BaseLevel } from "./BaseLevel";

export class Level2 extends BaseLevel {
    constructor() {
        super("Level 2");
    }

    create() {
        this.add.text(100, 100, "Level 2", {
            fontSize: "32px",
            color: "#fff",
        });
    }
}

