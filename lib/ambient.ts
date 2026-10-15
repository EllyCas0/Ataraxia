import type { Domain } from "./types";

// Generative ambient sound for the Council page. Everything is synthesized in
// the browser with the Web Audio API — no audio files, no licensing, works
// offline. Each question domain maps to one "mood" (key, chord, timbre, and
// optional plucks / low pulse / wind).

export interface Mood {
  label: string;
  root: number; // Hz, lowest drone note
  chord: number[]; // semitones above root, one drone voice each
  wave: OscillatorType;
  cutoff: number; // lowpass Hz — lower is darker
  swell: number; // seconds per slow "breath"
  detune: number; // cents of chorus spread
  plucks?: { scale: number[]; octaves: number[]; every: [number, number] };
  pulse?: { every: number };
  wind?: number; // 0..1 noise level
}

export const moods: Record<Domain, Mood> = {
  ethics: {
    label: "Warm & steady",
    root: 73.42, chord: [0, 7, 12, 16], wave: "triangle", cutoff: 900, swell: 14, detune: 5,
    plucks: { scale: [0, 2, 4, 7, 9], octaves: [2, 3], every: [7, 12] },
  },
  "political-philosophy": {
    label: "Weighty & measured",
    root: 65.41, chord: [0, 7, 12, 15], wave: "triangle", cutoff: 520, swell: 10, detune: 4,
    pulse: { every: 3.2 },
  },
  metaphysics: {
    label: "Vast & still",
    root: 110, chord: [0, 7, 14, 19], wave: "sine", cutoff: 1800, swell: 20, detune: 8,
    plucks: { scale: [0, 2, 6, 7, 9, 11], octaves: [3, 4], every: [9, 16] },
  },
  epistemology: {
    label: "Clear & curious",
    root: 98, chord: [0, 7, 12], wave: "sine", cutoff: 1400, swell: 12, detune: 4,
    plucks: { scale: [0, 2, 4, 7, 9], octaves: [2, 3], every: [3.5, 7] },
  },
  "philosophy-of-mind": {
    label: "Ethereal & shifting",
    root: 82.41, chord: [0, 4, 8, 14], wave: "sine", cutoff: 2200, swell: 9, detune: 14,
    plucks: { scale: [0, 2, 4, 6, 8, 10], octaves: [3, 4], every: [6, 11] },
  },
  "philosophy-of-history": {
    label: "Ancient & deep",
    root: 73.42, chord: [0, 7, 12, 19], wave: "triangle", cutoff: 600, swell: 18, detune: 6,
    wind: 0.5,
  },
  aesthetics: {
    label: "Warm & luminous",
    root: 87.31, chord: [0, 4, 7, 11], wave: "triangle", cutoff: 1500, swell: 12, detune: 5,
    plucks: { scale: [0, 4, 7, 11, 14], octaves: [2, 3], every: [2.5, 5] },
  },
  "philosophy-of-religion": {
    label: "Sacred & slow",
    root: 73.42, chord: [0, 7, 12, 19, 24], wave: "sine", cutoff: 1200, swell: 22, detune: 6,
    wind: 0.15,
  },
};

const FADE_IN = 3;
const FADE_OUT = 2;

const hz = (root: number, semitones: number) => root * Math.pow(2, semitones / 12);
const rand = (min: number, max: number) => min + Math.random() * (max - min);

class Scene {
  private nodes: AudioScheduledSourceNode[] = [];
  private timers: number[] = [];
  readonly out: GainNode;

  constructor(private ctx: AudioContext, private mood: Mood, destination: AudioNode) {
    this.out = ctx.createGain();
    this.out.gain.value = 0;
    this.out.connect(destination);
    this.out.gain.setTargetAtTime(1, ctx.currentTime, FADE_IN / 3);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = mood.cutoff;
    filter.connect(this.out);

    // A soft feedback delay gives plucks and pulses some space.
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.37;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.42;
    const damp = ctx.createBiquadFilter();
    damp.type = "lowpass";
    damp.frequency.value = 1800;
    const send = ctx.createGain();
    send.gain.value = 0.5;
    send.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(damp);
    damp.connect(this.out);

    this.startDrone(filter);
    if (mood.plucks) this.startPlucks(filter, send);
    if (mood.pulse) this.startPulse(send);
    if (mood.wind) this.startWind(this.out, mood.wind);
  }

  private track<T extends AudioScheduledSourceNode>(node: T): T {
    this.nodes.push(node);
    return node;
  }

  private startDrone(dest: AudioNode) {
    const { ctx, mood } = this;
    const perVoice = 0.16 / mood.chord.length;
    mood.chord.forEach((semi, i) => {
      for (const side of [-1, 1]) {
        const osc = this.track(ctx.createOscillator());
        osc.type = mood.wave;
        osc.frequency.value = hz(mood.root, semi);
        osc.detune.value = side * mood.detune;
        const voice = ctx.createGain();
        voice.gain.value = perVoice;

        // Each voice "breathes" on its own slow cycle so the chord never sounds static.
        const lfo = this.track(ctx.createOscillator());
        lfo.frequency.value = 1 / (mood.swell * (0.8 + i * 0.13));
        const depth = ctx.createGain();
        depth.gain.value = perVoice * 0.6;
        lfo.connect(depth);
        depth.connect(voice.gain);

        osc.connect(voice);
        voice.connect(dest);
        osc.start();
        lfo.start();
      }
    });
  }

