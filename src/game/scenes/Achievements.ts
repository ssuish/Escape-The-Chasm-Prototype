import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Achievements extends Scene {
    constructor() {
        super("Achievements");
    }

    create() {
        this.add.text(100, 100, "Achievements", {
            fontSize: "32px",
            color: "#fff",
        });
        EventBus.emit("current-scene-ready", this);
    }
}
