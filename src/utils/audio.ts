/**
 * Web Audio API based Synthesizer
 * Generates pleasant retro/casual game sound effects without external audio files.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playSuccessSound(enabled: boolean = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (cheerful chime)

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0.001, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.26);
  });
}

export function playLevelUpFanfare(enabled: boolean = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Majestic fanfare: C5, E5, G5, G5, A5, B5, C6
  const melody = [
    { freq: 523.25, start: 0.0, dur: 0.12 },
    { freq: 659.25, start: 0.12, dur: 0.12 },
    { freq: 783.99, start: 0.24, dur: 0.12 },
    { freq: 1046.5, start: 0.36, dur: 0.35 },
    { freq: 880.0,  start: 0.72, dur: 0.15 },
    { freq: 1046.5, start: 0.88, dur: 0.5 },
  ];

  melody.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, now + note.start);

    gain.gain.setValueAtTime(0.001, now + note.start);
    gain.gain.exponentialRampToValueAtTime(0.22, now + note.start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.start + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + note.start);
    osc.stop(now + note.start + note.dur + 0.05);
  });
}

export function playQuizCorrectSound(enabled: boolean = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [659.25, 880.0]; // E5, A5 bright high ping

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.1);

    gain.gain.setValueAtTime(0.001, now + idx * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.1 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.1);
    osc.stop(now + idx * 0.1 + 0.32);
  });
}

export function playQuizWrongSound(enabled: boolean = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, now); // A3 low pitch
  osc.frequency.exponentialRampToValueAtTime(160, now + 0.25);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.3);
}

export function playTapSound(enabled: boolean = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.06);
}
