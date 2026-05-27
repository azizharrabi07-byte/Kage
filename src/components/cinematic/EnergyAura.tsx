import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

interface EnergyAuraProps {
  size?: number;
  color?: string;
  pulseSpeed?: number;
}

export function EnergyAura({ size = 120, color = '#CC0000' }: EnergyAuraProps) {
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <RadialGradient id="auraGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <Stop offset="50%" stopColor={color} stopOpacity="0.1" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size * 0.45} fill="url(#auraGrad)" />
    </Svg>
  );
}