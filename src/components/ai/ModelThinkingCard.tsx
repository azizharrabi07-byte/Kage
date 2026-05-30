/**
 * Model Thinking Card — The "Strategist" the professionals wanted
 * Shows AI-powered program + diet recommendation with strong personality.
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { KageText } from '@/components/ui/KageText';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { KageButton } from '@/components/ui/KageButton';
import { useColors, spacing } from '@/theme';
import { runModelThinking } from '@/api/services/aiService';
import { generateModelThinkingReport as localGenerate } from '@/store/aiStrategist'; // fallback
import type { ModelThinkingReport, UserProfile } from '@/store/aiStrategist';
import { getProgramById } from '@/store/programStore';
import { useRouter } from 'expo-router';

export function ModelThinkingCard() {
  const colors = useColors();
  const router = useRouter();
  const [report, setReport] = useState<ModelThinkingReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // User profile form state
  const [profile, setProfile] = useState<UserProfile>({
    age: undefined,
    heightCm: undefined,
    weightKg: undefined,
    goal: 'build_muscle',
    experience: 'intermediate',
    injuries: '',
  });

  const runAnalysis = async (useProfile = false) => {
    setLoading(true);
    setError('');
    try {
      if (useProfile) {
        // Prefer real backend
        try {
          const backendReport = await runModelThinking(profile);
          setReport(backendReport as any);
          setShowForm(false);
          setLoading(false);
          return;
        } catch (backendError) {
          console.warn("Backend AI call failed, falling back to local:", backendError);
        }
      }

      // Fallback to old local logic
      const dataToSend = useProfile ? profile : undefined;
      const result = await localGenerate(dataToSend);
      setReport(result);
      setShowForm(false);
    } catch (e) {
      setError('The strategist is reflecting. Try again in a moment.');
    }
    setLoading(false);
  };

  const recommendedProgram = report ? getProgramById(report.recommendedProgramId) : null;

  return (
    <GlassContainer 
      padding={spacing.lg} 
      glow="gold" 
      accentTop 
      accentColor={colors.accent.gold}
      style={{ borderRadius: 18, marginBottom: spacing.md }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
        <KageText variant="kanji" style={{ fontSize: 22, color: colors.accent.gold, marginRight: 8 }}>謀</KageText>
        <View>
          <KageText variant="caption" letterSpacing={3} color={colors.accent.gold} style={{ fontSize: 9 }}>
            STRATEGIC INTELLIGENCE
          </KageText>
          <KageText variant="h3" style={{ fontSize: 16 }}>MODEL THINKING</KageText>
        </View>
      </View>

      {!report && !loading && (
        <>
          <KageText variant="body" color={colors.text.secondary} style={{ fontSize: 12, lineHeight: 18, marginBottom: spacing.md }}>
            Let the strategist analyze your complete data — XP balance, movement history, consistency — and tell you the single best path forward.
          </KageText>

          {!showForm ? (
            <View style={{ gap: 8 }}>
              <KageButton 
                title="RUN STRATEGIC ANALYSIS" 
                variant="gold" 
                size="md" 
                fullWidth 
                onPress={() => runAnalysis(false)} 
              />
              <KageButton 
                title="GIVE MORE DETAILS (Age, Height, Weight...)" 
                variant="ghost" 
                size="sm" 
                fullWidth 
                onPress={() => setShowForm(true)} 
              />
            </View>
          ) : (
            // Personal Data Form for much more specific recommendations
            <View style={{ gap: spacing.sm }}>
              <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 10 }}>
                Answer a few questions for highly personalized advice
              </KageText>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <KageText variant="caption" style={{ fontSize: 9 }}>Age</KageText>
                  <TextInput
                    value={profile.age?.toString() || ''}
                    onChangeText={(t) => setProfile(p => ({ ...p, age: parseInt(t) || undefined }))}
                    keyboardType="numeric"
                    style={{ backgroundColor: colors.glass.light, borderRadius: 8, padding: 8, color: colors.text.primary }}
                    placeholder="28"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <KageText variant="caption" style={{ fontSize: 9 }}>Height (cm)</KageText>
                  <TextInput
                    value={profile.heightCm?.toString() || ''}
                    onChangeText={(t) => setProfile(p => ({ ...p, heightCm: parseInt(t) || undefined }))}
                    keyboardType="numeric"
                    style={{ backgroundColor: colors.glass.light, borderRadius: 8, padding: 8, color: colors.text.primary }}
                    placeholder="178"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <KageText variant="caption" style={{ fontSize: 9 }}>Weight (kg)</KageText>
                  <TextInput
                    value={profile.weightKg?.toString() || ''}
                    onChangeText={(t) => setProfile(p => ({ ...p, weightKg: parseInt(t) || undefined }))}
                    keyboardType="numeric"
                    style={{ backgroundColor: colors.glass.light, borderRadius: 8, padding: 8, color: colors.text.primary }}
                    placeholder="82"
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                <KageButton 
                  title="Get Personalized Advice" 
                  variant="gold" 
                  size="sm" 
                  style={{ flex: 1 }} 
                  onPress={() => runAnalysis(true)} 
                />
                <KageButton 
                  title="Cancel" 
                  variant="ghost" 
                  size="sm" 
                  style={{ flex: 1 }} 
                  onPress={() => setShowForm(false)} 
                />
              </View>
            </View>
          )}
        </>
      )}

      {loading && (
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <ActivityIndicator size="small" color={colors.accent.gold} />
          <KageText variant="caption" color={colors.text.muted} style={{ marginTop: 10 }}>
            The strategist is thinking...
          </KageText>
        </View>
      )}

      {error && (
        <KageText variant="body" color={colors.status.danger} style={{ textAlign: 'center' }}>{error}</KageText>
      )}

      {report && recommendedProgram && (
        <Animated.View entering={FadeIn.duration(400)}>
          <View style={{ 
            backgroundColor: colors.glass.light, 
            borderRadius: 12, 
            padding: spacing.md, 
            marginBottom: spacing.sm,
            borderLeftWidth: 4,
            borderLeftColor: recommendedProgram.color
          }}>
            <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 9, letterSpacing: 1.5 }}>
              RECOMMENDED CAMPAIGN
            </KageText>
            <KageText variant="h2" style={{ fontSize: 18, marginTop: 2 }}>
              {recommendedProgram.name}
            </KageText>
            <KageText variant="body" color={colors.text.secondary} style={{ fontSize: 12, marginTop: 4, lineHeight: 17 }}>
              {report.programReason}
            </KageText>
          </View>

          <View style={{ marginBottom: spacing.sm }}>
            <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 9, letterSpacing: 1.5, marginBottom: 4 }}>
              EXPECTED TRANSFORMATION (5 WEEKS)
            </KageText>
            <KageText variant="body" style={{ fontSize: 12, lineHeight: 17 }}>
              {report.expectedOutcomes}
            </KageText>
          </View>

          <View style={{ marginBottom: spacing.md }}>
            <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 9, letterSpacing: 1.5, marginBottom: 4 }}>
              PERSONALIZED DIET STRATEGY
            </KageText>
            <KageText variant="bodyBold" style={{ fontSize: 13 }}>
              {report.recommendedDiet.calories} kcal • {report.recommendedDiet.protein}g protein
            </KageText>
            <KageText variant="body" color={colors.text.secondary} style={{ fontSize: 12, marginTop: 3 }}>
              {report.recommendedDiet.style}. {report.recommendedDiet.keyAdvice}
            </KageText>
          </View>

          <View style={{ 
            backgroundColor: 'rgba(0, 245, 212, 0.06)', 
            borderRadius: 10, 
            padding: spacing.sm,
            marginBottom: spacing.sm
          }}>
            <KageText variant="bodyBold" color={colors.accent.primary} style={{ fontSize: 12 }}>
              “{report.strategicSummary}”
            </KageText>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <KageButton 
              title="START THIS PROGRAM" 
              variant="primary" 
              size="sm" 
              style={{ flex: 1 }} 
              onPress={() => router.push(`/programs/${report.recommendedProgramId}`)} 
            />
            <KageButton 
              title="ANALYZE AGAIN" 
              variant="ghost" 
              size="sm" 
              style={{ flex: 1 }} 
              onPress={runAnalysis} 
            />
          </View>
        </Animated.View>
      )}
    </GlassContainer>
  );
}
