import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Platform, Pressable } from 'react-native';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { useColors, spacing } from '@/theme';
import { checkAngles, type AngleResult } from '@/constants/poseAngles';
import { createRepCounter } from '@/utils/repCounter';
import { playSound } from '@/utils/sound';
import { callSenseiAI } from '@/utils/gemini';
import { saveMovementInsight } from '@/store/movementIntelligence';

interface PoseAnalyzerProps {
  exerciseName: string;
  onClose: () => void;
  onFeedback?: (feedback: string) => void;
  autoFeedbackInterval?: number;
}

let mpModule: any = null;
let mpLoading = false;
let mpCallbacks: Array<() => void> = [];

async function loadMediaPipe(): Promise<void> {
  if (mpModule) return;
  if (mpLoading) return new Promise(r => mpCallbacks.push(r));
  mpLoading = true;
  try {
    const w = window as any;
    if (w.__MP) {
      mpModule = w.__MP;
    } else {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.textContent = `
          import * as MP from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/vision_bundle.mjs';
          window.__MP = MP;
          window.dispatchEvent(new CustomEvent('mp-loaded'));
        `;
        script.onerror = () => reject(new Error('Failed to load MediaPipe script'));
        document.head.appendChild(script);
        const timeout = setTimeout(() => reject(new Error('MediaPipe load timeout')), 30000);
        window.addEventListener('mp-loaded', () => { clearTimeout(timeout); resolve(); }, { once: true });
      });
      mpModule = w.__MP;
    }
    mpCallbacks.forEach(c => c());
    mpCallbacks = [];
  } catch (e) {
    mpCallbacks.forEach(c => c());
    mpCallbacks = [];
    throw e;
  } finally {
    mpLoading = false;
  }
}

const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
  [9, 10], [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
  [11, 23], [12, 24], [23, 24], [23, 25], [24, 26], [25, 27],
  [26, 28], [27, 29], [28, 30], [27, 31], [28, 32], [23, 11], [24, 12],
];

