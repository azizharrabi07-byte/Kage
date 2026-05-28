import React, { useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { KageText } from '@/components/ui/KageText';
import { useColors, spacing } from '@/theme';
import { getFormChecks } from '@/constants/formChecks';

interface VideoRecorderProps {
  exerciseName: string;
  onFrame: (base64: string) => void;
  onAnalysis: (text: string) => void;
  programStyle?: string;
}

export function VideoRecorder({ exerciseName, onFrame, onAnalysis, programStyle }: VideoRecorderProps) {
  const colors = useColors();
  const [mode, setMode] = useState<'idle' | 'recording' | 'uploading' | 'analyzing'>('idle');
  const [feedback, setFeedback] = useState('');
  const [countdown, setCountdown] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  function startRecording() {
    setMode('recording');
    navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 400, facingMode: 'environment' } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        chunksRef.current = [];
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
        recorderRef.current = recorder;
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        recorder.onstop = () => processRecording();
        recorder.start();
        setCountdown(5);
        const interval = setInterval(() => {
          setCountdown((c) => {
            if (c <= 1) { clearInterval(interval); recorder.stop(); return 0; }
            return c - 1;
          });
        }, 1000);
      })
      .catch(() => {
        setMode('idle');
      });
  }

  function processRecording() {
    if (chunksRef.current.length === 0) { setMode('idle'); return; }
    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    extractFrame(blob);
  }

  function handleUpload() {
    setMode('uploading');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4,video/webm,video/quicktime';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) extractFrame(file);
    };
    input.click();
  }

  function extractFrame(videoFile: Blob) {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.src = URL.createObjectURL(videoFile);
    video.onloadeddata = () => {
      video.currentTime = Math.min(video.duration * 0.3, 1);
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setMode('idle'); return; }
        ctx.drawImage(video, 0, 0, 320, 400);
        const base64 = canvas.toDataURL('image/jpeg', 0.7);
        canvasRef.current = canvas;
        URL.revokeObjectURL(video.src);
        onFrame(base64);
        analyzeFrame(base64);
      };
    };
  }

  async function analyzeFrame(base64: string) {
    setMode('analyzing');
    setFeedback('');
    try {
      // NOTE: Full vision-based form analysis from static video is not available in this build
      // (requires vision LLM + backend). Use the live Pose Analyzer during sets for real-time
      // MediaPipe pose tracking, rep counting, and Sensei coaching.
      const checks = getFormChecks(exerciseName);
      const tips = checks.slice(0, 3).map(c => c.cue || c.question).join(' • ');
      const fallback = `Frame captured. For best results use live camera analysis. Key cues: ${tips || 'Control the movement. Brace core. Full ROM.'}`;
      setFeedback(fallback);
      onAnalysis(fallback);
    } catch {
      setFeedback('Analysis unavailable. Rely on live Pose Analyzer for form feedback.');
    }
    setMode('idle');
  }

  function cancelRecording() {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
    }
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setMode('idle');
  }

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={{ marginBottom: 12 }}>
      <GlassContainer padding={spacing.md} intensity="heavy" style={{ borderRadius: 10 }}>
        <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: 7.5, textTransform: 'uppercase', marginBottom: 8 }}>
          🎥 Form Analysis
        </KageText>

        {mode === 'recording' && (
          <View style={{ gap: 8, alignItems: 'center' }}>
            <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', maxHeight: 200, borderRadius: 8, backgroundColor: '#000' }} />
            <KageText variant="bodyBold" color={colors.accent.neon} style={{ fontSize: 24 }}>{countdown}</KageText>
            <View onTouchEnd={cancelRecording} style={{ paddingVertical: 6, paddingHorizontal: 16, borderRadius: 6, backgroundColor: colors.status.danger }}>
              <KageText variant="bodyBold" style={{ fontSize: 10, letterSpacing: 1, color: '#FFF' }}>CANCEL</KageText>
            </View>
          </View>
        )}

        {mode === 'analyzing' && (
          <View style={{ alignItems: 'center', paddingVertical: 12, gap: 6 }}>
            <KageText variant="body" color={colors.accent.gold} style={{ fontSize: 12 }}>Analyzing form...</KageText>
            <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 9 }}>Sensei is watching</KageText>
          </View>
        )}

        {mode === 'idle' && !feedback && (
          <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
            <View onTouchEnd={startRecording} style={{
              flex: 1, paddingVertical: 10, borderRadius: 8,
              backgroundColor: colors.accent.primary, alignItems: 'center',
            }}>
              <KageText variant="bodyBold" style={{ fontSize: 10, letterSpacing: 1, color: '#FFF' }}>🎥 Record (10s)</KageText>
            </View>
            <View onTouchEnd={handleUpload} style={{
              flex: 1, paddingVertical: 10, borderRadius: 8,
              backgroundColor: colors.glass.medium, borderWidth: 1, borderColor: colors.glass.border, alignItems: 'center',
            }}>
              <KageText variant="bodyBold" style={{ fontSize: 10, letterSpacing: 1, color: colors.text.secondary }}>📁 Upload</KageText>
            </View>
          </View>
        )}

        {mode === 'uploading' && (
          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <KageText variant="body" color={colors.text.muted} style={{ fontSize: 12 }}>Select a video file...</KageText>
          </View>
        )}

        {feedback && (
          <View style={{
            marginTop: 8, padding: 10, borderRadius: 8,
            backgroundColor: colors.glass.light, borderWidth: 1, borderColor: colors.glass.border,
          }}>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
              <KageText variant="kanji" style={{ fontSize: 16, color: colors.accent.neon }}>先</KageText>
              <KageText variant="body" style={{ fontSize: 11, color: colors.text.secondary, flex: 1, fontStyle: 'italic', lineHeight: 16 }}>
                "{feedback}"
              </KageText>
            </View>
          </View>
        )}
      </GlassContainer>
    </Animated.View>
  );
}
