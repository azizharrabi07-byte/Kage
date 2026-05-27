import React from 'react';
import { View, StyleSheet } from 'react-native';
import { KageText } from '@/components/ui/KageText';
import { useColors } from '@/theme';

interface Props {
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

export function AchievementCard({ title, desc, icon, unlocked }: Props) {
  const colors = useColors();
  return (
    <View style={{
      width: '47%', borderRadius: 10,
      padding: 12, gap: 6,
      backgroundColor: unlocked ? 'rgba(76,175,80,0.06)' : colors.glass.medium,
      borderWidth: 1,
      borderColor: unlocked ? colors.status.ready : colors.glass.border,
      opacity: unlocked ? 1 : 0.5,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <KageText variant="mono" style={{ fontSize: 18 }}>{icon}</KageText>
        <View style={{ flex: 1 }}>
          <KageText variant="bodyBold" style={{ fontSize: 10, letterSpacing: 1, color: colors.text.primary }}>{title}</KageText>
          <KageText variant="caption" style={{ fontSize: 7, color: colors.text.muted }}>{desc}</KageText>
        </View>
      </View>
    </View>
  );
}
