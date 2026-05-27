import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useColors } from '@/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  safeTop?: boolean;
  safeBottom?: boolean;
}

export function ScreenContainer({
  children,
  style,
  safeTop = true,
  safeBottom = true,
}: ScreenContainerProps) {
  const colors = useColors();

  return (
    <View
      style={[
        { flex: 1, backgroundColor: colors.bg.primary },
        safeTop && { paddingTop: 50 },
        safeBottom && { paddingBottom: 30 },
        style,
      ]}
    >
      {children}
    </View>
  );
}