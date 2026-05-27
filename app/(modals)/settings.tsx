import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { useColors, useTheme, spacing } from '@/theme';
import { getApiKey, setApiKey, getBodyWeight, setBodyWeight } from '@/constants/config';
import { calculateMacros } from '@/constants/nutritionGoals';
import { apiExportDB, apiImportDB } from '@/store/api';

export default function SettingsModal() {
  const colors = useColors();
  const { mode, toggleTheme } = useTheme();
  const router = useRouter();
  const [weight, setWeight] = useState('75');
  const [apiKey, setApiKeyState] = useState('');
  const [saved, setSaved] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  useEffect(() => {
    Promise.all([getBodyWeight(), getApiKey()]).then(([w, k]) => {
      setWeight(String(w));
      setApiKeyState(k);
    });
  }, []);

  const macros = calculateMacros(parseFloat(weight) || 75);

  async function handleSave() {
    const w = parseFloat(weight) || 75;
    await setBodyWeight(w);
    if (apiKey.trim()) await setApiKey(apiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleExport() {
    try {
      const data = await apiExportDB();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kage_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportStatus('✓ Exported');
    } catch {
      setExportStatus('Export failed');
    }
    setTimeout(() => setExportStatus(''), 3000);
  }

  async function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await apiImportDB(data);
        setExportStatus('✓ Imported! Reload to see changes.');
      } catch {
        setExportStatus('Invalid backup file');
      }
      setTimeout(() => setExportStatus(''), 4000);
    };
    input.click();
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingTop: 50, paddingHorizontal: spacing.lg }}>
        <GlassContainer padding={spacing.xl} style={{ borderRadius: 14, gap: 16 }}>
          <KageText variant="h3" letterSpacing={4} align="center">SETTINGS</KageText>

          <View>
            <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: 8, textTransform: 'uppercase', marginBottom: 8 }}>
              Body Weight
            </KageText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                style={{
                  flex: 1, height: 40, borderRadius: 8,
                  paddingHorizontal: 12, fontSize: 14,
                  color: colors.text.primary,
                  backgroundColor: colors.glass.light,
                  borderWidth: 1, borderColor: colors.glass.border,
                  fontFamily: undefined,
                }}
              />
              <KageText variant="body" color={colors.text.muted}>kg</KageText>
            </View>
            <View style={{ marginTop: 8, gap: 2 }}>
              <KageText variant="caption" style={{ fontSize: 9, color: colors.text.muted }}>
                🥩 Protein: {macros.protein}g · 🔥 Calories: {macros.calories}
              </KageText>
              <KageText variant="caption" style={{ fontSize: 9, color: colors.text.muted }}>
                🌾 Carbs: {macros.carbs}g · 🥑 Fat: {macros.fat}g
              </KageText>
            </View>
          </View>

          <View>
            <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: 8, textTransform: 'uppercase', marginBottom: 8 }}>
              Groq API Key
            </KageText>
            <TextInput
              value={apiKey}
              onChangeText={setApiKeyState}
              placeholder="gsk_..."
              placeholderTextColor={colors.text.muted}
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                height: 40, borderRadius: 8,
                paddingHorizontal: 12, fontSize: 12,
                color: colors.text.primary,
                backgroundColor: colors.glass.light,
                borderWidth: 1, borderColor: colors.glass.border,
                fontFamily: 'monospace',
              }}
            />
          </View>

          <View>
            <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: 8, textTransform: 'uppercase', marginBottom: 8 }}>
              Theme
            </KageText>
            <View onTouchEnd={toggleTheme} style={{
              paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8,
              backgroundColor: colors.glass.medium, borderWidth: 1, borderColor: colors.glass.border,
            }}>
              <KageText variant="bodyBold" style={{ fontSize: 11, color: colors.text.primary, letterSpacing: 1 }}>
                {mode === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </KageText>
            </View>
          </View>

          <KageButton
            title={saved ? '✓ SAVED' : 'SAVE SETTINGS'}
            variant={saved ? 'gold' : 'primary'}
            size="md"
            fullWidth
            onPress={handleSave}
          />

          <View style={{ borderTopWidth: 1, borderTopColor: colors.glass.border, paddingTop: 12 }}>
            <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: 8, textTransform: 'uppercase', marginBottom: 8, textAlign: 'center' }}>
              Database
            </KageText>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View onTouchEnd={handleExport} style={{
                flex: 1, paddingVertical: 10, borderRadius: 8,
                backgroundColor: colors.glass.medium, borderWidth: 1, borderColor: colors.glass.border,
                alignItems: 'center',
              }}>
                <KageText variant="bodyBold" style={{ fontSize: 10, letterSpacing: 1, color: colors.accent.gold }}>⬇ Export</KageText>
              </View>
              <View onTouchEnd={handleImport} style={{
                flex: 1, paddingVertical: 10, borderRadius: 8,
                backgroundColor: colors.glass.medium, borderWidth: 1, borderColor: colors.glass.border,
                alignItems: 'center',
              }}>
                <KageText variant="bodyBold" style={{ fontSize: 10, letterSpacing: 1, color: colors.accent.primary }}>⬆ Import</KageText>
              </View>
            </View>
            {exportStatus && (
              <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 9, textAlign: 'center', marginTop: 6 }}>
                {exportStatus}
              </KageText>
            )}
          </View>

          <KageButton title="CLOSE" variant="ghost" size="sm" fullWidth onPress={() => router.back()} />

          <KageText variant="caption" align="center" color={colors.text.muted} style={{ fontSize: 8, letterSpacing: 2 }}>
            KAGE v1.0 · Server Database
          </KageText>
        </GlassContainer>
      </ScrollView>
    </ScreenContainer>
  );
}
