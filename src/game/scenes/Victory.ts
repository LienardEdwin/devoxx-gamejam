import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Victory extends Scene {
    constructor() {
        super('Victory');
    }

    create(): void {
        this.cameras.main.setBackgroundColor(0x000000);

        // Static noise / VHS lines effect
        const noise = this.add.graphics();
        noise.lineStyle(1, 0x001100, 0.15);
        for (let y = 0; y < 768; y += 4) {
            noise.lineBetween(0, y, 1024, y);
        }
        noise.setDepth(0);

        // Title
        const title = this.add.text(512, 200, 'VOUS ÊTES LIBRE...', {
            fontFamily: 'Georgia, serif',
            fontSize: '48px',
            color: '#00ff44',
            stroke: '#000',
            strokeThickness: 6,
            align: 'center',
        }).setOrigin(0.5).setDepth(1);

        // Subtitle
        this.add.text(512, 300, 'Vous avez récupéré les 3 clefs\net fui la maison hantée.', {
            fontFamily: 'Georgia, serif',
            fontSize: '22px',
            color: '#88ff88',
            stroke: '#000',
            strokeThickness: 3,
            align: 'center',
        }).setOrigin(0.5).setDepth(1);

        // Eerie message
        this.add.text(512, 440, '...mais quelque chose vous suit encore.', {
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            color: '#336633',
            align: 'center',
        }).setOrigin(0.5).setDepth(1);

        // Restart button
        const btn = this.add.text(512, 560, '[ JOUER À NOUVEAU ]', {
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000',
            strokeThickness: 4,
        }).setOrigin(0.5).setDepth(2).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#00ff44'));
        btn.on('pointerout', () => btn.setColor('#ffffff'));
        btn.on('pointerdown', () => {
            this.game.registry.set('hearts', 3);
            this.game.registry.set('key_attic', false);
            this.game.registry.set('key_basement', false);
            this.game.registry.set('key_garden', false);
            this.scene.start('HouseScene');
        });

        // Flicker effect on title
        this.tweens.add({
            targets: title,
            alpha: { from: 0.8, to: 1 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        EventBus.emit('current-scene-ready', this);
    }
}
