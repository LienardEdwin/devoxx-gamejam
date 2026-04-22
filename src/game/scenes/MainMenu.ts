import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene {

    constructor() {
        super('MainMenu');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000);

        // Scanlines / static effect
        const lines = this.add.graphics();
        lines.lineStyle(1, 0x110000, 0.2);
        for (let y = 0; y < 768; y += 3) {
            lines.lineBetween(0, y, 1024, y);
        }

        // Blood stain decoration
        const stain = this.add.graphics();
        stain.fillStyle(0x330000, 0.6);
        stain.fillEllipse(512, 700, 600, 80);

        // Title – flickering horror style
        const title = this.add.text(512, 180, 'MAISON HANTÉE', {
            fontFamily: 'Georgia, serif',
            fontSize: '64px',
            color: '#cc0000',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center',
        }).setOrigin(0.5).setDepth(2);

        this.add.text(512, 270, 'Trouvez les 3 clefs... si vous l\'osez.', {
            fontFamily: 'Georgia, serif',
            fontSize: '20px',
            color: '#884444',
            align: 'center',
        }).setOrigin(0.5).setDepth(2);

        // Controls hint
        this.add.text(512, 340, 'Déplacez-vous avec WASD ou les flèches directionnelles', {
            fontFamily: 'Georgia, serif',
            fontSize: '14px',
            color: '#553333',
            align: 'center',
        }).setOrigin(0.5).setDepth(2);

        // Objectives
        const objectives = [
            '🔑 Grenier  (étage)',
            '🔑 Sous-sol  (cave)',
            '🔑 Jardin  (extérieur)',
        ];
        this.add.text(512, 400, objectives.join('     '), {
            fontFamily: 'Georgia, serif',
            fontSize: '15px',
            color: '#664422',
            align: 'center',
        }).setOrigin(0.5).setDepth(2);

        // Warning
        this.add.text(512, 460, '⚠  Évitez les monstres – vous avez 3 cœurs  ⚠', {
            fontFamily: 'Georgia, serif',
            fontSize: '14px',
            color: '#882222',
            align: 'center',
        }).setOrigin(0.5).setDepth(2);

        // START button
        const startBtn = this.add.text(512, 560, '[ COMMENCER ]', {
            fontFamily: 'Georgia, serif',
            fontSize: '36px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5).setDepth(2).setInteractive({ useHandCursor: true });

        startBtn.on('pointerover', () => {
            startBtn.setColor('#cc0000');
            startBtn.setFontSize(38);
        });
        startBtn.on('pointerout', () => {
            startBtn.setColor('#ffffff');
            startBtn.setFontSize(36);
        });
        startBtn.on('pointerdown', () => {
            // Reset registry
            this.game.registry.set('hearts', 3);
            this.game.registry.set('key_attic', false);
            this.game.registry.set('key_basement', false);
            this.game.registry.set('key_garden', false);
            this.cameras.main.fade(500, 0, 0, 0, false, (_: unknown, progress: number) => {
                if (progress === 1) this.scene.start('HouseScene');
            });
        });

        // Title flicker
        this.tweens.add({
            targets: title,
            alpha: { from: 0.85, to: 1 },
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Atmospheric drip animation
        this.createBloodDrips();

        EventBus.emit('current-scene-ready', this);
    }

    private createBloodDrips(): void {
        for (let i = 0; i < 5; i++) {
            const x = 80 + i * 220;
            const drip = this.add.graphics();
            drip.fillStyle(0x880000, 0.8);
            drip.fillRect(x, 0, 3, 20);
            drip.setDepth(1);

            this.tweens.add({
                targets: drip,
                y: 60 + i * 15,
                duration: 3000 + i * 800,
                ease: 'Sine.easeIn',
                delay: i * 600,
                yoyo: false,
                repeat: -1,
                onRepeat: () => drip.setY(0),
            });
        }
    }

    // Keep changeScene for compatibility
    changeScene() {
        this.scene.start('HouseScene');
    }

    moveLogo(_cb: (pos: { x: number; y: number }) => void): void {
        // No-op, kept for type compatibility
    }
}
