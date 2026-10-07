/**
 * Web Audio API synthesizer for tactile Apple-grade micro-interactions
 * Generates pure harmonic sine/bell tones without external audio assets
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTap() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Audio playback silently guarded
    }
  }

  public playAvatarClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Warm, lower-register 3-note ascending glass chime (C5 -> E5 -> G5)
      const chimeNotes = [
        { freq: 523.25, delay: 0.0, gain: 0.05, decay: 0.5 },
        { freq: 659.25, delay: 0.065, gain: 0.055, decay: 0.6 },
        { freq: 783.99, delay: 0.13, gain: 0.06, decay: 0.75 }
      ];

      chimeNotes.forEach(({ freq, delay, gain, decay }) => {
        if (!this.ctx) return;
        const start = now + delay;

        // Warm fundamental tone
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, start);
        gain1.gain.setValueAtTime(gain, start);
        gain1.gain.exponentialRampToValueAtTime(0.0001, start + decay);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(start);
        osc1.stop(start + decay + 0.01);

        // Soft crystal overtone (2nd harmonic)
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2.0, start);
        gain2.gain.setValueAtTime(gain * 0.22, start);
        gain2.gain.exponentialRampToValueAtTime(0.0001, start + (decay * 0.45));
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(start);
        osc2.stop(start + decay * 0.45 + 0.01);
      });
    } catch {
      // Audio playback silently guarded
    }
  }

  public playGlassChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Two warm resonant crystal frequencies
      [1046.5, 1567.98].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.02);

        gain.gain.setValueAtTime(0.035, now + i * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.02);
        osc.stop(now + 0.36);
      });
    } catch {
      // Guarded
    }
  }

  public playMilestone() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Celebratory ascending crystal arpeggio (C5 -> E5 -> G5 -> C6 -> E6)
      const notes = [
        { freq: 523.25, time: 0.0, gain: 0.06, decay: 0.4 },
        { freq: 659.25, time: 0.07, gain: 0.065, decay: 0.45 },
        { freq: 783.99, time: 0.14, gain: 0.07, decay: 0.5 },
        { freq: 1046.50, time: 0.21, gain: 0.08, decay: 0.65 },
        { freq: 1318.51, time: 0.28, gain: 0.075, decay: 0.85 }
      ];

      notes.forEach(({ freq, time, gain, decay }) => {
        if (!this.ctx) return;
        const start = now + time;

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gainNode.gain.setValueAtTime(gain, start);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, start + decay);

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + decay + 0.01);

        // High crystal sparkle on resolve
        if (freq >= 1046) {
          const shimmer = this.ctx.createOscillator();
          const shimmerGain = this.ctx.createGain();
          shimmer.type = 'sine';
          shimmer.frequency.setValueAtTime(freq * 2, start);
          shimmerGain.gain.setValueAtTime(gain * 0.25, start);
          shimmerGain.gain.exponentialRampToValueAtTime(0.0001, start + decay * 0.5);
          shimmer.connect(shimmerGain);
          shimmerGain.connect(this.ctx.destination);
          shimmer.start(start);
          shimmer.stop(start + decay * 0.5 + 0.01);
        }
      });
    } catch {
      // Guarded
    }
  }

  public playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C Major arpeggio

      chords.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.045;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.04, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch {
      // Guarded
    }
  }

  public playToggle() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Guarded
    }
  }

  public playModeSwitch(isLight: boolean) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Smooth uplifting tone for light mode, deep grounding chord for dark mode
      const freqs = isLight ? [587.33, 880.0] : [440.0, 220.0];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.045, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.26);
      });
    } catch {
      // Guarded
    }
  }
}

export const sounds = new SoundEngine();
