import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class LevelSelection extends Scene {
    constructor() {
        super("LevelSelection");
    }

    create() {
        this.add.text(100, 100, "Select a Level", {
            fontSize: "32px",
            color: "#fff",
        });
        EventBus.emit("current-scene-ready", this);
    }
}

