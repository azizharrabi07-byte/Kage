import React, { useState } from 'react';
import { View, Modal, Image, ActivityIndicator, Platform } from 'react-native';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { useColors, spacing } from '@/theme';

interface ExerciseDemoModalProps {
  visible: boolean;
  exerciseName: string;
  onClose: () => void;
  source?: any; // Can be a require() result or a remote URI string
}

// Helper to get the correct web path for local photos (fallback only)
function getWebImageSrc(exerciseName: string): string {
  const map: Record<string, string> = {
    'Iron Squat': '/assets/gifs/Iron Squat.gif',
    'Steel Deadlift': '/assets/gifs/steel deadlift (2).gif',
    'Shadow Push': '/assets/gifs/shadow push.gif',
    'Samurai Row': '/assets/gifs/Samurai Row.gif',
    'Ronin Lunge': '/assets/gifs/Ronin Lunge.gif',
    'Warrior Pull-up': '/assets/gifs/Warrior Pull-up.gif',
    'Crimson Press': '/assets/gifs/Crimson Press .gif',
    'Blade Curl': '/assets/gifs/Blade Curl  .gif',
    'Dojo Dip': '/assets/gifs/Dojo Dip .gif',
    'Dragon Squat': '/assets/gifs/Dragon Squat .gif',
    'Silent Plank': '/assets/gifs/Silent Plank  .gif',
  };

  const path = map[exerciseName];
  if (path) {
    return path;
  }
  // Last resort fallback
  return `/assets/gifs/${exerciseName.replace(/ /g, '%20')}.gif`;
}

export function ExerciseDemoModal({ visible, exerciseName, onClose, source }: ExerciseDemoModalProps) {
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isWeb = Platform.OS === 'web';

  // Determine the best source for the GIF
  let finalWebSrc;
  if (isWeb) {
    if (source) {
      // Best: use the result from require() (bundler handles the file)
      finalWebSrc = typeof source === 'string' ? source : (source.default || source);
    } else {
      // Fallback (usually fails)
      finalWebSrc = getWebImageSrc(exerciseName);
    }
    console.log('[DemoModal] Web GIF src for', exerciseName, '→', finalWebSrc);
  }

  const imageSource = source 
    ? (typeof source === 'string' ? { uri: source } : source)
    : null;

  // Much bigger on desktop
  const modalHeight = isWeb ? 580 : 340;
  const containerWidth = isWeb ? '95%' : '100%';
  const maxWidth = isWeb ? 900 : undefined;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View 
        style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.92)', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: isWeb ? 24 : 16 
        }}
        onTouchEnd={onClose}
      >
        <View 
          style={{ width: containerWidth, maxWidth }}
          onTouchEnd={(e) => e.stopPropagation?.()}
        >
          <GlassContainer padding={spacing.lg} style={{ borderRadius: 16 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
              <KageText variant="h3" style={{ flex: 1 }}>
                {exerciseName}
              </KageText>
              <View onTouchEnd={onClose} style={{ padding: 8 }}>
                <KageText variant="body" color={colors.text.muted} style={{ fontSize: 20 }}>✕</KageText>
              </View>
            </View>

            {/* === DEBUG INFO (copy this line if photo still fails) === */}
            <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 10, marginBottom: spacing.sm, textAlign: 'center' }}>
              {isWeb 
                ? `Trying: ${source || finalWebSrc || 'NO PATH'}` 
                : 'Native platform'
              }
            </KageText>

            {/* GIF Container - Bigger on desktop */}
            <View 
              style={{ 
                height: modalHeight, 
                backgroundColor: '#0A0A0A', 
                borderRadius: 12, 
                overflow: 'hidden', 
                marginBottom: spacing.md, 
                alignItems: 'center', 
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colors.glass.border
              }}
            >
              {imageSource ? (
                <>
                  {loading && (
                    <View style={{ position: 'absolute', zIndex: 10 }}>
                      <ActivityIndicator size="large" color={colors.accent.gold} />
                    </View>
                  )}

                  {/* On Web: Use native <img> for reliable GIF animation */}
                  {isWeb ? (
                    <img 
                      src={source || finalWebSrc} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                      }} 
                      alt={exerciseName}
                      onLoad={() => setLoading(false)}
                      onError={() => {
                        setLoading(false);
                        setError(true);
                        console.error('Failed to load GIF for:', exerciseName, 'URL tried:', source || finalWebSrc);
                      }}
                    />
                  ) : (
                    <Image 
                      key={playbackSpeed}
                      source={imageSource} 
                      style={{ 
                        width: '100%', 
                        height: '100%',
                      }} 
                      resizeMode="contain"
                      onLoadStart={() => setLoading(true)}
                      onLoad={() => setLoading(false)}
                      onError={() => {
                        setLoading(false);
                        setError(true);
                      }}
                    />
                  )}
                </>
              ) : (
                <View style={{ alignItems: 'center', padding: 20 }}>
                  <KageText variant="body" color={colors.text.muted} style={{ textAlign: 'center' }}>
                    No demo available for this exercise.
                  </KageText>
                  <KageText variant="caption" color={colors.text.muted} style={{ marginTop: 6, textAlign: 'center' }}>
                    Put the GIF in assets/gifs/ and add it to exerciseDemos.ts
                  </KageText>
                </View>
              )}

              {error && (
                <KageText variant="caption" color={colors.status.danger} style={{ position: 'absolute', bottom: 12, textAlign: 'center', paddingHorizontal: 10 }}>
                  Failed to load GIF. Make sure the file is in assets/gifs/ with the exact name (no extra spaces).
                </KageText>
              )}

              {/* (No speed control for photos) */}
            </View>

            <KageText variant="body" style={{ marginBottom: spacing.lg, textAlign: 'center', color: colors.text.secondary, fontSize: 13 }}>
              {playbackSpeed < 1 
                ? "Studying the movement in slow motion..." 
                : "Focus on control, breathing, and form."
              }
            </KageText>

            <KageButton title="CLOSE" variant="ghost" size="md" fullWidth onPress={onClose} />
          </GlassContainer>
        </View>
      </View>
    </Modal>
  );
}