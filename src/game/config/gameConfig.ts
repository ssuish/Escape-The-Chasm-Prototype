export const gameConfig = {
    screenWidth: 1024,
    screenHeight: 768,
    playerSpeed: 5,
    jumpForce: -12,
    maxJumps: 2,
    jumpCount: 0,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1024,
        height: 768,
    },
    playerConfig: {
        speed: 5,
        maxHealth: 100,
        jumpForce: -12,
        scale: 1.8,
        maxJumps: 2,
        jumpCount: 0,
    },
    basicGunConfig: {
        fireRate: 300,
        bulletSpeed: 20,
        bulletDamage: 10,
    },
    enemyFootmanConfig: {
        speed: 5,
        maxHealth: 30,
        damage: 3,
        jumpForce: -12,
        scale: 1.8,
    },
} as const;

