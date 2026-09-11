/**
 * Kozhitharam Scoring Algorithm™
 *
 * DISCLAIMER: This scoring system is entirely fictional and has
 * absolutely no scientific basis. It exists purely for entertainment.
 * Do not make life decisions based on your Kozhitharam Score.
 */

/**
 * Extract scoring inputs from accumulated face landmark data.
 * @param {Array} frameHistory - Array of landmark snapshots collected over ~3s
 * @returns {Object} raw metric values 0–1
 */
export function extractMetrics(frameHistory) {
  if (!frameHistory || frameHistory.length === 0) {
    return getRandomMetrics();
  }

  try {
    // Average across frames for stability
    const avg = (key) => {
      const vals = frameHistory.map((f) => f[key]).filter((v) => v != null);
      if (!vals.length) return 0.5;
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    };

    const mouthOpenness = avg('mouthOpenness');
    const eyeOpenness = avg('eyeOpenness');
    const eyebrowRaise = avg('eyebrowRaise');
    const headTilt = avg('headTilt');
    const smileScore = avg('smileScore');

    // Head movement = variance in head position
    const positions = frameHistory.map((f) => f.headX || 0.5);
    const meanPos = positions.reduce((a, b) => a + b, 0) / positions.length;
    const variance =
      positions.reduce((a, b) => a + (b - meanPos) ** 2, 0) / positions.length;
    const headMovement = Math.min(variance * 50, 1);

    return {
      smileScore: clamp(mouthOpenness * 0.4 + smileScore * 0.6),
      eyeActivity: clamp(eyeOpenness * 0.7 + headMovement * 0.3),
      headMovement: clamp(headMovement * 1.5),
      eyebrowActivity: clamp(eyebrowRaise),
      suspiciousness: clamp(headTilt * 0.5 + headMovement * 0.3 + (1 - eyeOpenness) * 0.2),
      kozhiVibes: clamp(smileScore * 0.4 + mouthOpenness * 0.3 + eyebrowRaise * 0.3),
    };
  } catch {
    return getRandomMetrics();
  }
}

function getRandomMetrics() {
  return {
    smileScore: rand(0.3, 0.9),
    eyeActivity: rand(0.3, 0.9),
    headMovement: rand(0.2, 0.8),
    eyebrowActivity: rand(0.2, 0.85),
    suspiciousness: rand(0.25, 0.9),
    kozhiVibes: rand(0.3, 0.95),
  };
}

/**
 * Compute the final Kozhitharam Score from metrics.
 * Weights sum to 1.0.
 */
const WEIGHTS = {
  smileScore: 0.20,
  eyeActivity: 0.15,
  headMovement: 0.15,
  eyebrowActivity: 0.10,
  suspiciousness: 0.15,
  kozhiVibes: 0.25,
};

export function computeKozhitharamScore(metrics) {
  let weighted = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    weighted += (metrics[key] || 0) * weight;
  }

  // Small controlled random factor ±5%
  const jitter = (Math.random() - 0.5) * 0.1;
  const score = clamp(weighted + jitter);

  return {
    total: Math.round(score * 1000) / 10, // e.g. 87.6
    breakdown: {
      'Suspicious Smile': Math.round((metrics.smileScore || 0) * 100),
      'Eye Activity': Math.round((metrics.eyeActivity || 0) * 100),
      'Head Movement': Math.round((metrics.headMovement || 0) * 100),
      'Eyebrow Activity': Math.round((metrics.eyebrowActivity || 0) * 100),
      Suspiciousness: Math.round((metrics.suspiciousness || 0) * 100),
      'Kozhi Vibes™': Math.round((metrics.kozhiVibes || 0) * 100),
    },
  };
}

// Helpers
function clamp(v, min = 0, max = 1) {
  return Math.min(Math.max(v, min), max);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
