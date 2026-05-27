import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Animated, Dimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PetalConfig {
  id: number;
  startX: number;
  startY: number;
  size: number;
  color: string;
  opacity: Animated.Value;
  translateY: Animated.Value;
  translateX: Animated.Value;
  rotate: Animated.Value;
  scaleX: Animated.Value;
  duration: number;
  delay: number;
}

interface SakuraPetalsProps {
  count?: number;
  speed?: number;
  color?: string;
}

const PETAL_COLORS = [
  'rgba(200,16,46,0.35)',
  'rgba(200,16,46,0.25)',
  'rgba(220,120,140,0.3)',
  'rgba(200,16,46,0.2)',
  'rgba(255,180,190,0.25)',
];

// Realistic sakura petal shape
const petalPath = 'M0,0 C1,-3 4,-5 6,-3 C8,-1 10,2 8,5 C6,8 3,10 0,8 C-3,10 -6,8 -8,5 C-10,2 -8,-1 -6,-3 C-4,-5 -1,-3 0,0Z';

export function SakuraPetals({ count = 8, speed = 1, color }: SakuraPetalsProps) {
  const petals = useMemo<PetalConfig[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      startX: 20 + Math.random() * (SCREEN_WIDTH - 40),
      startY: -20 - Math.random() * 60,
      size: 6 + Math.random() * 10,
      color: color || PETAL_COLORS[i % PETAL_COLORS.length],
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(-20),
      translateX: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scaleX: new Animated.Value(1),
      duration: (6000 + Math.random() * 5000) / speed,
      delay: Math.random() * 5000,
    }));
  }, [count, speed]);

  useEffect(() => {
    petals.forEach((p) => {
      const swing = () => {
        p.translateY.setValue(-20);
        p.translateX.setValue(0);
        p.rotate.setValue(0);
        p.scaleX.setValue(1);
        p.opacity.setValue(0);

        Animated.sequence([
          Animated.delay(p.delay),
          Animated.parallel([
            Animated.timing(p.opacity, {
              toValue: 0.6 + Math.random() * 0.3,
              duration: p.duration * 0.15,
              useNativeDriver: true,
            }),
            Animated.timing(p.translateY, {
              toValue: SCREEN_HEIGHT + 40,
              duration: p.duration,
              useNativeDriver: true,
            }),
            // Sway left-right while falling
            Animated.sequence([
              Animated.timing(p.translateX, {
                toValue: -20 - Math.random() * 30,
                duration: p.duration * 0.4,
                useNativeDriver: true,
              }),
              Animated.timing(p.translateX, {
                toValue: 20 + Math.random() * 30,
                duration: p.duration * 0.4,
                useNativeDriver: true,
              }),
              Animated.timing(p.translateX, {
                toValue: 0,
                duration: p.duration * 0.2,
                useNativeDriver: true,
              }),
            ]),
            // Spin while falling
            Animated.timing(p.rotate, {
              toValue: 3 + Math.random() * 2,
              duration: p.duration,
              useNativeDriver: true,
            }),
            // Occasional flutter
            Animated.sequence([
              Animated.timing(p.scaleX, {
                toValue: -1,
                duration: p.duration * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(p.scaleX, {
                toValue: 1,
                duration: p.duration * 0.3,
                useNativeDriver: true,
              }),
            ]),
            // Fade out near bottom
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: p.duration * 0.2,
              delay: p.duration * 0.75,
              useNativeDriver: true,
            }),
          ]),
        ]).start(swing);
      };
      swing();
    });
    return () => petals.forEach((p) => {
      p.opacity.stopAnimation();
      p.translateY.stopAnimation();
      p.translateX.stopAnimation();
      p.rotate.stopAnimation();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {petals.map((p) => (
        <Animated.View
          key={p.id}
          style={{
            position: 'absolute',
            left: p.startX,
            top: 0,
            width: p.size * 2,
            height: p.size * 2,
            opacity: p.opacity,
            transform: [
              { translateY: p.translateY as any },
              { translateX: p.translateX as any },
              {
                rotate: p.rotate.interpolate({
                  inputRange: [0, 1, 2, 3, 4, 5],
                  outputRange: ['0deg', '72deg', '144deg', '216deg', '288deg', '360deg'],
                }) as any,
              },
              { scaleX: p.scaleX as any },
            ],
          }}
        >
          <Svg width={p.size * 2} height={p.size * 2} viewBox="-12 -12 24 24">
            <Path
              d={petalPath}
              fill={p.color}
              opacity={0.9}
            />
            {/* Subtle vein line */}
            <Path
              d="M0,0 C1,-2 2,-1 2,0 C2,1 1,2 0,0Z"
              fill="rgba(255,255,255,0.15)"
            />
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}