import { Scene } from "phaser";

export class Player {
    private jumpForce: number;
    private jumpCount: number;
    private maxJumps: number;

    constructor(
        scene: Scene,
        x: number,
        y: number
        //jumpForce: number = -330,
        //maxJumps: number = 2 // Allow double jumps
    ) {}

    static preload(scene: Scene) {
        scene.load
            .atlas(
                "player",
                "/player/player_placeholder.png",
                "/player/player_placeholder.json"
            )
            .on("loaderror", () => {
                console.error(`Failed to load atlas.`);
            });
    }

    // moveLeft() {
    //     this.setVelocityX(-160);
    // }

    // moveRight() {
    //     this.setVelocityX(160);
    // }

    // jump() {
    //     if (this.jumpCount < this.maxJumps) {
    //         console.log(this.jumpCount);
    //         this.setVelocityY(this.jumpForce);
    //         this.jumpCount++;
    //     }
    // }

    resetJumpCount() {
        this.jumpCount = 0;
    }

    fireGun() {
        console.log("Fire gun");
    }

    interact() {
        console.log("Interact");
    }

    pauseGame() {
        console.log("Pause game");
    }
}

