import * as Phaser from 'phaser';
import { Player } from './Player';

export class Monster extends Phaser.Physics.Arcade.Sprite {
    private waypoints: { x: number; y: number }[];
    private currentWaypoint: number = 0;
    private patrolSpeed: number;
    private chaseSpeed: number;
    private detectionRadius: number;
    private chasing: boolean = false;
    private faceMovement: boolean;
    private defaultFlipX: boolean = false;
    private defaultFlipY: boolean = false;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        waypoints: { x: number; y: number }[],
        patrolSpeed: number = 60,
        chaseSpeed: number = 110,
        detectionRadius: number = 200,
        textureKey: string = 'monster',
        faceMovement: boolean = false
    ) {
        super(scene, x, y, textureKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(3);
        this.setDisplaySize(32, 48);
        (this.body as Phaser.Physics.Arcade.Body).setSize(24, 36);

        this.waypoints = waypoints.length > 0 ? waypoints : [{ x, y }];
        this.patrolSpeed = patrolSpeed;
        this.chaseSpeed = chaseSpeed;
        this.detectionRadius = detectionRadius;
        this.faceMovement = faceMovement;
        this.currentWaypoint = 0;
    }

    update(player: Player): void {
        const body = this.body as Phaser.Physics.Arcade.Body;
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (dist < this.detectionRadius) {
            this.chasing = true;
            const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
            body.setVelocity(
                Math.cos(angle) * this.chaseSpeed,
                Math.sin(angle) * this.chaseSpeed
            );
            this.applyOrientation(angle);
        } else {
            this.chasing = false;
            this.patrol(body);
        }
    }

    private applyOrientation(angle: number): void {
        if (this.faceMovement) {
            this.setRotation(angle - Math.PI);
            this.setFlipX(false);
        } else {
            const movingLeft = Math.cos(angle) < 0;
            this.setFlipX(this.defaultFlipX ? !movingLeft : movingLeft);
        }
    }

    setDefaultFlip(flipX: boolean, flipY: boolean): this {
        this.defaultFlipX = flipX;
        this.defaultFlipY = flipY;
        this.setFlipY(flipY);
        return this;
    }

    private patrol(body: Phaser.Physics.Arcade.Body): void {
        if (this.waypoints.length < 2) {
            body.setVelocity(0, 0);
            return;
        }

        const target = this.waypoints[this.currentWaypoint];
        const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

        if (dist < 10) {
            this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;
        }

        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        body.setVelocity(
            Math.cos(angle) * this.patrolSpeed,
            Math.sin(angle) * this.patrolSpeed
        );
        this.applyOrientation(angle);
    }

    isChasing(): boolean {
        return this.chasing;
    }
}
