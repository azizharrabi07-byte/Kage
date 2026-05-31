import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { KageText } from '@/components/ui/KageText';
import { useColors } from '@/theme';

interface BarData {
  label: string;
  value: number;
}

interface KageBarChartProps {
  data: BarData[];
  title?: string;
  height?: number;
  color?: string;
  yAxisLabel?: string;
}

export function KageBarChart({
  data,
  title,
  height = 160,
  color,
  yAxisLabel,
}: KageBarChartProps) {
  const rawColors = useColors();
  const colors = rawColors || {
    text: { primary: '#FFFFFF', muted: '#AAAAAA' },
    accent: { primary: '#00F5D4', neon: '#00F5D4', gold: '#FFD700' },
    background: { primary: '#0A0A0A' },
    glass: { border: '#333333' }
  };
  const barColor = color || colors.accent.neon;

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <KageText variant="caption" color={colors.text.muted} align="center">
          No data
        </KageText>
      </View>
    );
  }

  const width = 320;
  const padding = { top: 16, right: 16, bottom: 28, left: 36 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value)) * 1.15 || 1;
  const barWidth = (chartWidth / data.length) * 0.65;
  const gap = (chartWidth / data.length) * 0.35;

  return (
    <View style={styles.wrapper}>
      {title && (
        <KageText variant="h4" color={colors.text.primary} style={{ marginBottom: 8 }}>
          {title}
        </KageText>
      )}

      <Svg width={width} height={height}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding.left + index * (barWidth + gap) + gap / 2;
          const y = padding.top + chartHeight - barHeight;

          return (
            <React.Fragment key={index}>
              {/* Bar */}
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={barColor}
                rx="4"
                opacity={0.9}
              />
              {/* Value on top */}
              <SvgText
                x={x + barWidth / 2}
                y={y - 6}
                fontSize="11"
                fill={colors.text.primary}
                textAnchor="middle"
                fontWeight="600"
              >
                {Math.round(item.value)}
              </SvgText>
              {/* Label */}
              <SvgText
                x={x + barWidth / 2}
                y={height - 8}
                fontSize="10"
                fill={colors.text.muted}
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      {yAxisLabel && (
        <KageText variant="caption" color={colors.text.muted} align="center" style={{ marginTop: 2 }}>
          {yAxisLabel}
        </KageText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});