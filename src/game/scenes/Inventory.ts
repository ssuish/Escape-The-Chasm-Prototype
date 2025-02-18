import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Inventory extends Scene {
    constructor() {
        super("Inventory");
    }

    create() {
        this.add.text(100, 100, "Inventory", {
            fontSize: "32px",
            color: "#fff",
        });
        EventBus.emit("current-scene-ready", this);
    }
}
