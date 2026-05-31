import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import { KageText } from '@/components/ui/KageText';
import { useColors } from '@/theme';

interface PieSlice {
  label: string;
  value: number;
  color: string;
}

interface KagePieChartProps {
  data: PieSlice[];
  title?: string;
  size?: number;
}

export function KagePieChart({ data, title, size = 140 }: KagePieChartProps) {
  const rawColors = useColors();
  const colors = rawColors || {
    text: { primary: '#FFFFFF', muted: '#AAAAAA' },
    accent: { primary: '#00F5D4', neon: '#00F5D4', gold: '#FFD700' },
    background: { primary: '#0A0A0A' },
    glass: { border: '#333333' }
  };

  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return null;

  const radius = size / 2 - 10;
  const center = size / 2;

  let currentAngle = -90; // Start from top

  const slices = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;

    const startAngle = (currentAngle * Math.PI) / 180;
    const endAngle = ((currentAngle + angle) * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArc = angle > 180 ? 1 : 0;

    const path = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    currentAngle += angle;

    return {
      path,
      color: item.color,
      label: item.label,
      percentage: Math.round(percentage * 100),
    };
  });

  return (
    <View style={styles.container}>
      {title && (
        <KageText variant="h4" color={colors.text.primary} style={{ marginBottom: 12 }}>
          {title}
        </KageText>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
        <Svg width={size} height={size}>
          {slices.map((slice, index) => (
            <Path key={index} d={slice.path} fill={slice.color} />
          ))}
          {/* Inner circle for donut style */}
          <Path
            d={`M ${center} ${center} m -${radius * 0.55} 0 a ${radius * 0.55} ${radius * 0.55} 0 1 0 ${radius * 1.1} 0 a ${radius * 0.55} ${radius * 0.55} 0 1 0 -${radius * 1.1} 0`}
            fill={colors.background.primary}
          />
        </Svg>

        {/* Legend */}
        <View style={{ gap: 6 }}>
          {slices.map((slice, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 12, height: 12, backgroundColor: slice.color, borderRadius: 3 }} />
              <KageText variant="caption" color={colors.text.primary}>
                {slice.label} <KageText variant="caption" color={colors.text.muted}>{slice.percentage}%</KageText>
              </KageText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});