  private startPlucks(dest: AudioNode, send: AudioNode) {
    const { plucks, root } = this.mood;
    if (!plucks) return;
    const schedule = () => {
      if (this.ctx.state !== "running") {
        this.timers.push(window.setTimeout(schedule, 1000));
        return;
      }
      const semi = plucks.scale[Math.floor(Math.random() * plucks.scale.length)];
      const oct = plucks.octaves[Math.floor(Math.random() * plucks.octaves.length)];
      this.pluck(hz(root, semi) * Math.pow(2, oct), dest, send);
      this.timers.push(window.setTimeout(schedule, rand(plucks.every[0], plucks.every[1]) * 1000));
    };
    this.timers.push(window.setTimeout(schedule, rand(1500, 4000)));
  }

  private pluck(freq: number, dest: AudioNode, send: AudioNode) {
    const { ctx } = this;
    const t = ctx.currentTime;
    const osc = this.track(ctx.createOscillator());
    osc.type = "sine";
    osc.frequency.value = freq;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.07, t + 0.03);
    env.gain.exponentialRampToValueAtTime(0.0005, t + 3.2);
    osc.connect(env);
    env.connect(dest);
    env.connect(send);
    osc.start(t);
    osc.stop(t + 3.4);
  }

  private startPulse(send: AudioNode) {
    const { pulse } = this.mood;
    if (!pulse) return;
    const beat = () => {
      const { ctx } = this;
      if (ctx.state !== "running") {
        this.timers.push(window.setTimeout(beat, 1000));
        return;
      }
      const t = ctx.currentTime;
      const osc = this.track(ctx.createOscillator());
      osc.type = "sine";
      osc.frequency.setValueAtTime(70, t);
      osc.frequency.exponentialRampToValueAtTime(42, t + 0.5);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.28, t + 0.02);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
      osc.connect(env);
      env.connect(this.out);
      env.connect(send);
      osc.start(t);
      osc.stop(t + 1);
      this.timers.push(window.setTimeout(beat, pulse.every * 1000));
    };
    this.timers.push(window.setTimeout(beat, 800));
  }

  private startWind(dest: AudioNode, level: number) {
    const { ctx } = this;
    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    const src = this.track(ctx.createBufferSource());
    src.buffer = buffer;
    src.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 420;
    band.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.value = 0.05 * level;
    const lfo = this.track(ctx.createOscillator());
    lfo.frequency.value = 0.07;
    const depth = ctx.createGain();
    depth.gain.value = 0.03 * level;
    lfo.connect(depth);
    depth.connect(gain.gain);
    src.connect(band);
    band.connect(gain);
    gain.connect(dest);
    src.start();
    lfo.start();
  }

  stop() {
    this.timers.forEach((id) => window.clearTimeout(id));
    this.timers = [];
    const { ctx } = this;
    this.out.gain.cancelScheduledValues(ctx.currentTime);
    this.out.gain.setTargetAtTime(0, ctx.currentTime, FADE_OUT / 3);
    window.setTimeout(() => {
      for (const node of this.nodes) {
        try { node.stop(); } catch { /* Already stopped. */ }
      }
      this.out.disconnect();
    }, FADE_OUT * 1000 + 300);
  }
}

export type PlayerState = "none" | "running" | "suspended" | "closed";

export class AmbientPlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private scene: Scene | null = null;
  private listener: ((state: PlayerState) => void) | null = null;

  static isSupported(): boolean {
    return typeof window !== "undefined" && Boolean(window.AudioContext ?? (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext);
  }

  get state(): PlayerState {
    if (!this.ctx) return "none";
    return this.ctx.state === "running" ? "running" : this.ctx.state === "closed" ? "closed" : "suspended";
  }

  onStateChange(listener: ((state: PlayerState) => void) | null) {
    this.listener = listener;
  }

  // Safe to call without a user gesture: if the browser blocks audio, the
  // context stays suspended and begins when resume() is called from a gesture.
  start(domain: Domain, volume: number) {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctor();
      this.ctx = ctx;
      this.master = ctx.createGain();
      this.master.connect(ctx.destination);
      ctx.onstatechange = () => this.listener?.(this.state);
    }
    this.setVolume(volume);
    if (!this.scene) this.setDomain(domain);
    this.resume();
    this.listener?.(this.state);
  }

  resume() {
    if (this.ctx && this.ctx.state !== "running" && this.ctx.state !== "closed") void this.ctx.resume().catch(() => {});
  }

  pause() {
    if (this.ctx && this.ctx.state === "running") void this.ctx.suspend().catch(() => {});
  }

  setDomain(domain: Domain) {
    if (!this.ctx || !this.master) return;
    this.scene?.stop();
    this.scene = new Scene(this.ctx, moods[domain], this.master);
  }

  setVolume(volume: number) {
    if (this.ctx && this.master) this.master.gain.setTargetAtTime(Math.min(1, Math.max(0, volume)), this.ctx.currentTime, 0.1);
  }

  stop() {
    this.scene?.stop();
    this.scene = null;
    const ctx = this.ctx;
    if (ctx) window.setTimeout(() => { if (!this.scene && ctx.state === "running") void ctx.suspend().catch(() => {}); }, FADE_OUT * 1000 + 400);
  }

  dispose() {
    this.listener = null;
    this.scene?.stop();
    this.scene = null;
    const ctx = this.ctx;
    this.ctx = null;
    this.master = null;
    if (ctx) {
      ctx.onstatechange = null;
      window.setTimeout(() => { void ctx.close().catch(() => {}); }, FADE_OUT * 1000 + 400);
    }
  }
}
