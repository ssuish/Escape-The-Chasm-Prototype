import { Scene, Input } from "phaser";
import { EventBus } from "../EventBus";

export class PlayerController {
    private cursors: {
        left: Input.Keyboard.Key;
        right: Input.Keyboard.Key;
        up: Input.Keyboard.Key;
    };
    private fireKey: Input.Keyboard.Key;
    private interactKey: Input.Keyboard.Key;
    private pauseKey: Input.Keyboard.Key;

    constructor(scene: Scene) {
        if (scene.input.keyboard) {
            this.cursors = {
                left: scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.A),
                right: scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.D),
                up: scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE),
            };
            this.fireKey = scene.input.keyboard.addKey(
                Input.Keyboard.KeyCodes.J
            );
            this.interactKey = scene.input.keyboard.addKey(
                Input.Keyboard.KeyCodes.K
            );
            this.pauseKey = scene.input.keyboard.addKey(
                Input.Keyboard.KeyCodes.L
            );
            console.log("Keyboard input registered"); // Debug log
        } else {
            throw new Error("Keyboard input is not available");
        }
    }

    update() {
        if (this.cursors.left.isDown) {
            EventBus.emit("player-move-left");
        } else if (this.cursors.right.isDown) {
            EventBus.emit("player-move-right");
        } else {
            EventBus.emit("player-idle");
        }

        if (this.cursors.up.isDown) {
            EventBus.emit("player-jump");
            console.log("[SPACE] is clicked.");
        }

        if (this.fireKey.isDown) {
            EventBus.emit("player-fire");
            console.log("[J] is clicked.");
        }

        if (this.interactKey.isDown) {
            EventBus.emit("player-interact");
            console.log("[K] is clicked.");
        }

        if (this.pauseKey.isDown) {
            EventBus.emit("player-pause");
            console.log("[L] is clicked.");
        }
    }
}