/**
 * Audio utility for Kozhitharam Detector™
 *
 * Plays local sound files from /public/sounds/.
 * Gracefully handles missing files — app works without audio.
 * Respects browser autoplay restrictions by requiring user interaction first.
 */

let muted = false;
const cache = {};

const SOUND_FILES = {
  'scan-start': '/sounds/scan-start.mp3',
  'face-detected': '/sounds/face-detected.mp3',
  analysis: '/sounds/analysis.mp3',
  'low-score': '/sounds/low-score.mp3',
  'medium-score': '/sounds/medium-score.mp3',
  'high-score': '/sounds/high-score.mp3',
  'extreme-score': '/sounds/extreme-score.mp3',
};

function getAudio(key) {
  const src = SOUND_FILES[key];
  if (!src) return null;
  if (!cache[key]) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    cache[key] = audio;
  }
  return cache[key];
}

export function playSound(key) {
  if (muted) return;
  try {
    const audio = getAudio(key);
    if (!audio) return;
    audio.currentTime = 0;
    const promise = audio.play();
    if (promise) {
      promise.catch(() => {
        // Autoplay blocked or file missing — silently ignore
      });
    }
  } catch {
    // Never crash the app because of audio
  }
}

export function stopSound(key) {
  try {
    const audio = cache[key];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  } catch {
    // ignore
  }
}

export function setMuted(val) {
  muted = val;
  if (val) {
    Object.values(cache).forEach((a) => {
      try { a.pause(); } catch {}
    });
  }
}

export function isMuted() {
  return muted;
}
