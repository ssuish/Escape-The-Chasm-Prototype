import { Scene, Input, Types } from "phaser";
import { Player } from "./Player";

export class PlayerController {
    private cursors: Types.Input.Keyboard.CursorKeys;
    private fireKey: Input.Keyboard.Key;
    private interactKey: Input.Keyboard.Key;
    private pauseKey: Input.Keyboard.Key;
    player: Player;

    constructor(scene: Scene, player: Player) {
        this.player = player;
        if (scene.input.keyboard) {
            this.cursors = scene.input.keyboard.createCursorKeys();
            this.fireKey = scene.input.keyboard.addKey(
                Input.Keyboard.KeyCodes.J
            );
            this.interactKey = scene.input.keyboard.addKey(
                Input.Keyboard.KeyCodes.K
            );
            this.pauseKey = scene.input.keyboard.addKey(
                Input.Keyboard.KeyCodes.L
            );
        } else {
            throw new Error("Keyboard input is not available");
        }
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.moveLeft();
            console.log("[A] is clicked.");
        } else if (this.cursors.right.isDown) {
            this.player.moveRight();
            console.log("[D] is clicked.");
        } else {
            this.player.setVelocityX(0);
            console.log("Wrong Key.");
        }

        if (this.cursors.up.isDown) {
            console.log("[Space] is clicked.");
        }

        if (this.fireKey.isDown) {
            console.log("[J] is clicked.");
        }

        if (this.interactKey.isDown) {
            console.log("[K] is clicked.");
        }

        if (this.pauseKey.isDown) {
            console.log("[L] is clicked.");
        }
    }
}

