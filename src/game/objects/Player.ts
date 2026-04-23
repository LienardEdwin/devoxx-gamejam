import * as Phaser from 'phaser';
import { EventBus } from '../EventBus';

export class Player extends Phaser.Physics.Arcade.Sprite {
    private invincible: boolean = false;
    private invincibilityTimer: Phaser.Time.TimerEvent | null = null;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: {
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
    };
    private speed: number = 160;
    private speedMultiplier: number = 1.0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(3);
        this.setDisplaySize(32, 48);
        this.setCollideWorldBounds(true);
        (this.body as Phaser.Physics.Arcade.Body).setSize(24, 38);

        this.cursors = scene.input.keyboard!.createCursorKeys();
        this.wasd = {
            up: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };
    }

    update(): void {
        const body = this.body as Phaser.Physics.Arcade.Body;
        let vx = 0;
        let vy = 0;

        if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -this.speed;
        else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = this.speed;

        if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -this.speed;
        else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = this.speed;

        // Normalize diagonal movement
        if (vx !== 0 && vy !== 0) {
            vx *= 0.707;
            vy *= 0.707;
        }

        body.setVelocity(vx * this.speedMultiplier, vy * this.speedMultiplier);
    }

    setSpeedMultiplier(mult: number): void {
        this.speedMultiplier = mult;
    }

    takeDamage(): void {
        if (this.invincible) return;

        const currentHearts = this.scene.game.registry.get('hearts') as number;
        const newHearts = currentHearts - 1;
        this.scene.game.registry.set('hearts', newHearts);
        EventBus.emit('hearts-changed', newHearts);

        if (newHearts <= 0) {
            this.scene.time.delayedCall(300, () => {
                this.scene.scene.start('GameOver');
            });
            return;
        }

        this.invincible = true;

        // Blink animation
        let blinkCount = 0;
        const blinkTimer = this.scene.time.addEvent({
            delay: 150,
            repeat: 9,
            callback: () => {
                this.setAlpha(blinkCount % 2 === 0 ? 0.3 : 1);
                blinkCount++;
            },
        });

        if (this.invincibilityTimer) this.invincibilityTimer.remove();
        this.invincibilityTimer = this.scene.time.delayedCall(1500, () => {
            this.invincible = false;
            this.setAlpha(1);
            blinkTimer.remove();
        });
    }

    isInvincible(): boolean {
        return this.invincible;
    }
}
