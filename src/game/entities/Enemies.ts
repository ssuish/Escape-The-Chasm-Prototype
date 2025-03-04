import { Scene, Physics } from "phaser";
import { gameConfig } from "../config/gameConfig";
import StateMachine from "../logic/StateMachine";

export class Enemy {
    private jumpForce: number;
    private speed: number;
    private sprite: Physics.Matter.Sprite;
    private stateMachine: StateMachine;
    private isTouchingGround: boolean = false;

    constructor(sprite: Physics.Matter.Sprite) {
        this.sprite = sprite;
        this.speed = gameConfig.playerSpeed;
        this.jumpForce = gameConfig.jumpForce * 1;

        this.stateMachine = new StateMachine(this, "enemy-footman");
        this.stateMachine
            .addState("idle", {})
            .addState("patrol", {})
            .addState("attack", {})
            .setState("idle");
    }

    private idleOnEnter() {}
    private patrolOnEnter() {}
    private attackOnEnter() {}
}



