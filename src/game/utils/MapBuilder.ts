import * as Phaser from 'phaser';

export class MapBuilder {
    static drawFloor(scene: Phaser.Scene, width: number, height: number, color: number = 0x1a1a2e): void {
        const gfx = scene.add.graphics();
        gfx.fillStyle(color);
        gfx.fillRect(0, 0, width, height);
        gfx.setDepth(0);
    }

    static addBoundaryWalls(
        gfx: Phaser.GameObjects.Graphics,
        walls: Phaser.Physics.Arcade.StaticGroup,
        width: number = 1024,
        height: number = 768,
        thickness: number = 32
    ): void {
        MapBuilder.addWall(gfx, walls, 0, 0, width, thickness);
        MapBuilder.addWall(gfx, walls, 0, height - thickness, width, thickness);
        MapBuilder.addWall(gfx, walls, 0, 0, thickness, height);
        MapBuilder.addWall(gfx, walls, width - thickness, 0, thickness, height);
    }

    static addWall(
        gfx: Phaser.GameObjects.Graphics,
        walls: Phaser.Physics.Arcade.StaticGroup,
        x: number,
        y: number,
        w: number,
        h: number,
        color: number = 0x2a1a0a
    ): void {
        gfx.fillStyle(color);
        gfx.fillRect(x, y, w, h);
        MapBuilder.addPhysicsWall(walls, x, y, w, h);
    }

    static addPhysicsWall(
        walls: Phaser.Physics.Arcade.StaticGroup,
        x: number,
        y: number,
        w: number,
        h: number
    ): void {
        const wall = walls.create(x + w / 2, y + h / 2, 'wall') as Phaser.Physics.Arcade.Image;
        wall.setDisplaySize(w, h);
        wall.setAlpha(0);
        wall.refreshBody();
    }

    static addObstacle(
        gfx: Phaser.GameObjects.Graphics,
        walls: Phaser.Physics.Arcade.StaticGroup,
        x: number,
        y: number,
        w: number,
        h: number,
        color: number = 0x3d2b1a
    ): void {
        gfx.fillStyle(color);
        gfx.fillRect(x, y, w, h);
        gfx.lineStyle(2, 0x1a0d00, 1);
        gfx.strokeRect(x, y, w, h);
        MapBuilder.addPhysicsWall(walls, x, y, w, h);
    }

    static createTransitionZone(
        scene: Phaser.Scene,
        x: number,
        y: number,
        w: number,
        h: number,
        label: string,
        labelColor: number = 0x4444ff
    ): void {
        const indicatorGfx = scene.add.graphics();
        indicatorGfx.fillStyle(labelColor, 0.4);
        indicatorGfx.fillRect(x, y, w, h);
        indicatorGfx.lineStyle(2, labelColor, 0.9);
        indicatorGfx.strokeRect(x, y, w, h);
        indicatorGfx.setDepth(2);

        scene.add.text(x + w / 2, y + h / 2, label, {
            fontSize: '10px',
            color: '#ffffff',
            align: 'center',
        }).setOrigin(0.5).setDepth(3);
    }
}
