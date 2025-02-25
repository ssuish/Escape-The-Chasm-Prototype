import { Scene, Input } from "phaser";
import { Player } from "./Player";

export class PlayerController {
    private cursors: {
        left: Input.Keyboard.Key;
        right: Input.Keyboard.Key;
        up: Input.Keyboard.Key;
    };
    private fireKey: Input.Keyboard.Key;
    private interactKey: Input.Keyboard.Key;
    private pauseKey: Input.Keyboard.Key;
    player: Player;

    constructor(scene: Scene, player: Player) {
        this.player = player;
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
            this.player.moveLeft();
        } else if (this.cursors.right.isDown) {
            this.player.moveRight();
        } else {
            this.player.idle();
        }

        if (this.cursors.up.isDown) {
            this.player.jump();
            console.log("[SPACE] is clicked.");
        }

        if (this.fireKey.isDown) {
            this.player.fireGun();
            console.log("[J] is clicked.");
        }

        if (this.interactKey.isDown) {
            this.player.interact();
            console.log("[K] is clicked.");
        }

        if (this.pauseKey.isDown) {
            this.player.pauseGame();
            console.log("[L] is clicked.");
        }
    }
}

