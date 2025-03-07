import { Physics, Scene } from "phaser";
import { gameConfig } from "../config/gameConfig";
import StateMachine from "../logic/StateMachine";
import CollisionIdentifier from "../logic/CollisionIdentifier";

export abstract class BaseEnemy {
    protected speed: number;
    protected jumpForce: number;
    protected sprite: Physics.Matter.Sprite;
    protected stateMachine: StateMachine;
    protected isTouchingGround: boolean = false;
    protected player: Phaser.GameObjects.Sprite;
    protected obstacles: CollisionIdentifier;
    protected scene: Scene;

    constructor(
        sprite: Physics.Matter.Sprite,
        obstacles: CollisionIdentifier,
        player: Phaser.GameObjects.Sprite,
        scene: Scene
    ) {
        this.sprite = sprite;
        this.speed = gameConfig.playerSpeed; // replace to enemy
        this.jumpForce = gameConfig.jumpForce; // replace to enemy
        this.obstacles = obstacles;
        this.player = player;
        this.scene = scene;

        this.stateMachine = new StateMachine(this, "enemy");
        this.stateMachine
            .addState("idle", {
                onEnter: this.idleOnEnter,
            })
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
            .setState("idle");

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const { bodyA, bodyB } = data;

            const enemyBody = this.sprite.body as MatterJS.BodyType;
            const otherBody =
                bodyA === enemyBody
                    ? (bodyB as MatterJS.BodyType)
                    : (bodyA as MatterJS.BodyType);
            const gameObject = otherBody.gameObject;

            console.log(
                `Object ${enemyBody.label} Collided with: ${otherBody.label}`
            );

            if (this.obstacles.is("deadEnd", otherBody)) {
                this.stateMachine.setState("defeated");
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
    protected abstract idleOnEnter(): void;
    protected abstract patrolOnEnter(): void;
    protected abstract attackOnEnter(): void;
    protected abstract enemyHitOnEnter(): void;
    protected abstract defeatedOnEnter(): void;
}

