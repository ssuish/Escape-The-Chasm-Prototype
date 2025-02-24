//import { Scene } from "phaser";
import { BaseLevel } from "./BaseLevel";
import { EventBus } from "../EventBus";

export class Level1 extends BaseLevel {
    constructor() {
        super("Level 1");
    }

    preload(): void {
        super.preload();
    }

    create() {
        this.add.text(100, 100, "Test Level", {
            fontSize: "32px",
            color: "#fff",
        });

        super.create();

        EventBus.emit("current-scene-ready", this);
    }
}

