import { BaseFloorScene } from './BaseFloorScene';

export class AtticScene extends BaseFloorScene {
    constructor() {
        super('AtticScene');
    }

    protected getFloorColor(): number {
        return 0x0d0d15;
    }

    protected getSpawnPosition(): { x: number; y: number } {
        return { x: 512, y: 680 };
    }

    protected buildLevel(): void {
        // No obstacles — open attic, only webs slow the player

        // Wooden beams (decorative only, no physics)
        const beamGfx = this.add.graphics();
        beamGfx.setDepth(0);
        beamGfx.lineStyle(4, 0x1a0d05, 0.5);
        beamGfx.lineBetween(32, 180, this.WORLD_WIDTH - 32, 180);
        beamGfx.lineBetween(32, 420, this.WORLD_WIDTH - 32, 420);
        beamGfx.lineBetween(32, 580, this.WORLD_WIDTH - 32, 580);
        beamGfx.lineStyle(2, 0x1a0d05, 0.3);
        beamGfx.lineBetween(200, 32, 200, this.WORLD_HEIGHT - 32);
        beamGfx.lineBetween(820, 32, 820, this.WORLD_HEIGHT - 32);

        this.add.text(512, 50, 'GRENIER', {
            fontSize: '14px', color: '#332244', fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(2);

        // Key #0 (attic key) — placed centrally
        this.addKey(512, 300, 'key_attic', 0);

        // Spider webs — 9 webs spread across the attic, slowing to 35%
        const webs = [
            { x: 80,  y: 80  }, { x: 350, y: 60  }, { x: 650, y: 80  }, { x: 880, y: 100 },
            { x: 140, y: 300  }, { x: 450, y: 250 }, { x: 750, y: 280 },
            { x: 260, y: 500  }, { x: 560, y: 490 }, { x: 820, y: 520 },
            { x: 100, y: 620  }, { x: 680, y: 640 },
        ];
        for (const w of webs) {
            this.addSlowZone(w.x, w.y, 90, 90, 0.35);
        }

        // Return to house (bottom center)
        this.addTransitionZone(462, 696, 100, 40, 'RDC ↓', 0x4466aa, 'HouseScene');

        // Spiders — rotate to always face movement direction
        this.addMonster([
            { x: 150, y: 250 }, { x: 870, y: 250 }
        ], 30, 60, 'spider', true).setScale(1.6);
        this.addMonster([
            { x: 300, y: 500 }, { x: 700, y: 500 }, { x: 700, y: 650 }, { x: 300, y: 650 }
        ], 28, 55, 'spider', true).setScale(1.8);
    }
}