export function PoseAnalyzer({ exerciseName, onClose, onFeedback, autoFeedbackInterval = 5 }: PoseAnalyzerProps) {
  const colors = useColors();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const repCtrl = useRef<ReturnType<typeof createRepCounter> | null>(null);
  const plRef = useRef<any>(null);
  const animRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const lastTsRef = useRef(-1);
  const repBatchRef = useRef(0);
  const [status, setStatus] = useState<'init' | 'loading' | 'ready' | 'error'>('init');
  const [errMsg, setErrMsg] = useState('');
  const [angles, setAngles] = useState<AngleResult[]>([]);
  const [repCount, setRepCount] = useState(0);
  const [formScore, setFormScore] = useState(1);
  const [camOn, setCamOn] = useState(false);
  const [fb, setFb] = useState<string[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [deepReviewLoading, setDeepReviewLoading] = useState(false);
  const facingRef = useRef<'user' | 'environment'>('environment');

  useEffect(() => {
    repCtrl.current = createRepCounter(exerciseName);
    return () => {
      cancelAnimationFrame(animRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  useEffect(() => {
    facingRef.current = facingMode;
  }, [facingMode]);

  async function initMediaPipe() {
    setStatus('loading');
    try {
      await loadMediaPipe();
      const { PoseLandmarker, FilesetResolver } = mpModule;
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
      );
      plRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      setStatus('ready');
    } catch (e: any) {
      setErrMsg(e.message || 'Failed to load MediaPipe model');
      setStatus('error');
    }
  }

  async function startCamera() {
    try {
      const mode = facingRef.current;
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: mode },
      });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      setCamOn(true);
      animRef.current = requestAnimationFrame(detectLoop);
    } catch (e: any) {
      setErrMsg(e.message || 'Camera access denied');
      setStatus('error');
    }
  }

  function detectLoop(ts: number) {
    const pl = plRef.current;
    const v = videoRef.current;
    if (pl && v && v.readyState >= 2 && ts !== lastTsRef.current) {
      lastTsRef.current = ts;
      const r = pl.detectForVideo(v, ts);
      if (r.landmarks?.length > 0) processLandmarks(r.landmarks[0]);
    }
    animRef.current = requestAnimationFrame(detectLoop);
  }

  function processLandmarks(lms: any[]) {
    drawSkel(lms);
    const res = checkAngles(exerciseName, lms);
    if (res.length > 0) setAngles(res);
    const c = repCtrl.current?.update(lms, Date.now()) ?? 0;
    if (c !== repCount) {
      setRepCount(c);
      playSound('rep_counted');
      repBatchRef.current++;
      if (repBatchRef.current % autoFeedbackInterval === 0) {
        reqAI(res, c);
      }
    }
    const ok = res.filter(a => a.inRange).length;
    if (res.length > 0) setFormScore(ok / res.length);
  }

  function drawSkel(lms: any[]) {
    const cvs = canvasRef.current;
    const v = videoRef.current;
    if (!cvs || !v) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const w = v.videoWidth || 640;
    const h = v.videoHeight || 480;
    cvs.width = w;
    cvs.height = h;
    ctx.clearRect(0, 0, w, h);
    for (const [i, j] of CONNECTIONS) {
      const a = lms[i], b = lms[j];
      if (!a || !b) continue;
      ctx.strokeStyle = '#00CC88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(a.x * w, a.y * h);
      ctx.lineTo(b.x * w, b.y * h);
      ctx.stroke();
    }
    for (const lm of lms) {
      ctx.fillStyle = '#C9A84C';
      ctx.beginPath();
      ctx.arc(lm.x * w, lm.y * h, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  async function reqAI(a: AngleResult[], rc: number) {
    try {
      // Rich data for real LLM reasoning (not simple if/else)
      const angleDetails = a.map(x => {
        const deviation = x.inRange ? 'within optimal' : 'outside optimal range';
        return `- ${x.name}: ${x.angle}° (${deviation}) — priority: ${x.priority}`;
      }).join('\n');

      // Track recent trend (last 3 feedbacks)
      const recentContext = fb.slice(-3).join(' | ');

      const system = `You are Sensei — a world-class movement specialist and former high-level coach.
You are given precise joint angle measurements from computer vision during live exercise.
Your job is to act as an expert analyst: compare the actual numbers to ideal biomechanical ranges for that specific exercise.
You must give ONE highly specific, technical, and immediately actionable cue. 
Speak like a real demanding coach — concise, direct, no fluff, no greetings. Max 14 words.`;

      const prompt = `Exercise: ${exerciseName}
Rep: ${rc}
Current joint measurements:
${angleDetails}

Recent previous feedback this set: ${recentContext || 'None yet'}

As an expert, what is the single highest-leverage correction this athlete needs right now based purely on the angle data?`;

      const reply = await callSenseiAI(system, prompt);
      if (reply) {
        setFb(p => [...p.slice(-9), reply]);
        onFeedback?.(reply);

        // Save to Movement Intelligence (high priority feature)
        const issues = [reply]; // Treat feedback as the main issue for now
        const strengths = a.filter(x => x.inRange).map(x => `${x.name} good`);
        await saveMovementInsight(exerciseName, issues, strengths);
      }
    } catch {}
  }

  async function manualFB() {
    if (angles.length === 0) return;
    repBatchRef.current = 0;
    await reqAI(angles, repCount);
  }

  function stopCam() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    cancelAnimationFrame(animRef.current);
    setCamOn(false);
  }

  function flipCamera() {
    const next = facingMode === 'user' ? 'environment' : 'user';
    const wasOn = camOn;
    if (wasOn) stopCam();
    setFacingMode(next);
    if (wasOn) {
      setTimeout(() => startCamera(), 450);
    }
  }

  const pc: Record<string, string> = { critical: '#C8102E', important: '#D4A030', refinement: '#3B82F6' };

  // Simple ideal range lookup for display (you can expand this)
  function getIdealRange(jointName: string): string {
    const map: Record<string, string> = {
      'Elbow': '80-175°',
      'Shoulder': '60-100°',
      'Knee': '80-130°',
      'Hip': '50-120°',
      'Back': '160-185°',
      'Wrist': '150-190°',
    };
    return map[jointName] || 'optimal';
  }

  return (
    <GlassContainer intensity="heavy" glow="red" padding={spacing.md}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
        <KageText variant="bodyBold" color={colors.text.primary} style={{ fontSize: 14, letterSpacing: 2 }}>
          {exerciseName} ANALYZER
        </KageText>
        <Pressable onPress={() => { stopCam(); onClose(); }}>
          <KageText variant="mono" color={colors.text.muted} style={{ fontSize: 10 }}>✕ CLOSE</KageText>
        </Pressable>
      </View>

      {status === 'init' && (
        <KageButton title="LOAD POSE DETECTOR" variant="primary" size="sm" fullWidth onPress={initMediaPipe} />
      )}
      {status === 'loading' && (
        <View style={{ padding: spacing.xl, alignItems: 'center' }}>
          <KageText variant="body" color={colors.text.secondary}>Loading pose model (~10MB)...</KageText>
        </View>
      )}
      {status === 'error' && (
        <View style={{ padding: spacing.xl, alignItems: 'center' }}>
          <KageText variant="body" color={colors.status.danger}>{errMsg}</KageText>
          <KageButton title="RETRY" variant="ghost" size="sm" onPress={initMediaPipe} style={{ marginTop: 8 }} />
        </View>
      )}

      {status === 'ready' && (
        <>
          {/* Desktop: Two-column layout | Mobile: Stacked */}
          <View style={{
            flexDirection: Platform.OS === 'web' ? 'row' : 'column',
            gap: Platform.OS === 'web' ? 16 : 0,
            marginBottom: spacing.md,
          }}>
            
            {/* Left column: Video + Controls (bigger on desktop) */}
            <View style={{ 
              flex: Platform.OS === 'web' ? 1.1 : 1,
              minWidth: Platform.OS === 'web' ? 420 : undefined 
            }}>
              <View style={{
                position: 'relative', 
                width: '100%', 
                aspectRatio: Platform.OS === 'web' ? 16 / 10 : 4 / 3,
                maxHeight: Platform.OS === 'web' ? 480 : 320,
                borderRadius: 12, 
                overflow: 'hidden', 
                backgroundColor: '#000',
                borderWidth: 1, 
                borderColor: colors.glass.border,
                boxShadow: Platform.OS === 'web' ? '0 8px 30px rgba(0,0,0,0.35)' : undefined,
              }}>
                <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', display: camOn ? 'block' : 'none' }} playsInline muted />
                <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: camOn ? 'block' : 'none' }} />
                {!camOn && (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <KageText variant="body" color={colors.text.muted}>Camera off</KageText>
                    <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 9, marginTop: 4 }}>Grant camera permission when prompted</KageText>
                  </View>
                )}
              </View>

              {/* Camera controls */}
              <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
                {camOn ? (
                  <KageButton title="STOP" variant="ghost" size="sm" onPress={stopCam} style={{ flex: 1 }} />
                ) : (
                  <KageButton title="START CAMERA" variant="primary" size="sm" onPress={startCamera} style={{ flex: 1 }} />
                )}
                <KageButton title={`SWITCH TO ${facingMode === 'user' ? 'REAR' : 'FRONT'}`} variant="gold" size="sm" onPress={flipCamera} style={{ flex: 1 }} />
              </View>
            </View>

            {/* Right column on desktop: Live Data + Feedback */}
            {Platform.OS === 'web' && (
              <View style={{ flex: 1, minWidth: 280 }}>
                {/* Reps + Form score */}
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                  <View style={{ flex: 1, padding: 10, borderRadius: 10, backgroundColor: colors.glass.light, borderWidth: 1, borderColor: colors.glass.borderLight, alignItems: 'center' }}>
                    <KageText variant="mono" color={colors.accent.primary} style={{ fontSize: 26 }}>{repCount}</KageText>
                    <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 9 }}>REPS</KageText>
                  </View>
                  <View style={{ flex: 1, padding: 10, borderRadius: 10, backgroundColor: colors.glass.light, borderWidth: 1, borderColor: colors.glass.borderLight, alignItems: 'center' }}>
                    <KageText variant="mono" color={formScore >= 0.8 ? colors.status.ready : formScore >= 0.5 ? colors.status.warning : colors.status.danger} style={{ fontSize: 26 }}>
                      {Math.round(formScore * 100)}%
                    </KageText>
                    <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 9 }}>FORM</KageText>
                  </View>
                </View>

                {/* Angle breakdown (condensed for sidebar) */}
                <View style={{ marginBottom: 8 }}>
                  <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 8, letterSpacing: 1, marginBottom: 4 }}>LIVE ANGLES</KageText>
                  <ScrollView style={{ maxHeight: 160 }} showsVerticalScrollIndicator={false}>
                    {angles.map((a, i) => (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 3, paddingHorizontal: 6, marginBottom: 2, borderRadius: 4, backgroundColor: a.inRange ? 'rgba(0,204,136,0.08)' : 'rgba(200,16,46,0.08)' }}>
                        <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: a.inRange ? colors.status.ready : colors.status.danger }} />
                        <KageText variant="body" style={{ fontSize: 10, color: colors.text.secondary, flex: 1 }}>{a.name}</KageText>
                        <KageText variant="mono" style={{ fontSize: 10, color: a.inRange ? colors.status.ready : colors.status.danger }}>{a.angle}°</KageText>
                        <KageText variant="caption" style={{ fontSize: 8, color: colors.text.muted }}>ideal ~{getIdealRange(a.name)}</KageText>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>

          {/* Mobile-only stacked data (desktop already has sidebar) */}
          {Platform.OS !== 'web' && (
            <>
              <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
                <View style={{ flex: 1, padding: spacing.sm, borderRadius: 8, backgroundColor: colors.glass.light, borderWidth: 1, borderColor: colors.glass.borderLight, alignItems: 'center' }}>
                  <KageText variant="mono" color={colors.accent.primary} style={{ fontSize: 26 }}>{repCount}</KageText>
                  <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 8 }}>REPS</KageText>
                </View>
                <View style={{ flex: 1, padding: spacing.sm, borderRadius: 8, backgroundColor: colors.glass.light, borderWidth: 1, borderColor: colors.glass.borderLight, alignItems: 'center' }}>
                  <KageText variant="mono" color={formScore >= 0.8 ? colors.status.ready : formScore >= 0.5 ? colors.status.warning : colors.status.danger} style={{ fontSize: 26 }}>
                    {Math.round(formScore * 100)}%
                  </KageText>
                  <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 8 }}>FORM</KageText>
                </View>
              </View>

              <ScrollView style={{ maxHeight: 120 }} showsVerticalScrollIndicator={false}>
                {angles.map((a, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 3, paddingHorizontal: spacing.sm, marginBottom: 2, borderRadius: 4, backgroundColor: a.inRange ? 'rgba(0,204,136,0.08)' : 'rgba(200,16,46,0.08)' }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: a.inRange ? colors.status.ready : colors.status.danger }} />
                    <KageText variant="body" style={{ fontSize: 10, color: colors.text.secondary, width: 55 }}>{a.name}</KageText>
                    <KageText variant="mono" style={{ fontSize: 10, width: 45, color: a.inRange ? colors.status.ready : colors.status.danger }}>{a.angle}°</KageText>
                    <KageText variant="caption" style={{ fontSize: 8, color: colors.text.muted, flex: 1 }}>{a.cue}</KageText>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* Feedback + Deep Review (shared) */}
          {fb.length > 0 && (
            <View style={{ marginTop: spacing.sm, gap: 4 }}>
              <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 8, letterSpacing: 1.5 }}>SENSEI FEEDBACK</KageText>
              <ScrollView style={{ maxHeight: Platform.OS === 'web' ? 110 : 70 }} showsVerticalScrollIndicator={false}>
                {fb.map((f, i) => (
                  <KageText 
                    key={i} 
                    variant="body" 
                    style={{ 
                      fontSize: Platform.OS === 'web' ? 11 : 9, 
                      color: colors.text.secondary, 
                      lineHeight: 15, 
                      paddingVertical: 4, 
                      paddingHorizontal: spacing.sm, 
                      backgroundColor: colors.glass.light, 
                      borderRadius: 6, 
                      marginBottom: 3 
                    }}
                  >
                    • {f}
                  </KageText>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Deep Manual Review Button - Fixed & Improved */}
          {angles.length > 0 && (
            <View style={{ marginTop: spacing.sm }}>
              <View 
                onTouchEnd={async () => {
                  if (angles.length === 0 || deepReviewLoading) return;
                  setDeepReviewLoading(true);
                  try {
                    const richPrompt = `Exercise: ${exerciseName}\nReps completed: ${repCount}\n\nDetailed joint analysis:\n${angles.map(x => `${x.name}: ${x.angle}° (${x.inRange ? 'good' : 'needs work'})`).join('\n')}\n\nProvide a deep, expert-level form breakdown. Identify the root cause if possible and give 2-3 prioritized corrections with clear reasoning.`;
                    
                    const deepReply = await callSenseiAI(
                      'You are a highly analytical movement coach. Give a thoughtful, structured mini-report. Use precise language. Structure: Observation → Likely Cause → Priority Corrections.',
                      richPrompt
                    );
                    if (deepReply) {
                      setFb(p => [...p, `【DEEP REVIEW】 ${deepReply}`]);
                      
                      // Save deep review insight for long-term intelligence
                      const issues = [deepReply];
                      const strengths = angles.filter(x => x.inRange).map(x => `${x.name} strong`);
                      await saveMovementInsight(exerciseName, issues, strengths, deepReply);
                    } else {
                      setFb(p => [...p, `【DEEP REVIEW】 The network is quiet. Try again in a moment, warrior.`]);
                    }
                  } catch {
                    setFb(p => [...p, `【DEEP REVIEW】 Something blocked the path. Breathe and try once more.`]);
                  } finally {
                    setDeepReviewLoading(false);
                  }
                }}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 10,
                  backgroundColor: deepReviewLoading ? colors.glass.border : colors.glass.medium,
                  borderWidth: 1,
                  borderColor: colors.accent.gold,
                  alignItems: 'center',
                  opacity: deepReviewLoading ? 0.6 : 1,
                }}
              >
                <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 10, letterSpacing: 1 }}>
                  {deepReviewLoading ? "SENSEI IS ANALYZING DEEPLY..." : "✧ DEEP SENSEI REVIEW (Current Frame)"}
                </KageText>
              </View>
            </View>
          )}

          {/* Video Upload for Deeper Analysis (Premium Feature) */}
          <View style={{ marginTop: spacing.sm }}>
            <View 
              onTouchEnd={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'video/*';
                input.onchange = async () => {
                  const file = input.files?.[0];
                  if (file) {
                    setFb(p => [...p, `【VIDEO UPLOADED】 Thank you. A deep analysis of this video will be processed by Sensei soon. For now, describe any specific concerns you noticed.`]);
                  }
                };
                input.click();
              }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor: colors.glass.light,
                borderWidth: 1,
                borderColor: colors.accent.primary,
                alignItems: 'center',
              }}
            >
              <KageText variant="caption" color={colors.accent.primary} style={{ fontSize: 9, letterSpacing: 1 }}>
                📹 UPLOAD VIDEO FOR DEEPER ANALYSIS
              </KageText>
            </View>
          </View>
        </>
      )}
    </GlassContainer>
  );
}
