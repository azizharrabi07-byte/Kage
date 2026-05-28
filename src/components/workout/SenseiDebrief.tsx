import React, { useState } from 'react';
import { View } from 'react-native';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { useColors, spacing } from '@/theme';
import { generateSenseiDebrief, getMovementProfile, type MovementInsight } from '@/store/movementIntelligence';

interface SenseiDebriefProps {
  exerciseName: string;
  onClose?: () => void;
}

export function SenseiDebrief({ exerciseName, onClose }: SenseiDebriefProps) {
  const colors = useColors();
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const profile = await getMovementProfile();
    const insights = profile.insights[exerciseName] || [];
    const debrief = await generateSenseiDebrief(exerciseName, insights);
    setReport(debrief);
    setLoading(false);
  };

  return (
    <GlassContainer intensity="heavy" glow="gold" padding={spacing.lg} style={{ borderRadius: 16 }}>
      <KageText variant="h3" letterSpacing={2} align="center" style={{ marginBottom: spacing.md }}>
        SENSEI MOVEMENT DEBRIEF
      </KageText>

      {!report && (
        <>
          <KageText variant="body" color={colors.text.secondary} style={{ textAlign: 'center', marginBottom: spacing.lg }}>
            Let Sensei analyze your patterns across sessions. This is where real intelligence lives.
          </KageText>

          <KageButton
            title={loading ? "SENSEI IS REFLECTING..." : "REQUEST DEEP DEBRIEF"}
            variant="gold"
            size="lg"
            fullWidth
            onPress={handleGenerate}
            disabled={loading}
          />
        </>
      )}

      {report && (
        <View style={{ gap: spacing.md }}>
          <KageText variant="body" style={{ lineHeight: 20, color: colors.text.secondary }}>
            {report}
          </KageText>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.md }}>
            <KageButton title="CLOSE" variant="ghost" onPress={onClose} style={{ flex: 1 }} />
            <KageButton 
              title="ANOTHER REFLECTION" 
              variant="primary" 
              onPress={() => setReport(null)} 
              style={{ flex: 1 }} 
            />
          </View>
        </View>
      )}
    </GlassContainer>
  );
}