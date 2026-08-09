/**
 * EAT.JOBS sound — a small chiptune synth on the Web Audio API.
 *
 * No audio files: every sound is oscillators and gain ramps, which keeps the
 * page weightless and matches the site's dependency-free motion rule. The
 * voice is deliberately 1980 arcade — square and triangle waves, hard attacks,
 * short decays, no reverb.
 */

type Wave = OscillatorType;

/** A note in a melody: frequency in Hz (0 = rest), and length in beats. */
type Note = [freq: number, beats: number];

const A4 = 440;
/** Semitones from A4, so melodies can be written in note names. */
const NOTES: Record<string, number> = {
  C: -9, "C#": -8, D: -7, "D#": -6, E: -5, F: -4,
  "F#": -3, G: -2, "G#": -1, A: 0, "A#": 1, B: 2,
};

/** "C4" / "F#5" → Hz. */
export function hz(name: string): number {
  const m = /^([A-G]#?)(\d)$/.exec(name);
  if (!m) return 0;
  const semis = NOTES[m[1]] + (Number(m[2]) - 4) * 12;
  return A4 * Math.pow(2, semis / 12);
}

const seq = (spec: string, beat: number): Note[] =>
  spec.split(" ").filter(Boolean).map((tok) => {
    const [n, b] = tok.split("/");
    return [n === "-" ? 0 : hz(n), (b ? Number(b) : 1) * beat] as Note;
  });

export class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private siren: { osc: OscillatorNode; gain: GainNode; lfo: OscillatorNode } | null = null;
  private chompFlip = false;
  /** When the jingle last started, so a remount can't double-trigger it. */
  private lastIntro = -Infinity;

  volume = 0.7;
  muted = false;

  /** Create (or resume) the context. Must be called from a user gesture. */
  ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.gainValue();
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private gainValue() {
    return this.muted ? 0 : 0.26 * this.volume;
  }

  private applyGain() {
    if (!this.master || !this.ctx) return;
    this.master.gain.setTargetAtTime(this.gainValue(), this.ctx.currentTime, 0.02);
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    this.applyGain();
  }

  setMuted(m: boolean) {
    this.muted = m;
    this.applyGain();
    if (m) this.stopSiren();
  }

  /** One note. `slide` bends to a second frequency across the note. */
  private tone(
    freq: number,
    dur: number,
    opts: { wave?: Wave; at?: number; gain?: number; slide?: number } = {}
  ) {
    const ctx = this.ctx;
    if (!ctx || !this.master || !freq) return;
    const t = ctx.currentTime + (opts.at ?? 0);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = opts.wave ?? "square";
    osc.frequency.setValueAtTime(freq, t);
    if (opts.slide) osc.frequency.exponentialRampToValueAtTime(opts.slide, t + dur);

    // Hard attack, quick decay: the arcade envelope.
    const peak = opts.gain ?? 0.5;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private melody(notes: Note[], opts: { wave?: Wave; gain?: number; at?: number } = {}) {
    let t = opts.at ?? 0;
    for (const [freq, dur] of notes) {
      if (freq) this.tone(freq, dur * 0.92, { ...opts, at: t });
      t += dur;
    }
    return t;
  }

  // ---- game sounds --------------------------------------------------------

  /** The waka: alternating down-sweeps, so a run of them sounds like chewing. */
  chomp() {
    if (!this.ctx || this.muted) return;
    this.chompFlip = !this.chompFlip;
    const top = this.chompFlip ? 520 : 430;
    this.tone(top, 0.07, { wave: "square", gain: 0.32, slide: top * 0.45 });
  }

  powerUp() {
    if (!this.ctx || this.muted) return;
    const steps = [hz("C5"), hz("E5"), hz("G5"), hz("C6")];
    steps.forEach((f, i) => this.tone(f, 0.09, { wave: "square", gain: 0.4, at: i * 0.055 }));
  }

  /** AI bumps you and your role gets "restructured". */
  stun() {
    if (!this.ctx || this.muted) return;
    this.tone(hz("G4"), 0.34, { wave: "sawtooth", gain: 0.34, slide: hz("G3") });
  }

  /** A job lost to the AI: a dull, flat blip, the opposite of your bright one. */
  aiEat() {
    if (!this.ctx || this.muted) return;
    this.tone(150, 0.05, { wave: "triangle", gain: 0.16 });
  }

  roundClear() {
    if (!this.ctx || this.muted) return;
    this.melody(seq("C5 E5 G5 C6/2", 0.12), { wave: "square", gain: 0.42 });
  }

  lose() {
    if (!this.ctx || this.muted) return;
    this.melody(seq("C5 A4 F4 D4 C4/2", 0.16), { wave: "square", gain: 0.4 });
    this.tone(hz("C3"), 0.9, { wave: "sawtooth", gain: 0.22, at: 0.62, slide: hz("C2") });
  }

  win() {
    if (!this.ctx || this.muted) return;
    this.melody(seq("C5 E5 G5 C6 G5 C6 E6/2", 0.13), { wave: "square", gain: 0.44 });
    this.melody(seq("C4 C4 C4 C5/2", 0.26), { wave: "triangle", gain: 0.3 });
  }

  /**
   * The attract-mode jingle, played on arrival. Returns its length in seconds
   * so the intro screen can hold still until it finishes.
   */
  intro(): number {
    const ctx = this.ensure();
    if (!ctx || this.muted) return 0;
    // React can mount this component twice (StrictMode, page transitions).
    // Two jingles stacked on top of each other sound like a fault.
    const now = performance.now();
    if (now - this.lastIntro < 3000) return 0;
    this.lastIntro = now;
    const b = 0.135;
    const lead = seq(
      "C5/1 G4/1 E4/1 A4/1 B4/1 A#4/1 A4/2 " +
        "G4/1 E5/1 G5/1 A5/1 F5/1 G5/1 E5/2",
      b
    );
    const bass = seq("C3/2 C3/2 F3/2 G3/2 C3/2 F3/2 G3/2 C3/2", b);
    const end = this.melody(lead, { wave: "square", gain: 0.4 });
    this.melody(bass, { wave: "triangle", gain: 0.3 });
    return end;
  }

  /**
   * The background siren. `urgency` (0–1) rises as jobs run out, which speeds
   * the wobble up — the room getting tenser without anything being said.
   */
  startSiren() {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.siren || this.muted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.value = 120;
    gain.gain.value = 0.055;
    lfo.type = "sine";
    lfo.frequency.value = 1.2;
    lfoGain.gain.value = 42;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    lfo.start();
    this.siren = { osc, gain, lfo };
  }

  setUrgency(u: number) {
    if (!this.siren || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.siren.lfo.frequency.setTargetAtTime(1.2 + u * 4.5, t, 0.2);
    this.siren.osc.frequency.setTargetAtTime(120 + u * 60, t, 0.2);
  }

  stopSiren() {
    if (!this.siren || !this.ctx) return;
    const { osc, lfo, gain } = this.siren;
    this.siren = null;
    gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.05);
    const stopAt = this.ctx.currentTime + 0.3;
    osc.stop(stopAt);
    lfo.stop(stopAt);
  }

  /**
   * Silence everything without tearing the context down. Closing it here
   * would be a trap: the instance is shared across remounts, so a late
   * cleanup from an old mount would close the context the new mount is
   * already using, and nothing would ever be heard again.
   */
  quiet() {
    this.stopSiren();
    void this.ctx?.suspend();
  }
}
