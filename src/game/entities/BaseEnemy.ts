import { Physics, Scene } from "phaser";
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

            if (this.obstacles.is("deadEnd", otherBody)) {
                this.stateMachine.setState("defeated");
                // TODO: If we add new enemy type - check enemy id and emit event accordingly.
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

