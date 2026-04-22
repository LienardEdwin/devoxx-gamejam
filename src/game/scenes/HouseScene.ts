import * as Phaser from 'phaser';
import { BaseFloorScene } from './BaseFloorScene';
import { MapBuilder } from '../utils/MapBuilder';

export class HouseScene extends BaseFloorScene {
    private exitDoorGfx!: Phaser.GameObjects.Graphics;
    private exitDoorLabel!: Phaser.GameObjects.Text;
    private lockedMsg: Phaser.GameObjects.Text | null = null;
    private lockedCooldown: boolean = false;
    private allKeysCollected: boolean = false;

    constructor() {
        super('HouseScene');
    }

    protected getFloorColor(): number {
        return 0x161620;
    }

    protected getSpawnPosition(): { x: number; y: number } {
        const from = this.game.registry.get('fromScene') as string | undefined;
        switch (from) {
            case 'AtticScene':    return { x: 512, y: 100 };   // near top (attic door)
            case 'BasementScene': return { x: 512, y: 690 };   // near bottom (basement door)
            case 'GardenScene':   return { x: 900, y: 384 };   // near right (garden door)
            default:              return { x: 512, y: 420 };   // menu / game over
        }
    }

    protected buildLevel(): void {
        // Interior obstacles (furniture, crates)
        const obstacles = [
            { x: 80, y: 100, w: 80, h: 48 },
            { x: 250, y: 150, w: 96, h: 56 },
            { x: 620, y: 90, w: 70, h: 70 },
            { x: 820, y: 130, w: 80, h: 48 },
            { x: 150, y: 420, w: 60, h: 100 },
            { x: 360, y: 500, w: 100, h: 50 },
            { x: 680, y: 480, w: 60, h: 80 },
            { x: 860, y: 450, w: 80, h: 50 },
            { x: 450, y: 280, w: 90, h: 40 },
        ];

        for (const obs of obstacles) {
            MapBuilder.addObstacle(this.wallGfx, this.walls, obs.x, obs.y, obs.w, obs.h);
        }

        // Decorative floor lines
        const detail = this.add.graphics();
        detail.setDepth(0);
        detail.lineStyle(1, 0x221510, 0.3);
        for (let y = 64; y < this.WORLD_HEIGHT - 32; y += 48) {
            detail.lineBetween(32, y, this.WORLD_WIDTH - 32, y);
        }

        this.add.text(512, 740, 'RDC – TROUVEZ LES 3 CLEFS', {
            fontSize: '11px', color: '#444455',
        }).setOrigin(0.5).setDepth(2);

        // Exit door (left wall)
        this.exitDoorGfx = this.add.graphics();
        this.exitDoorGfx.setDepth(2);

        this.exitDoorLabel = this.add.text(24, 450, '', {
            fontSize: '10px', color: '#00ff88', align: 'center',
            stroke: '#000000', strokeThickness: 3,
        }).setOrigin(0.5).setDepth(3);

        this.updateExitDoor();

        // Transitions
        this.addTransitionZone(462, 32, 100, 40, 'GRENIER ↑', 0x8844ff, 'AtticScene');
        this.addTransitionZone(462, 696, 100, 40, 'SOUS-SOL ↓', 0x664422, 'BasementScene');
        this.addTransitionZone(952, 344, 40, 80, '→ JARDIN', 0x226622, 'GardenScene');

        // Monsters
        this.addMonster([
            { x: 200, y: 200 }, { x: 700, y: 200 }, { x: 700, y: 550 }, { x: 200, y: 550 }
        ], 35, 65);
        this.addMonster([
            { x: 400, y: 350 }, { x: 750, y: 350 }
        ], 45, 70);
    }

