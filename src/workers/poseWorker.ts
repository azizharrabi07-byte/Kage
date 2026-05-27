const POSE_LANDMARKER_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task';

const MP_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/vision_bundle.mjs';

let poseLandmarker: any = null;
let lastTime = -1;

async function init() {
  const { PoseLandmarker, FilesetResolver } = await import(/* webpackIgnore: true */ MP_CDN);
  const vision = await FilesetResolver.forVisionTasks(POSE_LANDMARKER_URL);
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: MODEL_URL,
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numPoses: 1,
    minPoseDetectionConfidence: 0.5,
    minPosePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  return 'ready';
}

function detect(video: HTMLVideoElement, timestamp: number) {
  if (!poseLandmarker || timestamp === lastTime) return null;
  lastTime = timestamp;
  const result = poseLandmarker.detectForVideo(video, timestamp);
  if (!result.landmarks || result.landmarks.length === 0) return null;
  const landmarks = result.landmarks[0];
  return {
    landmarks: landmarks.map((lm: any) => ({ x: lm.x, y: lm.y, z: lm.z, visibility: lm.visibility })),
    score: result.landmarks.length > 0 ? 1 : 0,
  };
}

self.onmessage = async (e: MessageEvent) => {
  const { type, data, timestamp } = e.data;
  switch (type) {
    case 'init':
      try {
        const status = await init();
        self.postMessage({ type: 'ready', status });
      } catch (err: any) {
        self.postMessage({ type: 'error', error: err.message });
      }
      break;
    case 'detect':
      try {
        const result = detect(data?.video, timestamp);
        if (result) self.postMessage({ type: 'landmarks', data: result, timestamp });
      } catch (err: any) {
        self.postMessage({ type: 'error', error: err.message });
      }
      break;
    case 'close':
      if (poseLandmarker) {
        poseLandmarker.close();
        poseLandmarker = null;
      }
      break;
  }
};