/**
 * KAGE DIET — New dedicated page
 * Deeply integrated with Model Thinking Strategist
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, useWindowDimensions, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { InkDivider } from '@/components/japanese/InkDivider';
import { useColors, spacing } from '@/theme';
import { generateModelThinkingReport, type ModelThinkingReport } from '@/store/aiStrategist';
import { ModelThinkingCard } from '@/components/ai/ModelThinkingCard';

const BREAKPOINTS = { desktop: 1024 };
function useResponsive() {
  const { width } = useWindowDimensions();
  return { isDesktop: width >= BREAKPOINTS.desktop };
}

export default function DietPage() {
  const colors = useColors();
  const router = useRouter();
  const { isDesktop } = useResponsive();
  const [report, setReport] = useState<ModelThinkingReport | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStrategist = async () => {
    setLoading(true);
    try {
      const result = await generateModelThinkingReport();
      setReport(result);
    } catch (e) {
      console.error('Diet strategist failed');
    }
    setLoading(false);
  };

  useEffect(() => {
    // Auto-load strategist when entering the page
    loadStrategist();
  }, []);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ 
        padding: isDesktop ? spacing.xl * 1.5 : spacing.lg, 
        paddingTop: 70, 
        paddingBottom: 120,
        maxWidth: isDesktop ? 1100 : undefined,
        alignSelf: isDesktop ? 'center' : undefined
      }}>

        {/* Diet Hero Background - Using the photo you uploaded */}
        <View style={{
          height: isDesktop ? 220 : 160,
          marginHorizontal: isDesktop ? -spacing.xl * 1.5 : -spacing.lg,
          marginTop: -70,
          marginBottom: spacing.lg,
          borderRadius: isDesktop ? 0 : 0,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Using strategist.jpg as the Diet hero for now.
             The file you named "diet-hero.jpg" currently contains a man photo.
             If you want a food image here, rename your food photo to "diet-hero.jpg" 
             and put it in assets/images/background/ */}
          <Image 
            source={require('../assets/images/background/strategist.jpg')}
            style={{
              width: '100%',
              height: '100%',
              opacity: 0.65,
            }}
            resizeMode="cover"
          />
          {/* Solid overlay (linear-gradient style not supported in RN Web) */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '65%',
            backgroundColor: 'rgba(9,10,15,0.82)',
          }} />
          
          <View style={{ position: 'absolute', bottom: 24, left: 24 }}>
            <KageText variant="kanji" color="#fff" style={{ fontSize: 42, opacity: 0.9 }}>食</KageText>
            <KageText variant="h2" color="#fff" style={{ fontSize: 26, letterSpacing: 3 }}>DIET STRATEGY</KageText>
          </View>
        </View>
        <Animated.View entering={FadeInDown.delay(60)}>
          <KageText variant="kanji" color={colors.accent.gold} style={{ fontSize: 28, textAlign: 'center', opacity: 0.6 }}>食</KageText>
          <KageText variant="h3" letterSpacing={4} style={{ textAlign: 'center' }}>DIET</KageText>
          <KageText variant="caption" color={colors.text.muted} style={{ textAlign: 'center', marginTop: 4 }}>
            Fuel the warrior. Precision nutrition.
          </KageText>
        </Animated.View>

        <InkDivider width={60} />

        {/* Full Model Thinking Strategist embedded here */}
        <View style={{ marginVertical: spacing.md }}>
          <ModelThinkingCard />
        </View>

        {/* Personalized Diet Framework from the Strategist */}
        {report && (
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <GlassContainer padding={spacing.lg} style={{ borderRadius: 16, marginBottom: spacing.md }}>
              <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 9, letterSpacing: 2, marginBottom: spacing.xs }}>
                YOUR STRATEGIST DIET PRESCRIPTION
              </KageText>

              <KageText variant="h2" style={{ marginBottom: spacing.sm }}>
                {report.recommendedDiet.calories} kcal • {report.recommendedDiet.protein}g Protein
              </KageText>

              <KageText variant="body" color={colors.text.secondary} style={{ marginBottom: spacing.md }}>
                {report.recommendedDiet.style}. {report.recommendedDiet.keyAdvice}
              </KageText>

              <KageText variant="caption" color={colors.accent.primary} style={{ fontSize: 9, letterSpacing: 1.5, marginBottom: spacing.xs }}>
                WEEKLY FRAMEWORK (BASED ON YOUR DATA)
              </KageText>

              <KageText variant="body" style={{ fontSize: 12, lineHeight: 18 }}>
                Training Days: +300-400 kcal with higher carbs around workouts.{'\n'}
                Rest Days: Slightly lower carbs, keep protein high.{'\n'}
                Focus: Prioritize protein at every meal. Time carbs around training. Sleep 7.5+ hours.
              </KageText>
            </GlassContainer>
          </Animated.View>
        )}

        <GlassContainer padding={spacing.lg} style={{ borderRadius: 16 }}>
          <KageText variant="h2" style={{ marginBottom: spacing.sm }}>Quick Actions</KageText>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <KageButton 
              title="LOG MEAL" 
              variant="gold" 
              size="sm" 
              style={{ flex: 1 }} 
              onPress={() => router.push('/(tabs)/profile')} 
            />
            <KageButton 
              title="RUN NEW ANALYSIS" 
              variant="primary" 
              size="sm" 
              style={{ flex: 1 }} 
              onPress={loadStrategist} 
            />
          </View>
        </GlassContainer>

        {/* === ENHANCED DIET PAGE CONTENT (as requested) === */}

        {/* User Stats + Macro Calculator moved here */}
        <GlassContainer padding={spacing.lg} style={{ borderRadius: 18, marginTop: spacing.lg }}>
          <KageText variant="h3" style={{ marginBottom: spacing.sm }}>Your Current Stats & Macros</KageText>

          <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <KageText variant="caption" color={colors.text.muted}>Age • Height • Weight</KageText>
              <KageText variant="bodyBold" style={{ fontSize: 18 }}>28 • 178 cm • 82 kg</KageText>
              <KageText variant="caption" style={{ marginTop: 4 }}>BMI: 25.9 (Normal-Overweight border)</KageText>
            </View>

            <View style={{ flex: 1 }}>
              <KageText variant="caption" color={colors.text.muted}>Daily Target (example)</KageText>
              <KageText variant="bodyBold" style={{ fontSize: 20, color: colors.accent.gold }}>2,850 kcal</KageText>
              <KageText variant="body" style={{ fontSize: 13 }}>185g Protein • 280g Carbs • 85g Fat</KageText>
            </View>
          </View>
        </GlassContainer>

        {/* Program-specific Diet Suggestions */}
        <GlassContainer padding={spacing.lg} style={{ borderRadius: 18, marginTop: spacing.md }}>
          <KageText variant="h3" style={{ marginBottom: spacing.sm }}>Diet Tailored to Your Program</KageText>
          <KageText variant="body" color={colors.text.secondary} style={{ marginBottom: spacing.md }}>
            Your active program changes how you should eat. Here are smart recommendations:
          </KageText>

          <View style={{ gap: 12 }}>
            <View>
              <KageText variant="bodyBold" color={colors.accent.primary}>Shadow Strength (Powerlifting)</KageText>
              <KageText variant="body" style={{ fontSize: 12 }}>Higher carbs on training days for performance + recovery. Very high protein every day.</KageText>
            </View>
            <View>
              <KageText variant="bodyBold" color={colors.accent.primary}>Samurai Hypertrophy</KageText>
              <KageText variant="body" style={{ fontSize: 12 }}>Consistent calorie surplus + high protein. Carb up around workouts for pumps.</KageText>
            </View>
            <View>
              <KageText variant="bodyBold" color={colors.accent.primary}>Iron Body (Calisthenics)</KageText>
              <KageText variant="body" style={{ fontSize: 12 }}>Slightly lower bodyweight focus. Good protein + enough energy for high volume.</KageText>
            </View>
          </View>
        </GlassContainer>

        {/* Sample Meals with Photo Placeholders */}
        <GlassContainer padding={spacing.lg} style={{ borderRadius: 18, marginTop: spacing.md }}>
          <KageText variant="h3" style={{ marginBottom: spacing.sm }}>Sample Daily Meals</KageText>
          <KageText variant="caption" color={colors.text.muted} style={{ marginBottom: spacing.md }}>
            Put your meal photos in: assets/images/meals/ (e.g. chicken-rice.jpg)
          </KageText>

          {[
            { name: 'Breakfast', desc: 'Oats, eggs, banana, peanut butter', protein: '38g', file: 'breakfast.jpg' },
            { name: 'Lunch', desc: 'Grilled chicken, rice, broccoli', protein: '55g', file: 'chicken-rice.jpg' },
            { name: 'Post Workout', desc: 'Whey + rice cakes + honey', protein: '42g', file: 'post-workout.jpg' },
            { name: 'Dinner', desc: 'Salmon, sweet potato, salad', protein: '50g', file: 'salmon-dinner.jpg' },
          ].map((meal, i) => (
            <View key={i} style={{ 
              backgroundColor: colors.glass.light, 
              borderRadius: 12, 
              padding: 12, 
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <View style={{ 
                width: 70, height: 70, 
                backgroundColor: colors.glass.medium, 
                borderRadius: 10, 
                marginRight: 12,
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <KageText variant="caption" style={{ fontSize: 9, textAlign: 'center' }}>
                  Add photo\n{meal.file}
                </KageText>
              </View>
              <View style={{ flex: 1 }}>
                <KageText variant="bodyBold">{meal.name}</KageText>
                <KageText variant="body" style={{ fontSize: 12 }}>{meal.desc}</KageText>
              </View>
              <KageText variant="mono" style={{ color: colors.accent.gold, fontSize: 13 }}>{meal.protein}</KageText>
            </View>
          ))}
        </GlassContainer>

      </ScrollView>
    </ScreenContainer>
  );
}
