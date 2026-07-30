// Web Audio API Audio Service with synth sound effects and generative ambient music

class AudioService {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicMuted = false;
  private isSfxMuted = false;
  private musicVolume = 0.25;
  private sfxVolume = 0.6;
  private musicLoopInterval: number | null = null;

  constructor() {
    // Lazy initialization on user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master FX Chain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.isSfxMuted ? 0 : this.sfxVolume;
      this.sfxGain.connect(this.ctx.destination);

      // Music Chain
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.isMusicMuted ? 0 : this.musicVolume;
      this.musicGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMusicVolume(val: number) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.musicGain && !this.isMusicMuted) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx ? this.ctx.currentTime : 0);
    }
  }

  public setSfxVolume(val: number) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGain && !this.isSfxMuted) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx ? this.ctx.currentTime : 0);
    }
  }

  public toggleMusic(): boolean {
    this.isMusicMuted = !this.isMusicMuted;
    if (this.musicGain) {
      const targetGain = this.isMusicMuted ? 0 : this.musicVolume;
      this.musicGain.gain.linearRampToValueAtTime(targetGain, (this.ctx?.currentTime || 0) + 0.1);
    }
    if (!this.isMusicMuted && !this.musicLoopInterval) {
      this.startAmbientMusic();
    }
    return !this.isMusicMuted;
  }

  public toggleSfx(): boolean {
    this.isSfxMuted = !this.isSfxMuted;
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.isSfxMuted ? 0 : this.sfxVolume;
    }
    return !this.isSfxMuted;
  }

  public getMusicStatus() {
    return !this.isMusicMuted;
  }

  public getSfxStatus() {
    return !this.isSfxMuted;
  }

  // Generate ambient background synth chords and melodies
  public startAmbientMusic() {
    this.initCtx();
    if (this.musicLoopInterval) {
      window.clearInterval(this.musicLoopInterval);
    }

    // Pentatonic ambient notes (C Major Pentatonic: C, D, E, G, A)
    const notes = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00];

    this.musicLoopInterval = window.setInterval(() => {
      if (this.isMusicMuted || !this.ctx || !this.musicGain) return;

      const now = this.ctx.currentTime;
      // Play a soft floating pad / arpeggio note
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      osc.frequency.setValueAtTime(randomNote, now);

      // Soft filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;

      // Slow attack and long release
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.08, now + 2);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 7);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 7.5);
    }, 2800);
  }

  public stopAmbientMusic() {
    if (this.musicLoopInterval) {
      window.clearInterval(this.musicLoopInterval);
      this.musicLoopInterval = null;
    }
  }

  // --- Sound Effects ---

  // Soft pop/click when revealing a tile
  public playReveal() {
    this.initCtx();
    if (this.isSfxMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Flag placement sound
  public playFlag() {
    this.initCtx();
    if (this.isSfxMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.06); // A5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Unflag sound
  public playUnflag() {
    this.initCtx();
    if (this.isSfxMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(392, now + 0.05); // G4

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Found or used a bonus
  public playBonus() {
    this.initCtx();
    if (this.isSfxMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    
    // Arpeggio up
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.22);
    });
  }

  // Missile whoosh sound
  public playMissile() {
    this.initCtx();
    if (this.isSfxMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Noise buffer for jet whoosh
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(1500, now + 0.3);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + 0.6);

    // End explosion
    setTimeout(() => {
      this.playExplosion(0.3);
    }, 350);
  }

  // Radar ping sound
  public playRadar() {
    this.initCtx();
    if (this.isSfxMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    const delay = this.ctx.createDelay();
    delay.delayTime.value = 0.15;
    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.3;

    gain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(this.sfxGain);
    gain.connect(this.sfxGain);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Shield protection sound
  public playShieldBlock() {
    this.initCtx();
    if (this.isSfxMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.2);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // Victory fanfare
  public playVictory() {
    this.initCtx();
    if (this.isSfxMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const notes = [
      { freq: 523.25, duration: 0.15, time: 0 },
      { freq: 659.25, duration: 0.15, time: 0.15 },
      { freq: 783.99, duration: 0.15, time: 0.3 },
      { freq: 1046.50, duration: 0.4, time: 0.45 },
      { freq: 880.00, duration: 0.2, time: 0.85 },
      { freq: 1046.50, duration: 0.6, time: 1.05 }
    ];

    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, now + n.time);
      gain.gain.setValueAtTime(0, now + n.time);
      gain.gain.linearRampToValueAtTime(0.3, now + n.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + n.time + n.duration);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + n.time);
      osc.stop(now + n.time + n.duration + 0.05);
    });
  }

  // Explosion sound
  public playExplosion(volumeMult = 1.0) {
    this.initCtx();
    if (this.isSfxMuted || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(100, now + 1.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8 * volumeMult, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + 1.5);
  }
}

export const audio = new AudioService();
