import { Scene, GameObjects } from 'phaser';
import { levelObjectives } from '../logic/LevelObjectives';

export class LevelManager extends GameObjects.Container {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);
        this.setDepth(1);
    }

    drawLevelPortrait(levelKey: string): void {
        this.removeAll(true);

        const levelData = levelObjectives[levelKey];
        if (!levelData) {
            console.error("Level data not found for:", levelKey);
            return;
        }

        const rectWidth = 550;
        const rectHeight = 500;

        // Draw rectangle
        this.scene.add.image(512, 384, "card").setScale(1.1);

        // Add level name
        const nameText = this.scene.add.text(-rectWidth / 2 + 20, -rectHeight / 2 + 20, levelData.name, {
            fontFamily: 'Rubik Dirt', fontSize: 40, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0);
        this.add(nameText);

        // Add objectives
        let yOffset = -rectHeight / 2 + 90;
        const yStep = 45;

        levelData.stars.forEach((star) => { // Removed index parameter
            const objectiveText = this.scene.add.text(-rectWidth / 2 + 35, yOffset + 24, `${star.objective}`, {
                fontFamily: 'Rubik Dirt', fontSize: 22,
                color: star.completed ? '#00ff00' : '#ffffff',
                stroke: '#000000', strokeThickness: 5
            }).setOrigin(0);
            this.add(objectiveText);

            const achievementImageKey = star.completed ? 'complete' : 'fail';
            const achievementImage = this.scene.add.image(-rectWidth / 2 + 10, yOffset + 40, achievementImageKey);
            achievementImage.setScale(0.06); // Adjust scale if needed
            this.add(achievementImage);
            yOffset += yStep;
        });
    }
}