import { Scene } from 'phaser';

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
        // Keep existing assets in case they're referenced elsewhere
        this.load.image('background', 'bg.png');
    }

    create() {
        this.generateTextures();
        this.scene.start('MainMenu');
    }

    private generateTextures(): void {
        this.generatePlayer();
        this.generateMonster();
        this.generateSpider();
        this.generateRat();
        this.generateRat2();
        this.generateSkeleton();
        this.generateKey();
        this.generateHearts();
        this.generateWall();
        this.generateLight();
        this.generateKeyIcons();
        this.generateSpiderWeb();
        this.generateTree();
        this.generateTomb();
    }

    private generatePlayer(): void {
        // Leon Kennedy (RE4 outfit) — 32×48px pixel art
        const g = this.make.graphics({ add: false });

        // ── Legs (dark navy tactical pants) ──────────────────────────
        g.fillStyle(0x1e2a3a);
        g.fillRect(9,  34, 6, 12);   // left leg
        g.fillRect(17, 34, 6, 12);   // right leg
        // Boots (black)
        g.fillStyle(0x111111);
        g.fillRect(8,  43, 7, 5);
        g.fillRect(17, 43, 7, 5);
        // Boot highlight
        g.fillStyle(0x2a2a2a);
        g.fillRect(9, 43, 2, 4);
        g.fillRect(18, 43, 2, 4);

        // ── Belt ──────────────────────────────────────────────────────
        g.fillStyle(0x3a2a10);
        g.fillRect(9, 33, 14, 3);
        g.fillStyle(0x8a7a40);
        g.fillRect(14, 33, 4, 3);    // belt buckle

        // ── Jacket (dark brown leather) ───────────────────────────────
        g.fillStyle(0x3a2810);
        g.fillRect(8, 16, 16, 18);
        // Jacket lapels / zipper
        g.fillStyle(0x2a1a08);
        g.fillTriangle(14, 16, 16, 16, 15, 26);
        g.fillTriangle(18, 16, 16, 16, 17, 26);
        // Jacket highlight (left shoulder)
        g.fillStyle(0x5a3e20);
        g.fillRect(8, 16, 4, 10);
        // Jacket collar
        g.fillStyle(0x2a1a08);
        g.fillRect(12, 14, 8, 4);

        // ── Arms ──────────────────────────────────────────────────────
        // Left arm
        g.fillStyle(0x3a2810);
        g.fillRect(4, 17, 5, 14);
        // Left glove (dark)
        g.fillStyle(0x1a1208);
        g.fillRect(4, 29, 5, 5);
        // Right arm (slightly raised — gun hand)
        g.fillStyle(0x3a2810);
        g.fillRect(23, 17, 5, 12);
        // Right glove
        g.fillStyle(0x1a1208);
        g.fillRect(23, 27, 5, 5);

        // ── Neck ──────────────────────────────────────────────────────
        g.fillStyle(0xc8956a);
        g.fillRect(14, 12, 4, 5);

        // ── Head ──────────────────────────────────────────────────────
        g.fillStyle(0xd4a476);
        g.fillRoundedRect(9, 3, 14, 14, 3);

        // Jaw / chin definition
        g.fillStyle(0xbf9060);
        g.fillRect(10, 13, 12, 3);

        // ── Hair (Leon's swept dirty-blonde side part) ─────────────────
        // Main hair mass — dark blonde
        g.fillStyle(0x8a6a28);
        g.fillRect(9, 2, 14, 5);
        // Side sweep (left side longer)
        g.fillRect(9, 3, 4, 8);
        // Hair highlights
        g.fillStyle(0xaa8a3a);
        g.fillRect(10, 2, 8, 3);
        g.fillRect(10, 3, 2, 5);
        // Dark roots / shadow
        g.fillStyle(0x6a5018);
        g.fillRect(9, 2, 14, 2);
        g.fillRect(20, 3, 3, 5);

        // ── Eyes (intense, slightly furrowed) ─────────────────────────
        // Brow shadow
        g.fillStyle(0x7a5030);
        g.fillRect(11, 8, 4, 2);
        g.fillRect(17, 8, 4, 2);
        // Eyes (blue-grey)
        g.fillStyle(0x4a6a8a);
        g.fillRect(12, 10, 3, 2);
        g.fillRect(17, 10, 3, 2);
        // Pupils
        g.fillStyle(0x111111);
        g.fillRect(13, 10, 2, 2);
        g.fillRect(18, 10, 2, 2);
        // Eye whites
        g.fillStyle(0xeeeedd);
        g.fillRect(12, 10, 1, 2);
        g.fillRect(17, 10, 1, 2);

        // ── Nose & mouth ──────────────────────────────────────────────
        g.fillStyle(0xaa7850);
        g.fillRect(15, 12, 2, 2);   // nose shadow
        g.fillStyle(0x8a4a30);
        g.fillRect(14, 14, 4, 1);   // mouth / slight smirk

        // ── Ear ───────────────────────────────────────────────────────
        g.fillStyle(0xc8906a);
        g.fillRect(9, 8, 2, 4);

        g.generateTexture('player', 32, 48);
        g.destroy();
    }

    private generateMonster(): void {
        const g = this.make.graphics({ add: false });
        // Ghost body
        g.fillStyle(0x33cc66, 0.85);
        g.fillCircle(16, 12, 14);
        g.fillRect(2, 12, 28, 26);
        g.fillStyle(0xff2222);
        g.fillCircle(10, 11, 4);
        g.fillCircle(22, 11, 4);
        g.fillStyle(0x000000);
        g.fillCircle(10, 11, 2);
        g.fillCircle(22, 11, 2);
        g.generateTexture('monster', 32, 44);
        g.destroy();
    }

    private generateSpider(): void {
        // Bigger spider: 64×56px
        const g = this.make.graphics({ add: false });
        const cx = 32, cy = 28;
        // Abdomen (large, round, dark)
        g.fillStyle(0x110011);
        g.fillCircle(cx + 6, cy + 4, 18);
        // Hourglass marking on abdomen
        g.fillStyle(0xff0000, 0.8);
        g.fillTriangle(cx + 6, cy - 6, cx + 1, cy + 8, cx + 11, cy + 8);
        g.fillTriangle(cx + 6, cy + 20, cx + 1, cy + 8, cx + 11, cy + 8);
        // Cephalothorax
        g.fillStyle(0x330033);
        g.fillCircle(cx - 6, cy - 2, 12);
        // 8 eyes (glowing red — 2 rows)
        g.fillStyle(0xff2200);
        for (let i = 0; i < 4; i++) {
            g.fillCircle(cx - 13 + i * 5, cy - 8, 2.5);
            g.fillCircle(cx - 11 + i * 5, cy - 3, 2);
        }
        // Chelicerae (fangs)
        g.fillStyle(0x220000);
        g.fillEllipse(cx - 10, cy + 8, 6, 10);
        g.fillEllipse(cx - 4, cy + 9, 6, 10);
        g.fillStyle(0xff2200);
        g.fillCircle(cx - 10, cy + 13, 2.5);
        g.fillCircle(cx - 4, cy + 14, 2.5);
        // 8 hairy legs (thick)
        g.lineStyle(3, 0x111111, 1);
        const legAngles = [-145, -115, -75, -45, 35, 65, 105, 135];
        for (let i = 0; i < 8; i++) {
            const rad = (legAngles[i] * Math.PI) / 180;
            const lx = cx - 6 + Math.cos(rad) * 20;
            const ly = cy - 2 + Math.sin(rad) * 20;
            g.lineBetween(cx - 6, cy - 2, lx, ly);
            g.lineStyle(2, 0x221122, 1);
            g.lineBetween(lx, ly, lx + Math.cos(rad + (i < 4 ? -0.5 : 0.5)) * 16, ly + Math.sin(rad + (i < 4 ? -0.5 : 0.5)) * 12);
            g.lineStyle(3, 0x111111, 1);
        }
        g.generateTexture('spider', 64, 56);
        g.destroy();
    }

    private generateRat(): void {
        // Scary mutant rat: 60×44px, hunched, big teeth, glowing eyes
        const g = this.make.graphics({ add: false });
        // Body (hunched, larger)
        g.fillStyle(0x443322);
        g.fillEllipse(34, 24, 38, 26);
        // Mangy fur texture (darker patches)
        g.fillStyle(0x332211);
        g.fillEllipse(28, 20, 18, 12);
        g.fillEllipse(42, 28, 14, 10);
        // Head (bigger, meaner)
        g.fillStyle(0x554433);
        g.fillCircle(12, 22, 13);
        // Snout (elongated, rat-like)
        g.fillStyle(0x775544);
        g.fillEllipse(3, 23, 14, 9);
        // Glowing red eyes
        g.fillStyle(0xff0000);
        g.fillCircle(9, 16, 4);
        g.fillStyle(0xff6600, 0.6);
        g.fillCircle(9, 16, 6); // glow halo
        g.fillStyle(0x000000);
        g.fillCircle(9, 16, 2);
        // Scar over eye
        g.lineStyle(1, 0x221100, 1);
        g.lineBetween(6, 12, 12, 18);
        // Bared teeth (white fangs)
        g.fillStyle(0xeeeedd);
        g.fillRect(2, 24, 4, 5);
        g.fillRect(7, 24, 3, 4);
        g.fillStyle(0xffffcc);
        g.fillTriangle(2, 24, 5, 24, 3, 30); // big fang
        // Ear (torn)
        g.fillStyle(0x443322);
        g.fillEllipse(18, 9, 12, 14);
        g.fillStyle(0x221111);
        g.fillEllipse(18, 10, 7, 9);
        // Claws (front)
        g.lineStyle(2, 0x221100, 1);
        g.lineBetween(0, 28, -3, 32);
        g.lineBetween(2, 30, 0, 35);
        // Tail (thick, scarred)
        g.lineStyle(4, 0x331100, 1);
        g.lineBetween(52, 24, 58, 16);
        g.lineStyle(3, 0x221100, 1);
        g.lineBetween(58, 16, 60, 28);
        g.generateTexture('rat', 62, 44);
        g.destroy();
    }

    private generateRat2(): void {
        // Giant sewer rat — 76×54px, mutated, slime-covered
        const g = this.make.graphics({ add: false });

        // Shadow
        g.fillStyle(0x000000, 0.3);
        g.fillEllipse(40, 52, 60, 10);

        // Green slime drips (behind body)
        g.fillStyle(0x336600, 0.7);
        g.fillEllipse(30, 36, 8, 14);
        g.fillEllipse(46, 40, 6, 12);
        g.fillEllipse(56, 30, 5, 10);

        // Main body — massive, hunched
        g.fillStyle(0x4a3d2e);
        g.fillEllipse(42, 28, 50, 34);
        // Fur texture — darker patches
        g.fillStyle(0x362c1e);
        g.fillEllipse(36, 22, 22, 14);
        g.fillEllipse(52, 32, 18, 12);
        g.fillStyle(0x5a4a38);
        g.fillEllipse(44, 34, 20, 10);

        // Green slime on body
        g.fillStyle(0x44aa00, 0.55);
        g.fillEllipse(38, 20, 10, 6);
        g.fillEllipse(50, 28, 8, 5);

        // Head — wide, flat snout
        g.fillStyle(0x5a4a38);
        g.fillCircle(14, 26, 14);
        // Snout
        g.fillStyle(0x7a6050);
        g.fillEllipse(4, 28, 16, 10);
        // Nostrils
        g.fillStyle(0x220000);
        g.fillCircle(2, 27, 1.5);
        g.fillCircle(6, 28, 1.5);

        // 4 red eyes (mutated — 2 pairs)
        const eyes = [{ x: 10, y: 18 }, { x: 17, y: 16 }, { x: 10, y: 24 }, { x: 17, y: 23 }];
        for (const e of eyes) {
            g.fillStyle(0xff3300, 0.5);
            g.fillCircle(e.x, e.y, 4.5);  // glow
            g.fillStyle(0xff0000);
            g.fillCircle(e.x, e.y, 2.5);
            g.fillStyle(0x000000);
            g.fillCircle(e.x, e.y, 1.2);
        }

        // Torn ear
        g.fillStyle(0x4a3d2e);
        g.fillEllipse(22, 10, 14, 18);
        g.fillStyle(0x1a0505);
        g.fillEllipse(22, 11, 8, 11);
        // Tear in ear
        g.lineStyle(1.5, 0x220000);
        g.lineBetween(20, 6, 24, 14);

        // Second smaller ear (back)
        g.fillStyle(0x3a2d1e);
        g.fillEllipse(30, 8, 10, 12);

        // Huge curved incisors
        g.fillStyle(0xdddd88);
        g.fillTriangle(0, 28, 5, 28, 2, 38);
        g.fillTriangle(6, 28, 11, 28, 8, 36);
        g.fillStyle(0xaaaa44);
        g.fillRect(1, 28, 3, 4);
        g.fillRect(7, 28, 3, 4);

        // Front claws (thick)
        g.lineStyle(2.5, 0x1a1000);
        g.lineBetween(0, 34, -3, 40);
        g.lineBetween(3, 36, 1, 43);
        g.lineBetween(7, 36, 6, 42);

        // Back haunches (raised)
        g.fillStyle(0x4a3d2e);
        g.fillEllipse(64, 22, 20, 26);
        g.fillStyle(0x362c1e);
        g.fillEllipse(64, 18, 12, 14);

        // Tail — thick, segmented, green-tinged
        g.lineStyle(5, 0x3a2a1a);
        g.lineBetween(66, 28, 73, 18);
        g.lineStyle(4, 0x4a6622);
        g.lineBetween(73, 18, 75, 32);
        g.lineStyle(3, 0x3a5010);
        g.lineBetween(75, 32, 74, 44);
        // Tail segments
        g.lineStyle(1, 0x223300, 0.7);
        for (let i = 0; i < 5; i++) {
            g.lineBetween(68 + i * 1.5, 25 + i * 3, 70 + i * 1.5, 26 + i * 3);
        }

        g.generateTexture('rat2', 76, 54);
        g.destroy();
    }

    private generateSkeleton(): void {
        const g = this.make.graphics({ add: false });
        // Skull
        g.fillStyle(0xeeeecc);
        g.fillCircle(16, 10, 10);
        // Eye sockets
        g.fillStyle(0x000000);
        g.fillCircle(11, 9, 3.5);
        g.fillCircle(21, 9, 3.5);
        // Jaw
        g.fillStyle(0xeeeecc);
        g.fillRect(8, 16, 16, 8);
        g.fillStyle(0x000000);
        g.fillRect(10, 18, 3, 5);
        g.fillRect(15, 18, 3, 5);
        g.fillRect(20, 18, 3, 5);
        // Spine / ribcage
        g.fillStyle(0xeeeecc);
        g.fillRect(13, 24, 6, 18); // spine
        g.fillRect(6, 26, 20, 3);  // rib 1
        g.fillRect(6, 31, 20, 3);  // rib 2
        g.fillRect(7, 36, 18, 3);  // rib 3
        // Arms
        g.fillRect(2, 26, 5, 16);
        g.fillRect(25, 26, 5, 16);
        // Legs
        g.fillRect(9, 42, 5, 16);
        g.fillRect(18, 42, 5, 16);
        g.generateTexture('skeleton', 32, 60);
        g.destroy();
    }

    private generateKey(): void {
        const g = this.make.graphics({ add: false });
        g.fillStyle(0xffcc00);
        // Key ring
        g.fillCircle(10, 12, 9);
        g.fillStyle(0x000000);
        g.fillCircle(10, 12, 5);
        g.fillStyle(0xffcc00);
        // Key shaft
        g.fillRect(18, 9, 22, 6);
        // Teeth
        g.fillRect(32, 15, 5, 6);
        g.fillRect(38, 15, 5, 5);
        g.generateTexture('key', 48, 28);
        g.destroy();
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
