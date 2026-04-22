import * as Phaser from 'phaser';
import { BaseFloorScene } from './BaseFloorScene';
import { MapBuilder } from '../utils/MapBuilder';

export class GardenScene extends BaseFloorScene {
    constructor() {
        super('GardenScene');
    }

    protected getFloorColor(): number {
        return 0x0a100a;
    }

    protected getSpawnPosition(): { x: number; y: number } {
        return { x: 80, y: 384 };
    }

    protected buildLevel(): void {
        // Grass texture lines
        const grassGfx = this.add.graphics();
        grassGfx.setDepth(0);
        for (let i = 0; i < 60; i++) {
            const gx = 40 + (i % 12) * 80 + (Math.floor(i / 12) % 2) * 40;
            const gy = 50 + Math.floor(i / 12) * 130;
            const h = 8 + (i % 3) * 4;
            grassGfx.lineStyle(1, 0x0d1a0d, 0.6);
            grassGfx.lineBetween(gx,     gy, gx - 2, gy - h);
            grassGfx.lineBetween(gx + 5, gy, gx + 5, gy - h - 2);
            grassGfx.lineBetween(gx + 10,gy, gx + 12, gy - h);
        }

        // ── Trees ──────────────────────────────────────────────────────
        const trees = [
            { x: 140, y: 80  },
            { x: 310, y: 65  },
            { x: 530, y: 55  },
            { x: 760, y: 72  },
            { x: 900, y: 100 },
            { x: 190, y: 560 },
            { x: 440, y: 575 },
            { x: 640, y: 555 },
            { x: 850, y: 565 },
        ];

        for (const t of trees) {
            // Visual sprite (origin bottom-center)
            this.add.image(t.x, t.y + 48, 'tree')
                .setOrigin(0.5, 1)
                .setDepth(1);
            // Physics body (trunk only)
            MapBuilder.addPhysicsWall(this.walls, t.x - 8, t.y + 18, 16, 30);
        }

        // ── Tombs ──────────────────────────────────────────────────────
        const tombs = [
            { x: 280, y: 300 },
            { x: 420, y: 260 },
            { x: 560, y: 310 },
            { x: 700, y: 280 },
            { x: 340, y: 460 },
            { x: 620, y: 450 },
        ];

        for (const tb of tombs) {
            this.add.image(tb.x, tb.y, 'tomb')
                .setOrigin(0.5, 1)
                .setDepth(1);
            // Physics body (stone body)
            MapBuilder.addPhysicsWall(this.walls, tb.x - 16, tb.y - 54, 32, 48);
        }

        this.add.text(512, 50, 'JARDIN', {
            fontSize: '14px', color: '#112211', fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(2);

        // Key #2 — entre les tombes
        this.addKey(512, 390, 'key_garden', 2);

        // Return to house (left wall)
        this.addTransitionZone(32, 344, 40, 80, '← Maison', 0x4466aa, 'HouseScene');

        // Monsters (skeletons)
        this.addMonster([
            { x: 400, y: 200 }, { x: 800, y: 200 }, { x: 800, y: 600 }, { x: 400, y: 600 }
        ], 48, 85, 'skeleton');
        this.addMonster([
            { x: 200, y: 400 }, { x: 900, y: 400 }
        ], 52, 90, 'skeleton');
    }
}
