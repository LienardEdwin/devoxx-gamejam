import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { playREClick } from '../utils/SoundUtils';

export class MainMenu extends Scene {

    constructor() {
        super('MainMenu');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000);

        // Intro image as full-screen background
        this.add.image(512, 384, 'intro')
            .setDisplaySize(1024, 768)
            .setDepth(0);

        // START button
        const startBtn = this.add.text(512, 660, '[ COMMENCER ]', {
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
            playREClick(this);
            // Reset registry
            this.game.registry.set('hearts', 3);
            this.game.registry.set('key_attic', false);
            this.game.registry.set('key_basement', false);
            this.game.registry.set('key_garden', false);
            this.cameras.main.fade(500, 0, 0, 0, false, (_: unknown, progress: number) => {
                if (progress === 1) this.scene.start('HouseScene');
            });
        });

        EventBus.emit('current-scene-ready', this);
    }

    // Keep changeScene for compatibility
    changeScene() {
        this.scene.start('HouseScene');
    }

    moveLogo(_cb: (pos: { x: number; y: number }) => void): void {
        // No-op, kept for type compatibility
    }
}
