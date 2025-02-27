//import { Scene } from "phaser";
//import { EventBus } from "../EventBus";

export default class SettingsMenu {

    private scene: Phaser.Scene
    private container!: Phaser.GameObjects.Container
    private checkmark!: Phaser.GameObjects.Image

    private _opened = false

    get isOpen(){
        return this._opened
    }

    constructor(scene: Phaser.Scene){

        this.scene = scene

        const { width } = scene.scale

        this.container = scene.add.container(width + 300, 80)

        const panel = scene.add.nineslice(0, 0, 'button', 24)
            .setOrigin(1,0)

        const toggleButton = scene.add.image(-panel.width + 30, 30, 'button').setScale(0.7)

        this.checkmark = scene.add.image(
            toggleButton.x + toggleButton.width - 64, 
            toggleButton.y + toggleButton.height - 65, 
            'check').setScale(0.1)

        const text = scene.add.text(
            toggleButton.x + toggleButton.width - 25, 
            toggleButton.y + toggleButton.height - 73,
            'Music',
            { 
                color: 'black',
                fontSize: 20,
                fontFamily: 'TNR'
            }
        )

        this.container.add(panel)
        this.container.add(toggleButton)
        this.container.add(this.checkmark)
        this.container.add(text)

        toggleButton.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                toggleButton.setTint(0xc7c7c7);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                toggleButton.setTint(0xFFFFFF);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                toggleButton.setTint(0xFFFFFF);

                this.toggleSound()
            })

    }

    show(){
        if (this._opened){
            return
        }
        const { width } = this.scene.scale

        this.scene.tweens.add({
            targets: this.container,
            x: width - 10,
            duration: 300,
            ease: Phaser.Math.Easing.Sine.InOut
        })

        this._opened = true
    }

    hide(){
        if (!this._opened){
            return
        }
        const { width } = this.scene.scale

        this.scene.tweens.add({
            targets: this.container,
            x: width + 300,
            duration: 300,
            ease: Phaser.Math.Easing.Sine.InOut
        })

        this._opened = false
    }

    private toggleSound() {
        let isMute =this.checkmark.visible

        isMute = !isMute

        this.scene.sound.mute = !isMute

        this.checkmark.visible = isMute
    }

}
