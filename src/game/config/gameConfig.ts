export const gameConfig = {
    screenWidth: 1024,
    screenHeight: 768,
    playerSpeed: 5,
    jumpForce: -10,
    maxJumps: 2,
    jumpCount: 0,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1024,
        height: 768,
    },
} as const;
