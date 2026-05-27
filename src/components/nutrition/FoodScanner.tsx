import React, { useRef, useState } from 'react';
import { View, Platform, Pressable } from 'react-native';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { useColors, spacing } from '@/theme';

interface FoodScannerProps {
  onPhoto: (base64: string) => void;
  onClose: () => void;
}

export function FoodScanner({ onPhoto, onClose }: FoodScannerProps) {
  const colors = useColors();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch {
      // Fallback: show file picker
      fileInputRef.current?.click();
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  }

  function capturePhoto() {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const b64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    setPreview(`data:image/jpeg;base64,${b64}`);
    stopCamera();
    onPhoto(b64);
  }

  function handleFileUpload(e: any) {
    const file = e.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = (reader.result as string).split(',')[1];
      setPreview(`data:image/jpeg;base64,${b64}`);
      onPhoto(b64);
    };
    reader.readAsDataURL(file);
  }

  if (Platform.OS !== 'web') {
    return (
      <GlassContainer padding={spacing.md} intensity="light">
        <KageText variant="body" color={colors.text.muted}>Camera requires web platform</KageText>
        <KageButton title="CLOSE" variant="ghost" size="sm" onPress={onClose} />
      </GlassContainer>
    );
  }

  return (
    <GlassContainer intensity="medium" padding={spacing.md} glow="gold">
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
        <KageText variant="bodyBold" color={colors.text.primary} style={{ fontSize: 12, letterSpacing: 1.5 }}>
          📷 Food Scanner
        </KageText>
        <Pressable onPress={() => { stopCamera(); onClose(); }}>
          <KageText variant="mono" color={colors.text.muted} style={{ fontSize: 10 }}>
            ✕ CLOSE
          </KageText>
        </Pressable>
      </View>

      {/* Hidden file input for gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {preview ? (
        <View style={{
          width: '100%', aspectRatio: 4 / 3, borderRadius: 8, overflow: 'hidden',
          backgroundColor: '#000', marginBottom: spacing.sm,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="food" />
        </View>
      ) : cameraOn ? (
        <View style={{
          width: '100%', aspectRatio: 4 / 3, borderRadius: 8, overflow: 'hidden',
          backgroundColor: '#000', marginBottom: spacing.sm,
        }}>
          <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} playsInline muted />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </View>
      ) : (
        <View style={{
          width: '100%', aspectRatio: 4 / 3, borderRadius: 8,
          backgroundColor: colors.glass.light, marginBottom: spacing.sm,
          borderWidth: 1, borderColor: colors.glass.border,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <KageText variant="body" color={colors.text.muted}>Take a photo of your meal</KageText>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {!preview && !cameraOn && (
          <>
            <KageButton title="📷 CAMERA" variant="primary" size="sm" onPress={startCamera} style={{ flex: 1 }} />
            <KageButton title="🖼 GALLERY" variant="ghost" size="sm" onPress={() => fileInputRef.current?.click()} style={{ flex: 1 }} />
          </>
        )}
        {cameraOn && (
          <KageButton title="📸 CAPTURE" variant="primary" size="sm" onPress={capturePhoto} style={{ flex: 1 }} />
        )}
        {preview && (
          <KageButton title="🔄 RETRY" variant="ghost" size="sm" onPress={() => { setPreview(null); }} style={{ flex: 1 }} />
        )}
      </View>
    </GlassContainer>
  );
}
