import { GameObjects } from "phaser";
import { MusicButton } from "../UIComponents/UIButton";

export class MusicToggle extends Phaser.Scene {
    musicToggle: MusicButton;
    onVolume: GameObjects.Image;
    offVolume: GameObjects.Image;
  
    constructor() {
      super({ key: 'MusicToggle', active: true });
    }
  
    create() {
      this.musicToggle = new MusicButton(this, 980, 40, () => {


            /*this.musicToggle.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.musicToggle.setTint(0xdedede);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.musicToggle.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.musicToggle.setTint(0x8afbff);
                this.musicToggle.onVolume.visible = false;
                this.musicToggle.offVolume.visible = true;
                console.log('Music Off');
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.musicToggle.setTint(0xffffff);
            }); */
        });
    }
  }