import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { MovementReportScreen } from '@/components/progression/MovementReportScreen';
import { useColors, spacing } from '@/theme';

export default function MovementReportPage() {
  const router = useRouter();
  const colors = useColors();

  return (
    <ScreenContainer>
      <View style={{ paddingTop: 40, paddingHorizontal: spacing.lg, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <KageButton 
            title="← BACK" 
            variant="ghost" 
            size="sm" 
            onPress={() => router.back()} 
          />
          <KageText variant="h3" letterSpacing={3} style={{ marginLeft: spacing.md }}>
            MOVEMENT INTELLIGENCE
          </KageText>
        </View>

        <MovementReportScreen />
      </View>
    </ScreenContainer>
  );
}