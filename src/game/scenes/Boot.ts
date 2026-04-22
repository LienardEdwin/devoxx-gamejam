import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Minimal load – Preloader generates all assets programmatically
        this.load.image('background', 'assets/bg.png');
    }

    create() {
        this.scene.start('Preloader');
    }
}
