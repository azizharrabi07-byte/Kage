import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withTiming, runOnJS } from 'react-native-reanimated';
import { useColors } from '@/theme';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
}

interface ParticleBurstProps {
  trigger: boolean;
  count?: number;
  colors?: string[];
  onComplete?: () => void;
}

export function ParticleBurst({ trigger, count = 12, colors: particleColors, onComplete }: ParticleBurstProps) {
  const theme = useColors();
  const [particles, setParticles] = useState<Particle[]>([]);
  const defaultColors = [theme.accent.gold, theme.accent.primary, theme.status.ready, '#FFFFFF'];

  useEffect(() => {
    if (!trigger) return;
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      color: (particleColors || defaultColors)[i % (particleColors || defaultColors).length],
      size: 4 + Math.random() * 8,
      angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
      distance: 40 + Math.random() * 80,
    }));
    setParticles(newParticles);
    if (onComplete) setTimeout(onComplete, 800);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <View style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, zIndex: 100 }}>
      {particles.map((p) => (
        <ParticleDot key={p.id} particle={p} />
      ))}
    </View>
  );
}

function ParticleDot({ particle }: { particle: Particle }) {
  const dx = Math.cos(particle.angle) * particle.distance;
  const dy = Math.sin(particle.angle) * particle.distance;

  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    tx.value = withTiming(dx, { duration: 600 });
    ty.value = withTiming(dy, { duration: 600 });
    opacity.value = withTiming(0, { duration: 600 });
    scale.value = withSpring(0.3, { damping: 8 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[{
        position: 'absolute',
        width: particle.size,
        height: particle.size,
        borderRadius: particle.size / 2,
        backgroundColor: particle.color,
      }, style]}
    />
  );
}
