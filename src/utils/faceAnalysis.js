/**
 * Face analysis utility using MediaPipe Face Landmarker.
 *
 * Extracts simple geometric metrics from face landmarks.
 * No face recognition or identity inference is performed.
 * All processing is local — no data is uploaded or stored.
 */

let faceLandmarker = null;
let lastVideoTime = -1;

// MediaPipe landmark indices (478-point face mesh)
const LANDMARKS = {
  // Mouth corners
  MOUTH_LEFT: 61,
  MOUTH_RIGHT: 291,
  MOUTH_TOP: 13,
  MOUTH_BOTTOM: 14,

  // Eyes
  LEFT_EYE_TOP: 159,
  LEFT_EYE_BOTTOM: 145,
  RIGHT_EYE_TOP: 386,
  RIGHT_EYE_BOTTOM: 374,

  // Eyebrows
  LEFT_EYEBROW_TOP: 70,
  LEFT_EYE_INNER: 133,
  RIGHT_EYEBROW_TOP: 300,
  RIGHT_EYE_INNER: 362,

  // Nose tip
  NOSE_TIP: 4,

  // Face outline
  CHIN: 152,
  FOREHEAD: 10,
  FACE_LEFT: 234,
  FACE_RIGHT: 454,
};

export async function initFaceLandmarker() {
  const { FaceLandmarker, FilesetResolver } = await import(
    '@mediapipe/tasks-vision'
  );

  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
      delegate: 'GPU',
    },
    outputFaceBlendshapes: true,
    runningMode: 'VIDEO',
    numFaces: 2,
  });

  return faceLandmarker;
}

export function detectFaces(videoElement) {
  if (!faceLandmarker || !videoElement) return null;

  const nowMs = performance.now();
  if (videoElement.currentTime === lastVideoTime) return null;
  lastVideoTime = videoElement.currentTime;

  try {
    return faceLandmarker.detectForVideo(videoElement, nowMs);
  } catch {
    return null;
  }
}

/**
 * Extract a single frame's metrics from landmarks.
 * Returns values in range [0, 1].
 */
export function extractFrameMetrics(landmarks, blendshapes) {
  if (!landmarks || landmarks.length === 0) return null;

  const lm = landmarks[0]; // first face only

  const dist = (a, b) => {
    const dx = lm[a].x - lm[b].x;
    const dy = lm[a].y - lm[b].y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Face height for normalization
  const faceHeight = dist(LANDMARKS.FOREHEAD, LANDMARKS.CHIN) || 0.3;

  // Mouth openness (vertical gap / face height)
  const mouthOpenness = dist(LANDMARKS.MOUTH_TOP, LANDMARKS.MOUTH_BOTTOM) / faceHeight;

  // Eye openness (avg of both eyes)
  const leftEyeOpen = dist(LANDMARKS.LEFT_EYE_TOP, LANDMARKS.LEFT_EYE_BOTTOM) / faceHeight;
  const rightEyeOpen = dist(LANDMARKS.RIGHT_EYE_TOP, LANDMARKS.RIGHT_EYE_BOTTOM) / faceHeight;
  const eyeOpenness = (leftEyeOpen + rightEyeOpen) / 2;

  // Eyebrow raise (eyebrow to inner eye corner distance)
  const leftBrowRaise = dist(LANDMARKS.LEFT_EYEBROW_TOP, LANDMARKS.LEFT_EYE_INNER) / faceHeight;
  const rightBrowRaise = dist(LANDMARKS.RIGHT_EYEBROW_TOP, LANDMARKS.RIGHT_EYE_INNER) / faceHeight;
  const eyebrowRaise = (leftBrowRaise + rightBrowRaise) / 2;

  // Head tilt: difference between left/right face edges Y
  const headTilt = Math.abs(lm[LANDMARKS.FACE_LEFT].y - lm[LANDMARKS.FACE_RIGHT].y);

  // Head X position (normalized 0–1)
  const headX = lm[LANDMARKS.NOSE_TIP].x;

  // Smile: use blendshape if available, else approximate from mouth width
  let smileScore = 0;
  if (blendshapes && blendshapes.length > 0) {
    const shapes = blendshapes[0].categories || [];
    const leftSmile = shapes.find((s) => s.categoryName === 'mouthSmileLeft')?.score || 0;
    const rightSmile = shapes.find((s) => s.categoryName === 'mouthSmileRight')?.score || 0;
    smileScore = (leftSmile + rightSmile) / 2;
  } else {
    const mouthWidth = dist(LANDMARKS.MOUTH_LEFT, LANDMARKS.MOUTH_RIGHT) / faceHeight;
    smileScore = Math.min(mouthWidth * 0.8, 1);
  }

  return {
    mouthOpenness: Math.min(mouthOpenness * 5, 1),
    eyeOpenness: Math.min(eyeOpenness * 8, 1),
    eyebrowRaise: Math.min(eyebrowRaise * 3, 1),
    headTilt: Math.min(headTilt * 5, 1),
    headX,
    smileScore,
  };
}

export function getFaceLandmarker() {
  return faceLandmarker;
}
