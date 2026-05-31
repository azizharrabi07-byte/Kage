import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useColors, spacing } from '@/theme';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { generateFullMovementReport, getMovementProfile } from '@/store/movementIntelligence';

export function MovementReportScreen() {
  const colors = useColors();
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const loadReport = async () => {
    setLoading(true);
    const prof = await getMovementProfile();
    setProfile(prof);

    const fullReport = await generateFullMovementReport();
    setReport(fullReport);
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
      <KageText variant="h2" letterSpacing={3} align="center" style={{ marginBottom: spacing.md }}>
        MOVEMENT INTELLIGENCE REPORT
      </KageText>

      <KageText variant="caption" color={colors.text.muted} align="center" style={{ marginBottom: spacing.lg }}>
        Your long-term movement patterns, analyzed by Sensei
      </KageText>

      {!report && (
        <GlassContainer padding={spacing.xl} style={{ alignItems: 'center' }}>
          <KageText variant="body" style={{ textAlign: 'center', marginBottom: spacing.lg }}>
            This report combines all your camera sessions and form data across months.
            It reveals patterns that no single workout can show.
          </KageText>

          <KageButton 
            title={loading ? "SENSEI IS WRITING YOUR REPORT..." : "GENERATE FULL MOVEMENT REPORT"} 
            variant="gold" 
            size="lg"
            onPress={loadReport}
            disabled={loading}
          />
        </GlassContainer>
      )}

      {loading && (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <ActivityIndicator size="large" color={colors.accent.gold} />
          <KageText variant="caption" style={{ marginTop: 12 }}>This may take 10-15 seconds...</KageText>
        </View>
      )}

      {report && profile && (
        <View style={{ gap: spacing.md }}>
          <GlassContainer padding={spacing.lg}>
            <KageText variant="body" style={{ lineHeight: 22, color: colors.text.secondary }}>
              {report}
            </KageText>
          </GlassContainer>

          {profile.chronicWeaknesses?.length > 0 && (
            <GlassContainer padding={spacing.lg}>
              <KageText variant="caption" color={colors.accent.gold} style={{ marginBottom: spacing.sm }}>
                DETECTED CHRONIC WEAKNESSES
              </KageText>
              {profile.chronicWeaknesses.map((w: string, i: number) => (
                <KageText key={i} variant="body" style={{ marginBottom: 4 }}>• {w}</KageText>
              ))}
            </GlassContainer>
          )}

          <KageButton 
            title="REFRESH REPORT" 
            variant="primary" 
            onPress={loadReport} 
          />
        </View>
      )}
    </ScrollView>
  );
}