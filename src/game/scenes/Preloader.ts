import { Scene } from 'phaser';
import heroUrl from '../assets/hero.png';
import ghostUrl from '../assets/ghost.png';
import spiderUrl from '../assets/spider.png';
import ratUrl from '../assets/rat.png';
import skeletonUrl from '../assets/skeleton.png';
import keyUrl from '../assets/key.png';
import introUrl from '../assets/intro.png';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.cameras.main.setBackgroundColor(0x000000);

        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0x440000);
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xcc0000);

        this.add.text(512, 320, 'CHARGEMENT...', {
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            color: '#cc0000',
        }).setOrigin(0.5);

        this.load.on('progress', (progress: number) => {
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background', 'bg.png');

        // Reset path before loading Vite-imported URLs (setPath would break them)
        this.load.setPath('');
        this.load.image('player', heroUrl);
        this.load.image('monster', ghostUrl);
        this.load.image('spider', spiderUrl);
        this.load.image('rat', ratUrl);
        this.load.image('rat2', ratUrl);
        this.load.image('skeleton', skeletonUrl);
        this.load.image('key', keyUrl);
        this.load.image('intro', introUrl);
    }

    create() {
        this.generateTextures();
        this.scene.start('MainMenu');
    }

    private generateTextures(): void {
        this.generateHearts();
        this.generateWall();
        this.generateLight();
        this.generateKeyIcons();
        this.generateSpiderWeb();
        this.generateTree();
        this.generateTomb();
    }

    private generateHearts(): void {
        // Full heart
        const g = this.make.graphics({ add: false });
        g.fillStyle(0xee1111);
        g.fillCircle(7, 7, 7);
        g.fillCircle(17, 7, 7);
        g.fillTriangle(0, 8, 24, 8, 12, 22);
        g.generateTexture('heart', 24, 22);
        g.destroy();

        // Empty heart
        const ge = this.make.graphics({ add: false });
        ge.fillStyle(0x333333);
        ge.fillCircle(7, 7, 7);
        ge.fillCircle(17, 7, 7);
        ge.fillTriangle(0, 8, 24, 8, 12, 22);
        ge.generateTexture('heart-empty', 24, 22);
        ge.destroy();
    }

    private generateWall(): void {
        // 1x1 white pixel for physics walls
        const g = this.make.graphics({ add: false });
        g.fillStyle(0xffffff);
        g.fillRect(0, 0, 1, 1);
        g.generateTexture('wall', 1, 1);
        g.destroy();
    }

    private generateLight(): void {
        const radius = 150;
        const size = radius * 2;

        // Try canvas texture for smooth radial gradient
        try {
            const ct = this.textures.createCanvas('light', size, size) as any;
            const canvas: HTMLCanvasElement = ct.canvas || ct.getCanvas?.();
            const ctx: CanvasRenderingContext2D = ct.context || canvas?.getContext('2d');
            if (ctx) {
                const grad = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
                grad.addColorStop(0, 'rgba(255,255,255,1)');
                grad.addColorStop(0.55, 'rgba(255,255,255,0.85)');
                grad.addColorStop(0.85, 'rgba(255,255,255,0.3)');
                grad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.clearRect(0, 0, size, size);
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, size, size);
                ct.refresh?.();
            }
        } catch (_e) {
            // Fallback: layered circles
            const g = this.make.graphics({ add: false });
            const steps = [
                { r: 150, a: 0.05 }, { r: 130, a: 0.12 }, { r: 110, a: 0.18 },
                { r: 90, a: 0.28 }, { r: 70, a: 0.42 }, { r: 50, a: 0.6 },
                { r: 30, a: 0.8 }, { r: 15, a: 0.95 }, { r: 5, a: 1.0 },
            ];
            for (const s of steps) {
                g.fillStyle(0xffffff, s.a);
                g.fillCircle(radius, radius, s.r);
            }
            g.generateTexture('light', size, size);
            g.destroy();
        }

        // Small ambient glow (80px radius)
        const smallRadius = 40;
        const smallSize = smallRadius * 2;
        try {
            const ct = this.textures.createCanvas('light-small', smallSize, smallSize) as any;
            const canvas: HTMLCanvasElement = ct.canvas || ct.getCanvas?.();
            const ctx: CanvasRenderingContext2D = ct.context || canvas?.getContext('2d');
            if (ctx) {
                const grad = ctx.createRadialGradient(smallRadius, smallRadius, 0, smallRadius, smallRadius, smallRadius);
                grad.addColorStop(0, 'rgba(255,255,180,0.6)');
                grad.addColorStop(1, 'rgba(255,255,180,0)');
                ctx.clearRect(0, 0, smallSize, smallSize);
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, smallSize, smallSize);
                ct.refresh?.();
            }
        } catch (_e) {
            const g = this.make.graphics({ add: false });
            g.fillStyle(0xffffbb, 0.5);
            g.fillCircle(smallRadius, smallRadius, smallRadius);
            g.generateTexture('light-small', smallSize, smallSize);
            g.destroy();
        }
    }

    private generateKeyIcons(): void {
        // Collected key icon
        const g = this.make.graphics({ add: false });
        g.fillStyle(0xffcc00);
        g.fillCircle(8, 8, 6);
        g.fillStyle(0x000000);
        g.fillCircle(8, 8, 3);
        g.fillStyle(0xffcc00);
        g.fillRect(13, 5, 10, 4);
        g.fillRect(19, 9, 4, 4);
        g.generateTexture('key-icon', 24, 16);
        g.destroy();

        // Empty key slot
        const ge = this.make.graphics({ add: false });
        ge.lineStyle(1, 0x444444, 1);
        ge.fillStyle(0x222222);
        ge.fillCircle(8, 8, 6);
        ge.strokeCircle(8, 8, 6);
        ge.lineBetween(13, 7, 23, 7);
        ge.generateTexture('key-icon-empty', 24, 16);
        ge.destroy();
    }

    private generateTree(): void {
        // 64×96px — spooky bare tree, high contrast
        const g = this.make.graphics({ add: false });

        // Shadow on ground
        g.fillStyle(0x000000, 0.4);
        g.fillEllipse(32, 92, 44, 12);

        // Trunk — warm brown, visible on dark green ground
        g.fillStyle(0x5c3a1e);
        g.fillRect(26, 48, 12, 46);
        // Bark highlight
        g.fillStyle(0x7a4e28);
        g.fillRect(28, 50, 4, 42);
        // Bark dark side
        g.fillStyle(0x3a2010);
        g.fillRect(34, 50, 3, 42);

        // Trunk outline
        g.lineStyle(1, 0x1a0c04, 1);
        g.strokeRect(26, 48, 12, 46);

        // Main branches — thick, brown
        g.lineStyle(6, 0x4a3018, 1);
        g.lineBetween(32, 52, 13, 26);
        g.lineBetween(32, 52, 51, 22);
        g.lineBetween(32, 62, 7, 44);
        g.lineBetween(32, 62, 57, 40);

        // Branch highlight edges
        g.lineStyle(2, 0x6a4828, 0.7);
        g.lineBetween(31, 52, 12, 26);
        g.lineBetween(33, 52, 52, 22);

        // Sub-branches — medium brown
        g.lineStyle(3, 0x3e2814, 1);
        g.lineBetween(13, 26, 3, 12);
        g.lineBetween(13, 26, 21, 10);
        g.lineBetween(7, 44, 1, 30);
        g.lineBetween(7, 44, 13, 32);
        g.lineBetween(51, 22, 45, 8);
        g.lineBetween(51, 22, 61, 10);
        g.lineBetween(57, 40, 51, 28);
        g.lineBetween(57, 40, 63, 30);

        // Twigs — lighter tips
        g.lineStyle(1.5, 0x5a3a1a, 1);
        g.lineBetween(3, 12, 0, 4);
        g.lineBetween(21, 10, 17, 2);
        g.lineBetween(21, 10, 27, 4);
        g.lineBetween(45, 8, 41, 0);
        g.lineBetween(45, 8, 51, 2);
        g.lineBetween(61, 10, 57, 2);
        g.lineBetween(61, 10, 64, 4);
        g.lineBetween(1, 30, 0, 22);
        g.lineBetween(51, 28, 56, 22);

        // Moss patches (greenish glow on dark bg)
        g.fillStyle(0x1a3d1a, 0.8);
        g.fillCircle(11, 24, 6);
        g.fillCircle(53, 20, 5);
        g.fillCircle(5, 42, 5);
        g.fillCircle(59, 38, 5);
        // Lighter moss highlight
        g.fillStyle(0x2a5a2a, 0.6);
        g.fillCircle(11, 23, 3);
        g.fillCircle(53, 19, 3);

        g.generateTexture('tree', 64, 96);
        g.destroy();
    }

    private generateTomb(): void {
        // 48×64px — classic tombstone
        const g = this.make.graphics({ add: false });

        // Shadow
        g.fillStyle(0x000000, 0.2);
        g.fillEllipse(24, 62, 38, 8);

        // Stone base slab
        g.fillStyle(0x2a2a32);
        g.fillRect(6, 52, 36, 8);
        g.lineStyle(1, 0x1a1a22);
        g.strokeRect(6, 52, 36, 8);

        // Main stone body (rounded top)
        g.fillStyle(0x2e2e38);
        g.fillRoundedRect(8, 10, 32, 44, { tl: 14, tr: 14, bl: 2, br: 2 });

        // Stone edge highlight (left side lighter)
        g.lineStyle(2, 0x3e3e4a, 1);
        g.lineBetween(9, 22, 9, 52);
        g.lineStyle(1, 0x1a1a22, 1);
        g.lineBetween(39, 22, 39, 52);

        // Cracks
        g.lineStyle(1, 0x1a1a22, 0.9);
        g.lineBetween(18, 18, 16, 34);
        g.lineBetween(16, 34, 20, 42);
        g.lineBetween(30, 22, 32, 36);

        // Cross engraved
        g.lineStyle(2, 0x4a4a5a, 1);
        g.lineBetween(24, 14, 24, 30);  // vertical
        g.lineBetween(17, 20, 31, 20);  // horizontal

        // R.I.P text (drawn as simple pixel lines)
        g.lineStyle(1, 0x5a5a6a, 1);
        // R
        g.lineBetween(16, 34, 16, 42);
        g.lineBetween(16, 34, 19, 34);
        g.lineBetween(19, 34, 20, 37);
        g.lineBetween(20, 37, 16, 38);
        g.lineBetween(18, 38, 21, 42);
        // I
        g.lineBetween(23, 34, 27, 34);
        g.lineBetween(25, 34, 25, 42);
        g.lineBetween(23, 42, 27, 42);
        // P
        g.lineBetween(29, 34, 29, 42);
        g.lineBetween(29, 34, 32, 34);
        g.lineBetween(32, 34, 33, 37);
        g.lineBetween(33, 37, 29, 38);

        g.generateTexture('tomb', 48, 64);
        g.destroy();
    }

    private generateSpiderWeb(): void {
        const size = 80;
        const cx = size / 2;
        const cy = size / 2;
        const g = this.make.graphics({ add: false });

        // Concentric rings
        g.lineStyle(1, 0xdddddd, 0.55);
        for (let r = 8; r <= 38; r += 10) {
            g.strokeCircle(cx, cy, r);
        }

        // Radial spokes (8 directions)
        const spokes = 8;
        for (let i = 0; i < spokes; i++) {
            const angle = (i / spokes) * Math.PI * 2;
            g.lineBetween(cx, cy, cx + Math.cos(angle) * 38, cy + Math.sin(angle) * 38);
        }

        // Slight fill so the zone is visible on dark floor
        g.fillStyle(0xaaaaaa, 0.08);
        g.fillCircle(cx, cy, 38);

        g.generateTexture('spider-web', size, size);
        g.destroy();
    }
}
