import * as Phaser from 'phaser';
import { BaseFloorScene } from './BaseFloorScene';
import { MapBuilder } from '../utils/MapBuilder';
import { Monster } from '../objects/Monster';

export class BasementScene extends BaseFloorScene {
    // Separate group so we can add monster colliders only against trench walls
    private trenchWalls!: Phaser.Physics.Arcade.StaticGroup;

    constructor() {
        super('BasementScene');
    }

    protected getFloorColor(): number {
        return 0x0a0a08;
    }

    protected getSpawnPosition(): { x: number; y: number } {
        return { x: 512, y: 80 };
    }

    protected buildLevel(): void {
        this.trenchWalls = this.physics.add.staticGroup();

        this.drawAtmosphere();

        // Trench 1 — y=230, bridges at x=170→260 and x=590→680
        this.addTrench(32, 230, 992, 38, [
            { start: 170, end: 260 },
            { start: 590, end: 680 },
        ]);

        // Trench 2 — y=430, bridges at x=310→400 and x=730→820
        this.addTrench(32, 430, 992, 38, [
            { start: 310, end: 400 },
            { start: 730, end: 820 },
        ]);

        this.add.text(512, 50, 'SOUS-SOL', {
            fontSize: '14px', color: '#223322', fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(2);

        this.addKey(512, 600, 'key_basement', 1);
        this.addTransitionZone(462, 32, 100, 40, 'RDC ↑', 0x4466aa, 'HouseScene');

        // Zone 1 (above trench 1: y≈50–220)
        this.addMonster([{ x: 100, y: 150 }, { x: 900, y: 150 }, { x: 900, y: 200 }, { x: 100, y: 200 }], 38, 72, 'rat', true);

        // Zone 2 (between trenches: y≈275–420)
        this.addMonster([{ x: 150, y: 320 }, { x: 850, y: 320 }, { x: 850, y: 400 }, { x: 150, y: 400 }], 42, 78, 'rat2', true).setScale(0.9);

        // Zone 3 (below trench 2: y≈475–720)
        this.addMonster([{ x: 200, y: 530 }, { x: 800, y: 530 }, { x: 800, y: 660 }, { x: 200, y: 660 }], 36, 68, 'rat2', true);
    }

    protected setupCollisions(): void {
        super.setupCollisions();
        // Rats are also blocked by trench walls
        for (const monster of this.monsters as Monster[]) {
            this.physics.add.collider(monster, this.trenchWalls);
        }
        // Player is also blocked by trench walls
        this.physics.add.collider(this.player, this.trenchWalls);
    }

    private addTrench(
        x: number, y: number, width: number, height: number,
        bridges: { start: number; end: number }[]
    ): void {
        const gfx = this.add.graphics().setDepth(1);

        // Liquid fill
        const liquidGfx = this.add.graphics().setDepth(2);
        liquidGfx.fillStyle(0x00ff44, 0.22);
        liquidGfx.fillRect(x, y, width, height);
        liquidGfx.fillStyle(0x66ff88, 0.35);
        for (let bx = x + 30; bx < x + width - 20; bx += 90) {
            liquidGfx.fillCircle(bx, y + height / 2, 5);
            liquidGfx.fillCircle(bx + 40, y + height / 2 - 3, 3);
        }
        this.tweens.add({
            targets: liquidGfx,
            alpha: { from: 0.7, to: 1.0 },
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Concrete edges
        gfx.fillStyle(0x2a2a20);
        gfx.fillRect(x, y - 4, width, 6);
        gfx.fillRect(x, y + height - 2, width, 6);
        gfx.lineStyle(1, 0x3a3a28);
        gfx.strokeRect(x, y - 4, width, height + 10);

        // Drain grates
        gfx.lineStyle(1, 0x1a1a10, 0.8);
        for (let gx = x + 60; gx < x + width - 40; gx += 120) {
            gfx.strokeRect(gx, y + 8, 20, height - 16);
            gfx.lineBetween(gx + 10, y + 8, gx + 10, y + height - 8);
        }

        // Physics walls for impassable segments — added to BOTH groups
        const sortedBridges = [...bridges].sort((a, b) => a.start - b.start);
        const segments: { from: number; to: number }[] = [];
        let cursor = x;
        for (const b of sortedBridges) {
            if (b.start > cursor) segments.push({ from: cursor, to: b.start });
            cursor = b.end;
        }
        if (cursor < x + width) segments.push({ from: cursor, to: x + width });

        for (const seg of segments) {
            const sw = seg.to - seg.from;
            const sh = height + 10;
            const sx = seg.from;
            const sy = y - 4;
            // Add to this.walls (player blocked) AND this.trenchWalls (monster blocked)
            MapBuilder.addPhysicsWall(this.walls, sx, sy, sw, sh);
            MapBuilder.addPhysicsWall(this.trenchWalls, sx, sy, sw, sh);
        }

        // Bridges (wooden planks)
        for (const b of bridges) {
            const bw = b.end - b.start;
            const bx = b.start;
            gfx.fillStyle(0x5a3a18);
            gfx.fillRect(bx, y - 2, bw, height + 4);
            gfx.lineStyle(2, 0x3a2208);
            for (let px2 = bx + 10; px2 < bx + bw; px2 += 18) {
                gfx.lineBetween(px2, y - 2, px2, y + height + 4);
            }
            gfx.fillStyle(0x7a5228);
            gfx.fillRect(bx, y - 6, bw, 5);
            gfx.fillRect(bx, y + height + 1, bw, 5);
            gfx.fillStyle(0x2a1a08);
            for (let px2 = bx + 9; px2 < bx + bw; px2 += 18) {
                gfx.fillCircle(px2, y + 2, 2);
                gfx.fillCircle(px2, y + height - 2, 2);
            }
        }
    }

    private drawAtmosphere(): void {
        const detail = this.add.graphics().setDepth(0);
        detail.lineStyle(1, 0x1a1a14, 0.4);
        for (let i = 0; i < 8; i++) {
            const bx = 80 + i * 120;
            detail.lineBetween(bx, 32, bx + 15, 220);
            detail.lineBetween(bx + 15, 268, bx + 5, 430);
            detail.lineBetween(bx + 5, 468, bx + 20, 650);
        }
        detail.lineStyle(1, 0x223322, 0.2);
        for (let i = 0; i < 5; i++) {
            const sx = 150 + i * 170;
            detail.lineBetween(sx, 32, sx - 5, 220);
            detail.lineBetween(sx + 80, 268, sx + 75, 430);
        }
        detail.fillStyle(0x224422, 0.15);
        detail.fillEllipse(200, 225, 80, 12);
        detail.fillEllipse(600, 225, 60, 10);
        detail.fillEllipse(350, 425, 70, 12);
        detail.fillEllipse(750, 425, 90, 10);
    }
}
