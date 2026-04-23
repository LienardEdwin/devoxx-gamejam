import * as Phaser from 'phaser';
import { Player } from '../objects/Player';
import { Monster } from '../objects/Monster';
import { HUD } from '../objects/HUD';
import { MapBuilder } from '../utils/MapBuilder';
import { EventBus } from '../EventBus';
import { playFootstep, FootstepType } from '../utils/SoundUtils';

export abstract class BaseFloorScene extends Phaser.Scene {
    protected player!: Player;
    protected hud!: HUD;
    protected walls!: Phaser.Physics.Arcade.StaticGroup;
    protected monsters: Monster[] = [];
    protected wallGfx!: Phaser.GameObjects.Graphics;
    protected footstepType: FootstepType = 'wood';

    private footstepCooldown: number = 0;

    private transitionZones: {
        x: number; y: number; w: number; h: number;
        targetScene: string;
        condition?: () => boolean;
        triggered: boolean;
    }[] = [];

    private keyItems: {
        x: number; y: number; radius: number;
        registryKey: string; keyIndex: number;
        sprite: Phaser.GameObjects.Image;
        collected: boolean;
    }[] = [];

    private slowZones: {
        x: number; y: number; w: number; h: number;
        multiplier: number;
    }[] = [];

    protected readonly WORLD_WIDTH = 1024;
    protected readonly WORLD_HEIGHT = 768;

    create(): void {
        this.monsters = [];
        this.transitionZones = [];
        this.keyItems = [];
        this.slowZones = [];
        this.initRegistry();

        MapBuilder.drawFloor(this, this.WORLD_WIDTH, this.WORLD_HEIGHT, this.getFloorColor());

        this.wallGfx = this.add.graphics();
        this.wallGfx.setDepth(1);

        this.walls = this.physics.add.staticGroup();
        MapBuilder.addBoundaryWalls(this.wallGfx, this.walls, this.WORLD_WIDTH, this.WORLD_HEIGHT);

        const spawn = this.getSpawnPosition();
        this.player = new Player(this, spawn.x, spawn.y);

        this.hud = new HUD(this);

        // Clean up HUD listeners when scene shuts down
        this.events.once('shutdown', () => {
            this.hud.destroy();
        });

        this.buildLevel();
        this.setupCollisions();

        EventBus.emit('current-scene-ready', this);
    }

    update(): void {
        this.player.update();
        for (const monster of this.monsters) {
            monster.update(this.player);
        }
        this.checkTransitions();
        this.checkKeyPickups();
        this.checkSlowZones();
        this.updateFootsteps();
    }

    private updateFootsteps(): void {
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        const moving = Math.abs(body.velocity.x) > 8 || Math.abs(body.velocity.y) > 8;
        this.footstepCooldown -= this.game.loop.delta;
        if (moving && this.footstepCooldown <= 0) {
            this.footstepCooldown = 380;
            playFootstep(this, this.footstepType);
        }
    }

    private checkSlowZones(): void {
        const px = this.player.x;
        const py = this.player.y;
        let mult = 1.0;
        for (const z of this.slowZones) {
            if (px > z.x && px < z.x + z.w && py > z.y && py < z.y + z.h) {
                mult = z.multiplier;
                break;
            }
        }
        this.player.setSpeedMultiplier(mult);
        // Visual tint feedback
        this.player.setTint(mult < 1.0 ? 0xaaddff : 0xffffff);
    }

    private checkKeyPickups(): void {
        const pc = this.player; // player center = player.x, player.y
        for (const k of this.keyItems) {
            if (k.collected) continue;
            const dx = pc.x - k.x;
            const dy = pc.y - k.y;
            if (Math.abs(dx) < k.radius && Math.abs(dy) < k.radius) {
                k.collected = true;
                this.game.registry.set(k.registryKey, true);
                EventBus.emit('key-collected', k.keyIndex);
                k.sprite.destroy();

                const flash = this.add.graphics();
                flash.fillStyle(0xffff00, 0.6);
                flash.fillCircle(k.x, k.y, 50);
                flash.setDepth(5);
                this.time.delayedCall(300, () => flash.destroy());

                const msg = this.add.text(k.x, k.y - 30, 'Clef obtenue !', {
                    fontSize: '16px', color: '#ffcc00',
                    stroke: '#000', strokeThickness: 3,
                }).setOrigin(0.5).setDepth(25);
                this.tweens.add({
                    targets: msg,
                    y: k.y - 80,
                    alpha: 0,
                    duration: 1500,
                    onComplete: () => msg.destroy(),
                });
            }
        }
    }

    private checkTransitions(): void {
        const px = this.player.x;
        const py = this.player.y;

        for (const t of this.transitionZones) {
            if (t.triggered) continue;
            if (t.condition && !t.condition()) continue;

            if (px > t.x && px < t.x + t.w && py > t.y && py < t.y + t.h) {
                t.triggered = true;
                this.game.registry.set('fromScene', this.scene.key);
                this.hud.destroy();
                this.scene.start(t.targetScene);
                return;
            }
        }
    }

    protected initRegistry(): void {
        if (this.game.registry.get('hearts') === undefined || this.game.registry.get('hearts') === null) {
            this.game.registry.set('hearts', 3);
        }
        if (this.game.registry.get('key_attic') === undefined) {
            this.game.registry.set('key_attic', false);
            this.game.registry.set('key_basement', false);
            this.game.registry.set('key_garden', false);
        }
    }

    protected setupCollisions(): void {
        this.physics.add.collider(this.player, this.walls);
        // Monsters don't collide with walls — they pass through obstacles
        for (const monster of this.monsters) {
            this.physics.add.overlap(this.player, monster, () => {
                this.player.takeDamage();
            });
        }
    }

    protected addMonster(waypoints: { x: number; y: number }[], speed: number = 40, chaseSpeed: number = 75, textureKey: string = 'monster', faceMovement: boolean = false): Monster {
        const start = waypoints[0];
        const monster = new Monster(this, start.x, start.y, waypoints, speed, chaseSpeed, 200, textureKey, faceMovement);
        this.monsters.push(monster);
        return monster;
    }

    protected addKey(x: number, y: number, registryKey: string, keyIndex: number): void {
        if (this.game.registry.get(registryKey)) return;

        const keySprite = this.add.image(x, y, 'key');
        keySprite.setDisplaySize(24, 24);
        keySprite.setDepth(2);

        this.tweens.add({
            targets: keySprite,
            angle: 360,
            duration: 3000,
            repeat: -1,
        });
        this.tweens.add({
            targets: keySprite,
            scaleX: { from: 0.9, to: 1.1 },
            scaleY: { from: 0.9, to: 1.1 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        this.keyItems.push({ x, y, radius: 30, registryKey, keyIndex, sprite: keySprite, collected: false });
    }

    protected addTransitionZone(
        x: number, y: number, w: number, h: number,
        label: string, labelColor: number,
        targetScene: string,
        condition?: () => boolean
    ): void {
        MapBuilder.createTransitionZone(this, x, y, w, h, label, labelColor);
        this.transitionZones.push({ x, y, w, h, targetScene, condition, triggered: false });
    }

    protected addSlowZone(x: number, y: number, w: number, h: number, multiplier: number): void {
        this.slowZones.push({ x, y, w, h, multiplier });
        const img = this.add.image(x + w / 2, y + h / 2, 'spider-web');
        img.setDisplaySize(w, h);
        img.setDepth(1).setAlpha(0.75);
    }

    protected abstract buildLevel(): void;
    protected abstract getSpawnPosition(): { x: number; y: number };
    protected abstract getFloorColor(): number;
}
