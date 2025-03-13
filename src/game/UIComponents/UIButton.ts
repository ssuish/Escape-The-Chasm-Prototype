import { GameObjects, Scene } from "phaser";

// This is basic button based on the Phaser textstyle.
// TODO: Refactor the UI Button component into Image-based.
// child classes should take image paramenter to make changes.
export class UIButton extends GameObjects.Sprite {
    constructor(
        scene: Scene, //current scene
        x: number, //position in x axis
        y: number, //position in y axis
        text: string, //name ng button
        callback: () => void //any function
    ) {
        super(scene, x, y, text);
        this.on("pointerdown", callback);
        scene.add.existing(this);
    }
}

export class PlayButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "PLAY", {
            fontFamily: 'Rubik Dirt', fontSize: 48, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)     
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
            scene.add.existing(this);
    }
}

export class DashboardButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "DASHBOARD", {
            fontFamily: 'Rubik Dirt', fontSize: 48, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
            scene.add.existing(this);
    }
}

export class CreditsButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "© Escapicism", {
            fontFamily: 'Arial', fontSize: 24, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3,
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5)
                this.setStyle({ textDecoration: 'underline' });
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3)
                this.setStyle({ textDecoration: '' }); // Remove underline
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)     
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
            scene.add.existing(this);
    }
}

export class BackButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "<<<", {
            fontFamily: 'Rubik Dirt', fontSize: 48, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)     
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
            scene.add.existing(this);
    }
}

//export class PauseButton extends UIButton {
    //constructor(scene: Scene, x: number, y: number, callback: () => void) {
        //super(scene, x, y, "Pause", callback, { backgroundColor: "#ffff00" });
    //}
//}

export class RestartButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "Restart", {
            fontFamily: 'Rubik Dirt', fontSize: 48, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)     
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
            scene.add.existing(this);
    }
}

export class MainMenuButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "Main Menu", {
            fontFamily: 'Rubik Dirt', fontSize: 48, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)     
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
            scene.add.existing(this);
    }
}

export class LevelSelectButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "<< Level Select", {
            fontFamily: 'Rubik Dirt', fontSize: 24, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)     
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
            scene.add.existing(this);
    }
}

//export class ShootButton extends UIButton {
//    constructor(scene: Scene, x: number, y: number, callback: () => void) {
//        super(scene, x, y, "Shoot", callback, { backgroundColor: "#ff00ff" });
//    }
//}
