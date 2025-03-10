import { Physics, Scene } from "phaser";
import { gameConfig } from "../config/gameConfig";
import StateMachine from "../logic/StateMachine";
import CollisionIdentifier from "../logic/CollisionIdentifier";
import { EventBus } from "../EventBus";

export abstract class BaseEnemy {
    protected speed: number;
    protected jumpForce: number;
    protected sprite: Physics.Matter.Sprite;
    protected stateMachine: StateMachine;
    protected isTouchingGround: boolean = false;
    protected player: Phaser.GameObjects.Sprite;
    protected obstacles: CollisionIdentifier;
    protected scene: Scene;
    protected lastPlayerX: number;
    protected lastPlayerY: number;

    constructor(
        id: string,
        sprite: Physics.Matter.Sprite,
        obstacles: CollisionIdentifier,
        player: Phaser.Physics.Matter.Sprite,
        scene: Scene
    ) {
        this.sprite = sprite;
        // TODO: Replace the gameConfig values with the enemies' own values
        this.speed = gameConfig.playerSpeed;
        this.jumpForce = gameConfig.jumpForce;
        this.obstacles = obstacles;
        this.player = player;
        this.scene = scene;

        this.stateMachine = new StateMachine(this, id);
        this.stateMachine
            .addState("patrol", {
                onEnter: this.patrolOnEnter,
            })
            .addState("attack", {
                onEnter: this.attackOnEnter,
            })
            .addState("enemyHurt", {
                onEnter: this.enemyHitOnEnter,
            })
            .addState("defeated", {
                onEnter: this.defeatedOnEnter,
            })
            .setState("patrol");

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const { bodyA, bodyB } = data;

            const enemyBody = this.sprite.body as MatterJS.BodyType;
            const otherBody =
                bodyA === enemyBody
                    ? (bodyB as MatterJS.BodyType)
                    : (bodyA as MatterJS.BodyType);
            const gameObject = otherBody.gameObject;

            // console.log(
            //     `Object ${enemyBody.label} Collided with: ${otherBody.label}`
            // );

            if (this.obstacles.is("deadEnd", otherBody)) {
                this.stateMachine.setState("defeated");
                // TODO: Add event emitter for defeated enemies on deadend.
                // TODO: check enemy id and emit event accordingly
                EventBus.emit("enemy-defeated-onDeadEnd");
                return;
            }

            if (!gameObject) {
                console.error(
                    "Failed to get game object from body: " + otherBody.label
                );
                return;
            }

            this.handleCollisionWith(gameObject);
        });

        this.sprite.setFixedRotation();
        this.createAnimation();
    }

    protected abstract createAnimation(): void;
    protected abstract handleCollisionWith(
        gameObject: Phaser.GameObjects.GameObject | undefined
    ): void;
    protected abstract patrolOnEnter(): void;
    protected abstract attackOnEnter(): void;
    protected abstract enemyHitOnEnter(): void;
    protected defeatedOnEnter(): void {}
}

