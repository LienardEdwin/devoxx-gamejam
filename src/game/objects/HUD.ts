import * as Phaser from 'phaser';
import { EventBus } from '../EventBus';

export class HUD {
    private scene: Phaser.Scene;
    private heartTexts: Phaser.GameObjects.Text[] = [];
    private keyTexts: Phaser.GameObjects.Text[] = [];
    private keyLabels: Phaser.GameObjects.Text[] = [];

    private readonly KEY_NAMES = ['key_attic', 'key_basement', 'key_garden'];
    private readonly KEY_ZONE_LABELS = ['Grenier', 'Sous-sol', 'Jardin'];

    // Hearts panel — bottom-left
    private readonly HP_X = 10;
    private readonly HP_Y = 768 - 70;
    private readonly HP_W = 130;
    private readonly HP_H = 60;

    // Keys panel — bottom-right
    private readonly KEY_X = 1024 - 220;
    private readonly KEY_Y = 768 - 70;
    private readonly KEY_W = 210;
    private readonly KEY_H = 60;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        // ── Hearts panel (bottom-left) ────────────────────────────────
        const hpBg = scene.add.graphics();
        hpBg.fillStyle(0x000000, 0.72);
        hpBg.lineStyle(2, 0x6a2222, 1);
        hpBg.fillRoundedRect(this.HP_X, this.HP_Y, this.HP_W, this.HP_H, 10);
        hpBg.strokeRoundedRect(this.HP_X, this.HP_Y, this.HP_W, this.HP_H, 10);
        hpBg.setScrollFactor(0).setDepth(19);

        scene.add.text(this.HP_X + 10, this.HP_Y + 7, 'VIE', {
            fontSize: '12px', color: '#ff8888', fontStyle: 'bold',
        }).setScrollFactor(0).setDepth(20);

        for (let i = 0; i < 3; i++) {
            const t = scene.add.text(this.HP_X + 14 + i * 36, this.HP_Y + 26, '♥', {
                fontSize: '28px', color: '#ee1111',
                shadow: { offsetX: 1, offsetY: 1, color: '#440000', blur: 4, fill: true },
            }).setOrigin(0).setScrollFactor(0).setDepth(20);
            this.heartTexts.push(t);
        }

        // ── Keys panel (bottom-right) ─────────────────────────────────
        const keyBg = scene.add.graphics();
        keyBg.fillStyle(0x000000, 0.72);
        keyBg.lineStyle(2, 0x665511, 1);
        keyBg.fillRoundedRect(this.KEY_X, this.KEY_Y, this.KEY_W, this.KEY_H, 10);
        keyBg.strokeRoundedRect(this.KEY_X, this.KEY_Y, this.KEY_W, this.KEY_H, 10);
        keyBg.setScrollFactor(0).setDepth(19);

        scene.add.text(this.KEY_X + 10, this.KEY_Y + 7, 'CLEFS', {
            fontSize: '12px', color: '#ffcc44', fontStyle: 'bold',
        }).setScrollFactor(0).setDepth(20);

        for (let i = 0; i < 3; i++) {
            const kx = this.KEY_X + 14 + i * 68;

            const kt = scene.add.text(kx, this.KEY_Y + 26, '🔑', {
                fontSize: '22px',
            }).setOrigin(0).setScrollFactor(0).setDepth(20).setAlpha(0.18);
            this.keyTexts.push(kt);

            const kl = scene.add.text(kx + 28, this.KEY_Y + 32, this.KEY_ZONE_LABELS[i].slice(0, 3), {
                fontSize: '10px', color: '#555544',
            }).setOrigin(0, 0).setScrollFactor(0).setDepth(20);
            this.keyLabels.push(kl);
        }

        EventBus.on('hearts-changed', this.onHeartsChanged, this);
        EventBus.on('key-collected', this.onKeyCollected, this);

        this.refresh();
    }

    private onHeartsChanged(count: number): void {
        for (let i = 0; i < 3; i++) {
            if (i < count) {
                this.heartTexts[i].setColor('#ee1111').setAlpha(1);
            } else {
                this.heartTexts[i].setColor('#330000').setAlpha(0.35);
            }
        }
    }

    private onKeyCollected(keyIndex: number): void {
        if (keyIndex >= 0 && keyIndex < 3) {
            this.keyTexts[keyIndex].setAlpha(1);
            this.keyLabels[keyIndex].setColor('#ffcc44');
        }
    }

    refresh(): void {
        const hearts = this.scene.game.registry.get('hearts') as number ?? 3;
        this.onHeartsChanged(hearts);
        for (let i = 0; i < 3; i++) {
            const collected = this.scene.game.registry.get(this.KEY_NAMES[i]) as boolean;
            if (collected) this.onKeyCollected(i);
        }
    }

    destroy(): void {
        EventBus.off('hearts-changed', this.onHeartsChanged, this);
        EventBus.off('key-collected', this.onKeyCollected, this);
    }
}
