/**
 * Plays a short horror scream sting using the Web Audio API.
 */
export function playREClick(scene: Phaser.Scene): void {
    const ctx = (scene.sound as any).context as AudioContext | undefined;
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.9;

    const curve = new Float32Array(512);
    const k = 300;
    for (let i = 0; i < 512; i++) {
        const x = (i * 2) / 512 - 1;
        curve[i] = ((Math.PI + k) * x) / (Math.PI + k * Math.abs(x));
    }

    const osc = ctx.createOscillator();
    const distortion = ctx.createWaveShaper();
    const mainGain = ctx.createGain();
    osc.type = 'sawtooth';
    distortion.curve = curve;
    osc.connect(distortion);
    distortion.connect(mainGain);
    mainGain.connect(ctx.destination);
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(1300, now + 0.45);
    osc.frequency.exponentialRampToValueAtTime(700, now + duration);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(8, now);
    lfo.frequency.linearRampToValueAtTime(18, now + 0.3);
    lfoGain.gain.setValueAtTime(10, now);
    lfoGain.gain.linearRampToValueAtTime(80, now + 0.3);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(0.45, now + 0.06);
    mainGain.gain.setValueAtTime(0.45, now + 0.35);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    const noiseLength = Math.ceil(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, noiseLength, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseLength; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1400;
    noiseFilter.Q.value = 0.4;
    const noiseGain = ctx.createGain();
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.start(now);   osc.stop(now + duration);
    lfo.start(now);   lfo.stop(now + duration);
    noise.start(now); noise.stop(now + duration);
}

// ── Footstep types ───────────────────────────────────────────────────────────

export type FootstepType = 'wood' | 'creak' | 'metal' | 'dirt';

export function playFootstep(scene: Phaser.Scene, type: FootstepType): void {
    const ctx = (scene.sound as any).context as AudioContext | undefined;
    if (!ctx) return;
    switch (type) {
        case 'wood':  playWoodStep(ctx);  break;
        case 'creak': playCreakStep(ctx); break;
        case 'metal': playMetalStep(ctx); break;
        case 'dirt':  playDirtStep(ctx);  break;
    }
}

/** Wooden floor — short dull thud with low resonance */
function playWoodStep(ctx: AudioContext): void {
    const now = ctx.currentTime;

    // Body thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.09);
    gain.gain.setValueAtTime(0.38, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.1);

    // Surface noise
    const len = Math.ceil(ctx.sampleRate * 0.07);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const ns = ctx.createBufferSource(); ns.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 350;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.12, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    ns.connect(f); f.connect(ng); ng.connect(ctx.destination);
    ns.start(now); ns.stop(now + 0.07);
}

/** Attic — slow wooden creak with random pitch */
function playCreakStep(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const pv = 0.8 + Math.random() * 0.4;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260 * pv, now);
    osc.frequency.exponentialRampToValueAtTime(90 * pv, now + 0.28);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.32);

    // Subtle harmonic
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(520 * pv, now);
    osc2.frequency.exponentialRampToValueAtTime(180 * pv, now + 0.28);
    g2.gain.setValueAtTime(0.08, now);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc2.connect(g2); g2.connect(ctx.destination);
    osc2.start(now); osc2.stop(now + 0.28);
}

/** Basement — metallic clang with high-frequency ring */
function playMetalStep(ctx: AudioContext): void {
    const now = ctx.currentTime;

    // Metallic ring
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.18);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.22);

    // Impact click
    const len = Math.ceil(ctx.sampleRate * 0.04);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const ns = ctx.createBufferSource(); ns.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1200;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.28, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    ns.connect(f); f.connect(ng); ng.connect(ctx.destination);
    ns.start(now); ns.stop(now + 0.04);
}

/** Garden — soft muffled thud on earth */
function playDirtStep(ctx: AudioContext): void {
    const now = ctx.currentTime;

    const len = Math.ceil(ctx.sampleRate * 0.13);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const ns = ctx.createBufferSource(); ns.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 180;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
    ns.connect(f); f.connect(gain); gain.connect(ctx.destination);
    ns.start(now); ns.stop(now + 0.13);

    // Subtle low body
    const osc = ctx.createOscillator();
    const og = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
    og.gain.setValueAtTime(0.15, now);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(og); og.connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.1);
}


