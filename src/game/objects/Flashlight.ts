import * as Phaser from 'phaser';

export class Flashlight {
    private rt: Phaser.GameObjects.RenderTexture;
    private scene: Phaser.Scene;
    private readonly WIDTH = 1024;
    private readonly HEIGHT = 768;
    private readonly LIGHT_RADIUS = 150;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.rt = scene.add.renderTexture(0, 0, this.WIDTH, this.HEIGHT);
        this.rt.setScrollFactor(0);
        this.rt.setDepth(10);
    }

    update(playerX: number, playerY: number): void {
        const cam = this.scene.cameras.main;
        const screenX = playerX - cam.scrollX;
        const screenY = playerY - cam.scrollY;

        this.rt.clear();
        this.rt.fill(0x000000, 0.93);

        // Erase main light around player
        this.rt.erase('light', screenX - this.LIGHT_RADIUS, screenY - this.LIGHT_RADIUS);

        // Tiny ambient glow
        this.rt.erase('light-small', screenX - 40, screenY - 40);
    }

    destroy(): void {
        this.rt.destroy();
    }
}
