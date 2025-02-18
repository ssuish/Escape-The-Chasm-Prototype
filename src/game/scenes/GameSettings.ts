export class GameSettings {
    private volume: number;
    private controls: { [key: string]: string };

    constructor() {
        this.volume = 1.0; // Default volume
        this.controls = {
            jump: "Space",
            moveLeft: "A",
            moveRight: "D",
            shoot: "J",
        };
        // Default controls
        // A: moveLeft, D: moveRight, SPACE: jump, J: fire, K: interact, L: pauseMenu
    }

    public setVolume(newVolume: number): void {
        this.volume = newVolume;
    }

    public getVolume(): number {
        return this.volume;
    }

    public setControl(action: string, key: string): void {
        this.controls[action] = key;
    }

    public getControl(action: string): string {
        return this.controls[action];
    }

    public resetSettings(): void {
        this.volume = 1.0;
        this.controls = {
            jump: "Space",
            moveLeft: "ArrowLeft",
            moveRight: "ArrowRight",
            shoot: "Control",
        };
    }
}
