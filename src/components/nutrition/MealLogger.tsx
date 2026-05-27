import React, { useState, useCallback } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { FoodScanner } from '@/components/nutrition/FoodScanner';
import { useColors, spacing } from '@/theme';
import { addFood, getDayTotals, type DayTotals } from '@/store/nutritionStore';
import { analyzeFoodPhoto } from '@/utils/gemini';

interface MealLoggerProps {
  onComplete: () => void;
  onClose: () => void;
}

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export function MealLogger({ onComplete, onClose }: MealLoggerProps) {
  const colors = useColors();
  const [step, setStep] = useState<'scan' | 'review' | 'saving'>('scan');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [mealType, setMealType] = useState('Lunch');
  const [analysis, setAnalysis] = useState<{
    items: Array<{ name: string; calories: number; protein: number; carbs: number; fat: number; serving: string }>;
    totals: { calories: number; protein: number; carbs: number; fat: number };
  } | null>(null);
  const [error, setError] = useState('');

  const handlePhoto = useCallback(async (b64: string) => {
    setPhotoBase64(b64);
    setStep('review');
    setError('');
    const result = await analyzeFoodPhoto(b64);
    if (result) {
      setAnalysis(result);
    } else {
      setError('Could not analyze food. Please log manually.');
      setAnalysis({
        items: [{ name: 'Unknown food', calories: 0, protein: 0, carbs: 0, fat: 0, serving: '1 serving' }],
        totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      });
    }
  }, []);

  async function handleSave() {
    if (!analysis) return;
    setStep('saving');
    const today = new Date().toISOString().slice(0, 10);
    try {
      for (const item of analysis.items) {
        await addFood({
          name: item.name,
          grams: 100,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          date: today,
          photoBase64: photoBase64 || undefined,
        });
      }
      onComplete();
    } catch {
      setError('Failed to save. Please try again.');
      setStep('review');
    }
  }

  if (step === 'scan') {
    return <FoodScanner onPhoto={handlePhoto} onClose={onClose} />;
  }

  return (
    <GlassContainer intensity="medium" padding={spacing.md} glow="gold">
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
        <KageText variant="bodyBold" color={colors.text.primary} style={{ fontSize: 12, letterSpacing: 1.5 }}>
          🍽️ Log Meal
        </KageText>
        <Pressable onPress={onClose}>
          <KageText variant="mono" color={colors.text.muted} style={{ fontSize: 10 }}>
            ✕ CLOSE
          </KageText>
        </Pressable>
      </View>

      {/* Photo preview */}
      {photoBase64 && (
        <View style={{
          width: '100%', aspectRatio: 4 / 3, borderRadius: 8, overflow: 'hidden',
          backgroundColor: '#000', marginBottom: spacing.sm,
        }}>
          <img src={`data:image/jpeg;base64,${photoBase64}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="food" />
        </View>
      )}

      {/* Meal type selector */}
      <View style={{ flexDirection: 'row', gap: 4, marginBottom: spacing.md, flexWrap: 'wrap' }}>
        {MEAL_TYPES.map(t => (
          <View
            key={t}
            onTouchEnd={() => setMealType(t)}
            style={{
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6,
              backgroundColor: mealType === t ? colors.accent.gold : colors.glass.light,
              borderWidth: 1, borderColor: mealType === t ? colors.accent.gold : colors.glass.border,
            }}
          >
            <KageText variant="bodyBold" style={{
              fontSize: 9, letterSpacing: 1,
              color: mealType === t ? colors.text.inverse : colors.text.muted,
            }}>
              {t.toUpperCase()}
            </KageText>
          </View>
        ))}
      </View>

      {/* Analysis results */}
      {error ? (
        <View style={{
          padding: spacing.sm, borderRadius: 6,
          backgroundColor: 'rgba(200,16,46,0.1)', marginBottom: spacing.sm,
        }}>
          <KageText variant="body" color={colors.status.danger} style={{ fontSize: 10 }}>{error}</KageText>
        </View>
      ) : analysis && (
        <>
          {/* Totals */}
          <GlassContainer intensity="light" padding={spacing.sm} glow="subtle" style={{ marginBottom: spacing.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <KageText variant="mono" color={colors.accent.gold} style={{ fontSize: 20 }}>{analysis.totals.calories}</KageText>
                <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 7, letterSpacing: 1 }}>CAL</KageText>
              </View>
              <View style={{ alignItems: 'center' }}>
                <KageText variant="mono" color={colors.accent.primary} style={{ fontSize: 20 }}>{analysis.totals.protein}g</KageText>
                <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 7, letterSpacing: 1 }}>PROTEIN</KageText>
              </View>
              <View style={{ alignItems: 'center' }}>
                <KageText variant="mono" color={colors.status.warning} style={{ fontSize: 20 }}>{analysis.totals.carbs}g</KageText>
                <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 7, letterSpacing: 1 }}>CARBS</KageText>
              </View>
              <View style={{ alignItems: 'center' }}>
                <KageText variant="mono" color={colors.status.ready} style={{ fontSize: 20 }}>{analysis.totals.fat}g</KageText>
                <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 7, letterSpacing: 1 }}>FAT</KageText>
              </View>
            </View>
          </GlassContainer>

          {/* Items list */}
          <ScrollView style={{ maxHeight: 120 }} showsVerticalScrollIndicator={false}>
            {analysis.items.map((item, i) => (
              <View key={i} style={{
                flexDirection: 'row', justifyContent: 'space-between',
                paddingVertical: 4, paddingHorizontal: spacing.sm,
                backgroundColor: colors.glass.light, borderRadius: 4,
                marginBottom: 3,
              }}>
                <KageText variant="body" style={{ fontSize: 10, color: colors.text.secondary, flex: 1 }}>{item.name}</KageText>
                <KageText variant="mono" style={{ fontSize: 9, color: colors.text.muted }}>{item.serving}</KageText>
                <KageText variant="mono" style={{ fontSize: 9, color: colors.accent.primary, width: 40, textAlign: 'right' }}>{item.calories}</KageText>
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
        <KageButton title="🔄 RETRY" variant="ghost" size="sm" onPress={() => setStep('scan')} style={{ flex: 1 }} />
            <KageButton
              title={step === 'saving' ? 'SAVING...' : '💾 SAVE MEAL'}
              variant="gold"
              size="sm"
              onPress={handleSave}
              style={{ flex: 2 }}
            />
      </View>
    </GlassContainer>
  );
}
