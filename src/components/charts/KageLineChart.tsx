import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { KageText } from '@/components/ui/KageText';
import { useColors } from '@/theme';

interface DataPoint {
  label: string;
  value: number;
}

interface KageLineChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  color?: string;
  showDots?: boolean;
  yAxisLabel?: string;
  compact?: boolean; // For mobile: smaller labels, tighter spacing
}

export function KageLineChart({
  data,
  title,
  height = 180,
  color,
  showDots = true,
  yAxisLabel,
  compact = false,
}: KageLineChartProps) {
  const rawColors = useColors();
  const colors = rawColors || {
    text: { primary: '#FFFFFF', muted: '#AAAAAA' },
    accent: { primary: '#00F5D4', neon: '#00F5D4', gold: '#FFD700' },
    background: { primary: '#0A0A0A' },
    glass: { border: '#333333' }
  };
  const chartColor = color || colors.accent.neon;

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <KageText variant="caption" color={colors.text.muted} align="center">
          No data yet
        </KageText>
      </View>
    );
  }

  const width = compact ? 280 : 320;
  const padding = compact 
    ? { top: 12, right: 12, bottom: 22, left: 28 } 
    : { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const values = data.map(d => d.value);
  const minValue = Math.min(...values) * 0.9;
  const maxValue = Math.max(...values) * 1.1;
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = padding.left + (index / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((point.value - minValue) / range) * chartHeight;
    return { x, y, ...point };
  });

  // Create smooth line path
  const linePath = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prev = points[index - 1];
    const cpx = (prev.x + point.x) / 2;
    return `${path} Q ${cpx} ${prev.y} ${point.x} ${point.y}`;
  }, '');

  return (
    <View style={styles.wrapper}>
      {title && (
        <KageText variant="h4" color={colors.text.primary} style={{ marginBottom: 8 }}>
          {title}
        </KageText>
      )}

      <Svg width={width} height={height}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => {
          const y = padding.top + (i / 4) * chartHeight;
          return (
            <Line
              key={i}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke={colors.glass.border}
              strokeWidth="1"
              strokeOpacity={0.4}
            />
          );
        })}

        {/* Main line */}
        <Path
          d={linePath}
          fill="none"
          stroke={chartColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots + Labels */}
        {points.map((point, index) => (
          <G key={index}>
            {showDots && (
              <Circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill={colors.background.primary}
                stroke={chartColor}
                strokeWidth="3"
              />
            )}
            {/* X axis labels */}
            <SvgText
              x={point.x}
              y={height - (compact ? 6 : 8)}
              fontSize={compact ? "9" : "10"}
              fill={colors.text.muted}
              textAnchor="middle"
            >
              {point.label}
            </SvgText>
          </G>
        ))}

        {/* Y axis min/max labels */}
        <SvgText x={padding.left - 8} y={padding.top + 4} fontSize="10" fill={colors.text.muted} textAnchor="end">
          {Math.round(maxValue)}
        </SvgText>
        <SvgText x={padding.left - 8} y={height - padding.bottom + 4} fontSize="10" fill={colors.text.muted} textAnchor="end">
          {Math.round(minValue)}
        </SvgText>
      </Svg>

      {yAxisLabel && (
        <KageText variant="caption" color={colors.text.muted} align="center" style={{ marginTop: 4 }}>
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
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
  },
});