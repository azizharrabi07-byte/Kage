import { Platform } from 'react-native';

type SoundType = 'tick' | 'complete' | 'level_up' | 'set_done' | 'rest_over' | 'button_press' | 'tab_switch' | 'exercise_complete' | 'form_check' | 'rep_counted';

let audioCtx: AudioContext | null = null;
let unlocked = false;

function getCtx(): AudioContext | null {
  if (Platform.OS !== 'web') return null;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        const resume = () => {
          audioCtx?.resume();
          unlocked = true;
          document.removeEventListener('touchstart', resume);
          document.removeEventListener('click', resume);
        };
        document.addEventListener('touchstart', resume);
        document.addEventListener('click', resume);
      } else {
        unlocked = true;
      }
    }
    return audioCtx;
  } catch { return null; }
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.08) {
  const ctx = getCtx();
  if (!ctx || ctx.state === 'suspended') return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(Math.min(volume, 0.15), ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

function playNoise(duration: number, volume = 0.03) {
  const ctx = getCtx();
  if (!ctx || ctx.state === 'suspended') return;
  try {
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * volume;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
  } catch {}
}

export function playSound(type: SoundType) {
  if (Platform.OS !== 'web') return;
  switch (type) {
    case 'tick':
      playTone(800, 0.05, 'square', 0.03);
      break;
    case 'complete':
      playTone(523, 0.1, 'sine', 0.06);
      setTimeout(() => playTone(659, 0.1, 'sine', 0.06), 100);
      setTimeout(() => playTone(784, 0.2, 'sine', 0.06), 200);
      break;
    case 'level_up':
      playTone(392, 0.1, 'triangle', 0.08);
      setTimeout(() => playTone(523, 0.1, 'triangle', 0.08), 120);
      setTimeout(() => playTone(659, 0.1, 'triangle', 0.08), 240);
      setTimeout(() => playTone(784, 0.3, 'triangle', 0.08), 360);
      break;
    case 'set_done':
      playTone(880, 0.08, 'sine', 0.04);
      setTimeout(() => playTone(1100, 0.12, 'sine', 0.04), 80);
      break;
    case 'rest_over':
      playTone(440, 0.15, 'square', 0.06);
      setTimeout(() => playTone(660, 0.15, 'square', 0.06), 150);
      break;
    case 'button_press':
      playTone(600, 0.04, 'sine', 0.04);
      break;
    case 'tab_switch':
      playTone(500, 0.06, 'triangle', 0.03);
      break;
    case 'exercise_complete':
      playTone(660, 0.1, 'sine', 0.05);
      setTimeout(() => playTone(880, 0.15, 'sine', 0.05), 100);
      break;
    case 'form_check':
      playTone(440, 0.08, 'sine', 0.06);
      setTimeout(() => playTone(660, 0.08, 'sine', 0.06), 60);
      break;
    case 'rep_counted':
      playTone(1000, 0.03, 'square', 0.02);
      break;
  }
}
