import { GameObjects, Scene } from "phaser";

export class UIButton extends GameObjects.Text {
    constructor(
        scene: Scene,
        x: number,
        y: number,
        text: string,
        callback: () => void,
        style?: Phaser.Types.GameObjects.Text.TextStyle
    ) {
        const defaultStyle = {
            fontFamily: "Arial",
            fontSize: "24px",
            color: "#ffffff",
            ...style,
        };

        super(scene, x, y, text, defaultStyle);
        this.setOrigin(0.5).setInteractive();

        this.on("pointerdown", callback);

        scene.add.existing(this);
    }
}

export class PlayButton extends UIButton {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "Play", callback, { backgroundColor: "#00ff00" });
    }
}

export class PauseButton extends UIButton {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "Pause", callback, { backgroundColor: "#ffff00" });
    }
}

export class RestartButton extends UIButton {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "Restart", callback, { backgroundColor: "#ff0000" });
    }
}

export class ShootButton extends UIButton {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "Shoot", callback, { backgroundColor: "#ff00ff" });
    }
}