    private updateExitDoor(): void {
        this.allKeysCollected = (
            this.game.registry.get('key_attic') === true &&
            this.game.registry.get('key_basement') === true &&
            this.game.registry.get('key_garden') === true
        );

        this.exitDoorGfx.clear();

        // Door dimensions — larger and more visible
        const dx = 0;
        const dy = 320;
        const dw = 48;
        const dh = 112;
        const cx = dx + dw / 2;

        const locked = !this.allKeysCollected;

        // ── Door frame (stone surround) ────────────────────────────────
        const frameColor = locked ? 0x2a1a1a : 0x1a2a1a;
        this.exitDoorGfx.fillStyle(frameColor);
        this.exitDoorGfx.fillRect(dx - 2, dy - 4, dw + 4, dh + 8);
        this.exitDoorGfx.lineStyle(3, locked ? 0x441111 : 0x115511);
        this.exitDoorGfx.strokeRect(dx - 2, dy - 4, dw + 4, dh + 8);

        // ── Door slab ──────────────────────────────────────────────────
        const doorColor = locked ? 0x3a1c0c : 0x2a3c1a;
        this.exitDoorGfx.fillStyle(doorColor);
        this.exitDoorGfx.fillRect(dx, dy, dw, dh);

        // ── Wood planks (horizontal lines) ────────────────────────────
        const plankColor = locked ? 0x2e1508 : 0x1e2e10;
        this.exitDoorGfx.lineStyle(1, plankColor, 0.9);
        for (let py = dy + 14; py < dy + dh - 4; py += 14) {
            this.exitDoorGfx.lineBetween(dx + 2, py, dx + dw - 2, py);
        }
        // Vertical center split
        this.exitDoorGfx.lineBetween(cx, dy + 2, cx, dy + dh - 2);

        // ── Door outline ───────────────────────────────────────────────
        this.exitDoorGfx.lineStyle(2, locked ? 0x5a2211 : 0x226622);
        this.exitDoorGfx.strokeRect(dx, dy, dw, dh);

        if (locked) {
            // ── PADLOCK — drawn large and clear on the door ────────────
            const lx = cx;        // center x
            const ly = dy + 58;   // center y (vertically centered on door)
            const bw = 22;        // body width
            const bh = 16;        // body height
            const br = 4;         // body corner radius

            // Padlock body — orange/red
            this.exitDoorGfx.fillStyle(0xcc4400);
            this.exitDoorGfx.fillRoundedRect(lx - bw / 2, ly, bw, bh, br);
            // Body highlight
            this.exitDoorGfx.fillStyle(0xff6622, 0.4);
            this.exitDoorGfx.fillRoundedRect(lx - bw / 2 + 2, ly + 2, bw - 4, 5, 2);
            // Body border
            this.exitDoorGfx.lineStyle(2, 0xff7733);
            this.exitDoorGfx.strokeRoundedRect(lx - bw / 2, ly, bw, bh, br);

            // Shackle (U-shape arc) — thick
            this.exitDoorGfx.lineStyle(4, 0xff7733);
            this.exitDoorGfx.beginPath();
            this.exitDoorGfx.arc(lx, ly, 10, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(0), false);
            this.exitDoorGfx.strokePath();
            // Shackle legs connecting to body
            this.exitDoorGfx.lineStyle(4, 0xff6622);
            this.exitDoorGfx.lineBetween(lx - 10, ly, lx - 10, ly + 5);
            this.exitDoorGfx.lineBetween(lx + 10, ly, lx + 10, ly + 5);

            // Keyhole — circle + slot
            this.exitDoorGfx.fillStyle(0x000000);
            this.exitDoorGfx.fillCircle(lx, ly + 7, 3.5);
            this.exitDoorGfx.fillRect(lx - 1.5, ly + 9, 3, 5);
            // Keyhole highlight
            this.exitDoorGfx.fillStyle(0x331100, 0.6);
            this.exitDoorGfx.fillCircle(lx - 1, ly + 6, 1.5);

            // Label below door
            this.exitDoorLabel.setText('VERROUILLÉE').setColor('#ff4422').setFontSize('9px');
            this.exitDoorLabel.setPosition(cx, dy + dh + 10).setOrigin(0.5);
        } else {
            // ── OPEN PADLOCK (unlocked state) ──────────────────────────
            const lx = cx;
            const ly = dy + 58;
            const bw = 22;
            const bh = 16;
            const br = 4;

            // Glow aura
            for (let r = 30; r >= 8; r -= 6) {
                this.exitDoorGfx.fillStyle(0x00ff66, 0.03 + (30 - r) * 0.01);
                this.exitDoorGfx.fillCircle(cx, dy + dh / 2, r + 20);
            }

            // Padlock body — green
            this.exitDoorGfx.fillStyle(0x117733);
            this.exitDoorGfx.fillRoundedRect(lx - bw / 2, ly, bw, bh, br);
            this.exitDoorGfx.fillStyle(0x33ff88, 0.3);
            this.exitDoorGfx.fillRoundedRect(lx - bw / 2 + 2, ly + 2, bw - 4, 5, 2);
            this.exitDoorGfx.lineStyle(2, 0x44ff88);
            this.exitDoorGfx.strokeRoundedRect(lx - bw / 2, ly, bw, bh, br);

            // Shackle — open (swung to the right)
            this.exitDoorGfx.lineStyle(4, 0x44ff88);
            this.exitDoorGfx.beginPath();
            this.exitDoorGfx.arc(lx + 6, ly - 8, 8, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(90), false);
            this.exitDoorGfx.strokePath();
            // Only right leg connects to body
            this.exitDoorGfx.lineBetween(lx + 10, ly, lx + 10, ly + 4);

            // Check mark inside body
            this.exitDoorGfx.lineStyle(2, 0x88ffbb);
            this.exitDoorGfx.lineBetween(lx - 5, ly + 8, lx - 1, ly + 12);
            this.exitDoorGfx.lineBetween(lx - 1, ly + 12, lx + 6, ly + 5);

            this.exitDoorLabel.setText('← SORTIE').setColor('#00ff88').setFontSize('10px');
            this.exitDoorLabel.setPosition(cx, dy + dh + 10).setOrigin(0.5);
        }
    }

    private showLockedMessage(): void {
        if (this.lockedCooldown) return;
        this.lockedCooldown = true;
        this.cameras.main.shake(300, 0.005);

        if (this.lockedMsg) this.lockedMsg.destroy();
        this.lockedMsg = this.add.text(200, 384, 'Il vous faut les 3 clefs !', {
            fontSize: '16px', color: '#ff4444',
            stroke: '#000', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(25).setScrollFactor(0);

        this.time.delayedCall(2000, () => {
            this.lockedMsg?.destroy();
            this.lockedCooldown = false;
        });
    }

    update(): void {
        super.update();
        this.updateExitDoor();
        this.checkExitDoor();
    }

    private checkExitDoor(): void {
        const px = this.player.x;
        const py = this.player.y;
        // Exit door zone (left wall): x=0..48, y=344..424
        if (px < 48 && py > 320 && py < 432) {
            if (!this.allKeysCollected) {
                this.showLockedMessage();
            } else {
                this.game.registry.set('fromScene', 'HouseScene');
                this.hud.destroy();
                this.scene.start('Victory');
            }
        }
    }
}
