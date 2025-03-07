import { Player } from "../entities/Player";
import { Component } from "react";

export default class PlayerHealthBar extends Component{
    player: Player
    healthBar: Phaser.GameObjects.Rectangle;
    playerHealth: number
    playerMaxHealth: number

    constructor( player: Player ){
        super({ key: 'PlayerHealthBar' }); 
        this.player = player
    }

    create(){
        //this.healthBar = this.add.rectangle(400, 300, 50, 50, 0xffffff)
        
        this.playerMaxHealth = this.player.GetMaxHealth();
        
        console.log(this.playerMaxHealth);
    }
    enemyHitPlayer(){
        //enemy-hit(damage)  key(parameter)
        this.playerHealth = this.player.GetHealth();
        console.log(this.playerHealth);
    }
}