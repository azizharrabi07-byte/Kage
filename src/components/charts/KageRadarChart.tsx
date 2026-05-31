import React from 'react';
import { View } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { KageText } from '@/components/ui/KageText';
import { useColors } from '@/theme';

interface RadarData {
  label: string;
  value: number; // 0-100
}

interface KageRadarChartProps {
  data: RadarData[];
  title?: string;
  size?: number;
  compact?: boolean;
}

export function KageRadarChart({ data, title, size = 200, compact = false }: KageRadarChartProps) {
  const rawColors = useColors();
  const colors = rawColors || {
    text: { primary: '#FFFFFF', muted: '#AAAAAA' },
    accent: { primary: '#00F5D4', neon: '#00F5D4', gold: '#FFD700' },
    background: { primary: '#0A0A0A' },
    glass: { border: '#333333' }
  };
  const effectiveSize = compact ? Math.min(size, 160) : size;
  const center = effectiveSize / 2;
  const radius = effectiveSize / 2 - (compact ? 20 : 30);
  const levels = 4;

  if (!data || data.length < 3) {
    return <KageText variant="caption" color={colors.text.muted}>Not enough data for radar</KageText>;
  }

  const angleStep = (Math.PI * 2) / data.length;

  const getPoint = (value: number, index: number, r: number) => {
    const angle = -Math.PI / 2 + index * angleStep;
    const dist = (value / 100) * r;
    return {
      x: center + Math.cos(angle) * dist,
      y: center + Math.sin(angle) * dist,
    };
  };

  // Background polygons
  const backgroundPolygons = [];
  for (let l = 1; l <= levels; l++) {
    const points = data.map((_, i) => {
      const p = getPoint(100 * (l / levels), i, radius);
      return `${p.x},${p.y}`;
    }).join(' ');
    backgroundPolygons.push(
      <Polygon
        key={l}
        points={points}
        fill="none"
        stroke={colors.glass.border}
        strokeWidth="1"
        opacity={0.3}
      />
    );
  }

  // Data polygon
  const dataPoints = data.map((d, i) => {
    const p = getPoint(d.value, i, radius);
    return `${p.x},${p.y}`;
  }).join(' ');

  const labelPoints = data.map((d, i) => {
    const p = getPoint(108, i, radius); // slightly outside
    return { x: p.x, y: p.y, label: d.label, value: d.value };
  });

  return (
    <View style={{ alignItems: 'center' }}>
      {title && <KageText variant="h4" color={colors.text.primary} style={{ marginBottom: 8 }}>{title}</KageText>}
      <Svg width={effectiveSize} height={effectiveSize}>
        {backgroundPolygons}
        
        {/* Axes */}
        {data.map((_, i) => {
          const p = getPoint(100, i, radius);
          return (
            <Line
              key={i}
              x1={center} y1={center}
              x2={p.x} y2={p.y}
              stroke={colors.glass.border}
              strokeWidth="1"
              opacity={0.4}
            />
          );
        })}

        {/* Data shape */}
        <Polygon
          points={dataPoints}
          fill={colors.accent.neon}
          fillOpacity={0.2}
          stroke={colors.accent.neon}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {data.map((d, i) => {
          const p = getPoint(d.value, i, radius);
          return <Circle key={i} cx={p.x} cy={p.y} r="4" fill={colors.accent.primary} />;
        })}

        {/* Labels */}
        {labelPoints.map((lp, i) => (
          <G key={i}>
            <SvgText
              x={lp.x}
              y={lp.y}
              fontSize="10"
              fill={colors.text.primary}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {lp.label}
            </SvgText>
          </G>
        ))}
      </Svg>
    </View>
  );
}