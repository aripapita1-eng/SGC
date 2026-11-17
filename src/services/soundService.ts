/**
 * Cyber Web Audio Synthesizer and Voice Service
 * Real-time synthwave synthesizer and sci-fi audio effects without external asset dependencies
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private timer: number | null = null;
  private step: number = 0;
  private nextStepTime: number = 0;
  private readonly stepDuration: number = 60 / 108 / 4; // 108 BPM sixteenth notes
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.initVoice();
  }

  private initVoice() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const spanishVoices = voices.filter(v => /^es/i.test(v.lang));
        this.voice =
          spanishVoices.find(v =>
            /(sabina|helena|paulina|m[oó]nica|laura|elvira|dalia|salome|female|mujer|google espa)/i.test(v.name)
          ) ||
          spanishVoices[0] ||
          null;
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Create white noise buffer for cyber snares & hi-hats
      const bufferSize = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playBlip(freq = 660, type: OscillatorType = 'square') {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Audio autoplay policy catch
    }
  }

  public playChirp() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.04;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(start);
        osc.stop(start + 0.16);
      });
    } catch {
      // Audio autoplay policy catch
    }
  }

  public playDoorHydraulics() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain || this.isMuted || !this.noiseBuffer) return;

    try {
      const now = ctx.currentTime;
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.6);
      filter.frequency.exponentialRampToValueAtTime(200, now + 1.2);
      filter.Q.value = 3.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 1.35);
    } catch {
      // Audio catch
    }
  }

  public startSynthwave() {
    if (this.isMusicPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    this.step = 0;
    this.nextStepTime = ctx.currentTime + 0.05;

    this.timer = window.setInterval(() => {
      if (!this.isMusicPlaying || !this.ctx) return;
      while (this.nextStepTime < this.ctx.currentTime + 0.25) {
        this.scheduleStep(this.step++, this.nextStepTime);
        this.nextStepTime += this.stepDuration;
      }
    }, 45);
  }

  public stopSynthwave() {
    this.isMusicPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopSynthwave();
      return false;
    } else {
      this.startSynthwave();
      return true;
    }
  }

  public isPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.65, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private scheduleStep(step: number, time: number) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;

    // Chords: Am (A C E), F (F A C), C (C E G), G (G B D)
    const chords = [
      [57, 60, 64], // Am
      [53, 57, 60], // F
      [48, 52, 55], // C
      [55, 59, 62], // G
    ];

    const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
    const bar = Math.floor(step / 16) % 4;
    const stepInBar = step % 16;
    const chord = chords[bar];

    // 1. Synth Bassline (Driving 80s 16th groove)
    if (stepInBar % 2 === 0) {
      const rootNote = chord[0] - 24;
      const bassFreq = midiToFreq(rootNote);
      this.playSynthTone(bassFreq, time, this.stepDuration * 1.8, 'sawtooth', 0.2, 550);
    }

    // 2. Synth Arp / Pluck Melody
    const arpNotes = [0, 1, 2, 1, 0, 2, 1, 2];
    const noteIdx = arpNotes[stepInBar % 8];
    const arpFreq = midiToFreq(chord[noteIdx] + 12);
    this.playSynthTone(arpFreq, time, this.stepDuration * 0.9, 'square', 0.04, 2400);

    // 3. Synth Pad Sweep (Bar start)
    if (stepInBar === 0) {
      chord.forEach(note => {
        this.playSynthTone(midiToFreq(note), time, this.stepDuration * 15, 'sawtooth', 0.03, 1100);
      });
    }

    // 4. Kick drum (every quarter note: 0, 4, 8, 12)
    if (stepInBar % 4 === 0) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();

      kickOsc.frequency.setValueAtTime(140, time);
      kickOsc.frequency.exponentialRampToValueAtTime(38, time + 0.16);

      kickGain.gain.setValueAtTime(0.5, time);
      kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      kickOsc.connect(kickGain);
      kickGain.connect(this.musicGain);

      kickOsc.start(time);
      kickOsc.stop(time + 0.2);
    }

    // 5. Snare drum / Hi-Hat (on steps 4 & 12 for snare, 2, 6, 10, 14 for hi-hat)
    if (this.noiseBuffer) {
      if (stepInBar % 8 === 4) {
        // Cyber Snare
        const snare = this.ctx.createBufferSource();
        snare.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1800;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

        snare.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        snare.start(time);
        snare.stop(time + 0.16);
      } else if (stepInBar % 2 === 1) {
        // Hi-hat
        const hat = this.ctx.createBufferSource();
        hat.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7500;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.05, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

        hat.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        hat.start(time);
        hat.stop(time + 0.05);
      }
    }
  }

  private playSynthTone(
    freq: number,
    time: number,
    duration: number,
    type: OscillatorType,
    vol: number,
    cutoff: number
  ) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.value = freq;
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  public speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CO';
      if (this.voice) {
        utterance.voice = this.voice;
        utterance.lang = this.voice.lang;
      }
      utterance.pitch = 1.35;
      utterance.rate = 0.95;
      utterance.volume = this.isMuted ? 0 : 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      // SpeechSynthesis catch
    }
  }
}

export const soundService = new SoundService();
