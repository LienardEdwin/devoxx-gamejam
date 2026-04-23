import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { playREClick } from '../utils/SoundUtils';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000);

        // Red vignette
        const vignette = this.add.graphics();
        vignette.fillStyle(0x220000, 0.7);
        vignette.fillRect(0, 0, 1024, 768);

        // Scanlines
        const lines = this.add.graphics();
        lines.lineStyle(1, 0x110000, 0.3);
        for (let y = 0; y < 768; y += 3) {
            lines.lineBetween(0, y, 1024, y);
        }

        // Game Over text
        const title = this.add.text(512, 220, 'VOUS ÊTES MORT', {
            fontFamily: 'Georgia, serif',
            fontSize: '72px',
            color: '#cc0000',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center',
        }).setOrigin(0.5).setDepth(2);

        this.add.text(512, 340, 'La maison a réclamé une nouvelle victime...', {
            fontFamily: 'Georgia, serif',
            fontSize: '22px',
            color: '#882222',
            align: 'center',
        }).setOrigin(0.5).setDepth(2);

        // Show which keys were collected
        const keyAttic = this.game.registry.get('key_attic');
        const keyBasement = this.game.registry.get('key_basement');
        const keyGarden = this.game.registry.get('key_garden');
        const count = [keyAttic, keyBasement, keyGarden].filter(Boolean).length;

        this.add.text(512, 420, `Clefs trouvées : ${count} / 3`, {
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            color: '#664422',
            align: 'center',
        }).setOrigin(0.5).setDepth(2);

        // Restart button
        const btn = this.add.text(512, 550, '[ RECOMMENCER ]', {
            fontFamily: 'Georgia, serif',
            fontSize: '34px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
        }).setOrigin(0.5).setDepth(2).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#cc0000'));
        btn.on('pointerout', () => btn.setColor('#ffffff'));
        btn.on('pointerdown', () => {
            playREClick(this);
            this.game.registry.set('hearts', 3);
            this.game.registry.set('key_attic', false);
            this.game.registry.set('key_basement', false);
            this.game.registry.set('key_garden', false);
            this.cameras.main.fade(500, 0, 0, 0, false, (_: unknown, progress: number) => {
                if (progress === 1) this.scene.start('HouseScene');
            });
        });

        // Pulsing title
        this.tweens.add({
            targets: title,
            alpha: { from: 0.7, to: 1 },
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        EventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        this.scene.start('MainMenu');
    }
}
