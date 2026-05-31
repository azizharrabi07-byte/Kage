import React, { useState } from 'react';
import { View, Modal, Image, ActivityIndicator, Platform } from 'react-native';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { useColors, spacing } from '@/theme';
import { getExerciseDemo } from '@/constants/exerciseDemos';

interface ExerciseDemoModalProps {
  visible: boolean;
  exerciseName: string;
  onClose: () => void;
}

export function ExerciseDemoModal({ visible, exerciseName, onClose }: ExerciseDemoModalProps) {
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Get photo from our clean, maintained mapping only
  const photoSource = getExerciseDemo(exerciseName);

  const isWeb = Platform.OS === 'web';

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
          style={{ width: isWeb ? '95%' : '100%', maxWidth: isWeb ? 900 : undefined }}
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

            {/* Photo Viewer */}
            <View 
              style={{ 
                height: isWeb ? 520 : 320, 
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
              {photoSource ? (
                <>
                  {loading && (
                    <View style={{ position: 'absolute', zIndex: 10 }}>
                      <ActivityIndicator size="large" color={colors.accent.gold} />
                    </View>
                  )}
                  <Image 
                    source={photoSource}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                    onLoadStart={() => setLoading(true)}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setLoading(false);
                      setHasError(true);
                    }}
                  />
                </>
              ) : (
                <View style={{ alignItems: 'center', padding: 20 }}>
                  <KageText variant="body" color={colors.text.muted} style={{ textAlign: 'center' }}>
                    No photo available yet for this exercise.
                  </KageText>
                  <KageText variant="caption" color={colors.accent.gold} style={{ marginTop: 8, textAlign: 'center', fontSize: 10 }}>
                    Add it to assets/images/exercises/
                  </KageText>
                </View>
              )}

              {hasError && (
                <KageText variant="caption" color={colors.status.danger} style={{ position: 'absolute', bottom: 12, textAlign: 'center' }}>
                  Failed to load photo.
                </KageText>
              )}
            </View>

            <KageText variant="body" style={{ marginBottom: spacing.lg, textAlign: 'center', color: colors.text.secondary, fontSize: 13 }}>
              Focus on control, breathing, and form.
            </KageText>

            <KageButton title="CLOSE" variant="ghost" size="md" fullWidth onPress={onClose} />
          </GlassContainer>
        </View>
      </View>
    </Modal>
  );
}
