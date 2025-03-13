import { Scene, GameObjects } from 'phaser';
import { levelObjectives } from '../logic/LevelObjectives'; // Adjust the path

export class LevelManager extends GameObjects.Container {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);
        this.setDepth(1);
    }

    drawLevelPortrait(levelKey: string): void {
        this.removeAll(true); // Clear previous elements

        const levelData = levelObjectives[levelKey];
        if (!levelData) {
            console.error("Level data not found for:", levelKey);
            return;
        }

        const rectWidth = 450;
        const rectHeight = 500;

        // Draw rectangle
        const rect = this.scene.add.graphics();
        rect.fillStyle(0x4a4a4a, 0.8);
        rect.fillRoundedRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight, 20);
        rect.lineStyle(10, 0x000000, 1);
        rect.strokeRoundedRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight, 20);
        this.add(rect);

        // Add level name
        const nameText = this.scene.add.text(-rectWidth / 2 + 20, -rectHeight / 2 + 20, levelData.name, {
            fontFamily: 'Rubik Dirt', fontSize: 40, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5
        }).setOrigin(0);
        this.add(nameText);

        // Add objectives
        let yOffset = -rectHeight / 2 + 90; // Start below the level name
        const yStep = 45;

        levelData.stars.forEach((star) => {
            const objectiveText = this.scene.add.text(-rectWidth / 2 + 20, yOffset, `${star.objective}`, {
                fontFamily: 'Arial', fontSize: 20, color: '#ffffff',
                stroke: '#000000', strokeThickness: 5
            }).setOrigin(0);
            this.add(objectiveText);
            yOffset += yStep;
        });
        
        const crosshair1 = this.scene.add.image(-rectWidth / 2 + 125, yOffset + 70, 'hex').setScale(0.15).setOrigin(0.5);
        const crosshair2 = this.scene.add.image(-rectWidth / 2 + 225, yOffset + 70, 'hex').setScale(0.15).setOrigin(0.5);
        const crosshair3 = this.scene.add.image(-rectWidth / 2 + 325, yOffset + 70, 'hex').setScale(0.15).setOrigin(0.5);
        this.add(crosshair1);
        this.add(crosshair2);
        this.add(crosshair3);
    }    
}