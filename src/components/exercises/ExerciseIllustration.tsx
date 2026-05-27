import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { useColors } from '@/theme';
import type { MovementType } from '@/store/types';

export type MuscleTarget = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'glutes' | 'abs' | 'full';

// Normal proportionate male body — clean, simple, realistic
// Proportions: head 1, shoulders 2.2, waist 1.4, hips 1.6, legs 2.8
const BODY = {
  head: 'M150,8 C160,6 168,12 170,22 C172,32 168,40 160,44 C154,46 146,46 140,44 C132,40 128,32 130,22 C132,12 140,8 150,8Z',
  neck: 'M146,44 L147,54 L153,54 L154,44Z',
  torso: 'M146,52 L122,58 Q98,62 90,74 Q84,88 84,106 Q84,126 88,146 Q92,160 102,170 Q114,178 130,182 Q140,184 150,184 Q160,184 170,182 Q186,178 198,170 Q208,160 212,146 Q216,126 216,106 Q216,88 210,74 Q202,62 178,58 L154,52Z',
  leftArm: 'M90,74 Q80,82 76,98 Q72,116 74,136 Q76,156 80,170 Q84,178 88,182 Q92,184 94,180 Q92,172 90,160 Q86,142 86,124 Q86,106 88,92 Q90,80 94,76Z',
  rightArm: 'M210,74 Q220,82 224,98 Q228,116 226,136 Q224,156 220,170 Q216,178 212,182 Q208,184 206,180 Q208,172 210,160 Q214,142 214,124 Q214,106 212,92 Q210,80 206,76Z',
  leftLeg: 'M130,182 Q126,202 124,228 Q122,258 122,290 Q122,322 124,348 Q126,364 130,372 Q136,378 142,378 Q148,376 150,370 Q152,360 152,346 Q152,318 152,290 Q152,262 152,238 Q152,216 154,206 Q156,198 154,192 Q152,186 148,182Z',
  rightLeg: 'M170,182 Q174,202 176,228 Q178,258 178,290 Q178,322 176,348 Q174,364 170,372 Q164,378 158,378 Q152,376 150,370 Q148,360 148,346 Q148,318 148,290 Q148,262 148,238 Q148,216 146,206 Q144,198 146,192 Q148,186 152,182Z',
  leftFoot: 'M128,376 Q124,382 122,388 Q120,394 124,396 Q130,398 136,394 Q140,390 138,384 Q136,378 132,376Z',
  rightFoot: 'M172,376 Q176,382 178,388 Q180,394 176,396 Q170,398 164,394 Q160,390 162,384 Q164,378 168,376Z',
};

const BODY_KEYS = ['head', 'neck', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg', 'leftFoot', 'rightFoot'];
const FULL_BODY = Object.values(BODY).join(' ');

const MUSCLE_PATHS: Record<MuscleTarget, string[]> = {
  chest: [
    'M118,72 C132,62 146,60 158,62 C170,60 184,62 196,72 C202,84 202,100 196,112 C184,120 170,124 158,124 C146,124 132,120 122,112 C116,100 114,84 118,72Z',
    'M138,80 C146,74 152,74 160,80 C162,88 162,98 160,106 C152,110 146,110 138,106 C136,98 136,88 138,80Z',
  ],
  back: [
    'M110,66 C132,54 150,52 168,54 C190,52 208,54 220,66 C226,80 228,100 222,118 C208,112 190,108 168,110 C146,108 128,112 114,118 C108,100 104,80 110,66Z',
  ],
  shoulders: [
    'M88,68 C98,60 108,64 112,76 C110,86 102,90 94,88 C86,84 82,76 88,68Z',
    'M212,68 C202,60 192,64 188,76 C190,86 198,90 206,88 C214,84 218,76 212,68Z',
  ],
  biceps: [
    'M74,96 C82,88 86,100 86,114 C86,128 78,134 70,128 C64,120 62,106 74,96Z',
    'M226,96 C218,88 214,100 214,114 C214,128 222,134 230,128 C236,120 238,106 226,96Z',
  ],
  triceps: [
    'M72,122 C80,114 84,126 82,142 C80,156 70,160 64,152 C58,144 60,130 72,122Z',
    'M228,122 C220,114 216,126 218,142 C220,156 230,160 236,152 C242,144 240,130 228,122Z',
  ],
  legs: [
    'M124,190 C132,180 140,182 146,198 C150,216 150,240 148,262 C146,284 142,304 138,322 C134,338 132,348 130,354 L126,354 C124,348 120,338 116,322 C112,304 110,284 110,262 C108,240 110,216 114,198 C116,190 118,186 124,190Z',
    'M176,190 C168,180 160,182 154,198 C150,216 150,240 152,262 C154,284 158,304 162,322 C166,338 168,348 170,354 L174,354 C176,348 180,338 184,322 C188,304 190,284 190,262 C192,240 190,216 186,198 C184,190 182,186 176,190Z',
  ],
  glutes: [
    'M114,174 C132,164 148,162 164,164 C184,174 190,188 186,202 C176,208 162,212 150,212 C138,212 124,208 116,202 Q110,188 114,174Z',
  ],
  abs: [
    'M134,118 C144,110 156,110 166,118 C170,134 170,152 166,166 C156,172 144,172 134,166 C130,152 130,134 134,118Z',
    'M140,122 C148,116 152,116 160,122 C162,134 162,150 160,160 C152,164 148,164 140,160 C138,150 138,134 140,122Z',
  ],
  full: [FULL_BODY],
};

const MOVEMENT_ARROWS: Record<MovementType, { d: string }[]> = {
  push: [
    { d: 'M110,90 L90,65 L94,63 L114,88Z' },
    { d: 'M190,90 L210,65 L206,63 L186,88Z' },
  ],
  pull: [
    { d: 'M90,90 L110,65 L114,67 L94,92Z' },
    { d: 'M210,90 L190,65 L186,67 L206,92Z' },
  ],
  squat: [
    { d: 'M135,130 L135,165 L130,160 L140,160Z' },
    { d: 'M165,130 L165,165 L160,160 L170,160Z' },
  ],
  hinge: [
    { d: 'M150,160 L150,130 L145,135 L155,135Z' },
  ],
  lunge: [
    { d: 'M115,195 L95,215 L99,218 L119,198Z' },
    { d: 'M185,195 L205,215 L201,218 L181,198Z' },
  ],
  twist: [
    { d: 'M115,145 L95,135 L99,132 L119,142Z' },
    { d: 'M185,145 L205,135 L201,132 L181,142Z' },
  ],
  press: [
    { d: 'M140,75 L140,45 L135,50 L145,50Z' },
    { d: 'M160,75 L160,45 L155,50 L165,50Z' },
  ],
  row: [
    { d: 'M100,90 L80,85 L84,82 L104,87Z' },
    { d: 'M200,90 L220,85 L216,82 L196,87Z' },
  ],
  curl: [
    { d: 'M72,140 L57,120 L61,118 L76,138Z' },
    { d: 'M228,140 L243,120 L239,118 L224,138Z' },
  ],
  extension: [
    { d: 'M77,140 L92,120 L96,122 L81,142Z' },
    { d: 'M223,140 L208,120 L204,122 L219,142Z' },
  ],
  hold: [
    { d: 'M100,110 L100,130 L95,125 L105,125Z' },
    { d: 'M200,110 L200,130 L195,125 L205,125Z' },
  ],
  sprint: [
    { d: 'M125,210 Q115,190 105,180 L109,182 Q116,194 126,214Z' },
    { d: 'M175,210 Q185,190 195,180 L191,182 Q184,194 174,214Z' },
  ],
  slam: [
    { d: 'M150,55 L150,20 L145,30 L155,30Z' },
    { d: 'M150,175 L150,210 L145,200 L155,200Z' },
  ],
};

interface ExerciseIllustrationProps {
  target: MuscleTarget;
  movementType?: MovementType;
  size?: number;
  photo?: ImageSourcePropType;
}

export function ExerciseIllustration({ target, movementType, size = 100, photo }: ExerciseIllustrationProps) {
  const colors = useColors();
  const hl = colors.accent.neon;
  const gold = colors.accent.gold;
  const parts = MUSCLE_PATHS[target] || MUSCLE_PATHS.full;
  const arrows = movementType ? MOVEMENT_ARROWS[movementType] : [];

  return (
    <View style={{ width: size, height: size * 1.32, alignItems: 'center', justifyContent: 'center' }}>
      {photo ? (
        <Image
          source={photo}
          style={{ width: '100%', height: '100%', borderRadius: 8, opacity: 0.85 }}
          resizeMode="cover"
        />
      ) : (
      <Svg width={size} height={size * 1.32} viewBox="0 0 300 400">
        <Defs>
          <LinearGradient id="bodyFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ffffff" stopOpacity="0.10" />
            <Stop offset="0.5" stopColor="#ffffff" stopOpacity="0.03" />
            <Stop offset="1" stopColor="#ffffff" stopOpacity="0.08" />
          </LinearGradient>
          <LinearGradient id="hlGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={hl} stopOpacity="0.55" />
            <Stop offset="0.5" stopColor={hl} stopOpacity="0.20" />
            <Stop offset="1" stopColor={hl} stopOpacity="0.06" />
          </LinearGradient>
        </Defs>
        <Path d={FULL_BODY} fill="none" stroke={hl} strokeWidth={8} opacity={0.04} strokeLinejoin="round" strokeLinecap="round" transform="translate(0, 2)" />
        {BODY_KEYS.map((key) => (
          <Path key={key} d={BODY[key as keyof typeof BODY]} fill="url(#bodyFill)" stroke="#ffffff" strokeWidth={2.2} opacity={0.95} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {parts.map((d, i) => (
          <G key={i}>
            <Path d={d} fill="none" stroke={hl} strokeWidth={8} opacity={0.12} strokeLinejoin="round" />
            <Path d={d} fill="url(#hlGrad)" stroke="none" />
            <Path d={d} fill="none" stroke={hl} strokeWidth={2.5} opacity={0.9} strokeLinejoin="round" />
            <Path d={d} fill="none" stroke={gold} strokeWidth={0.5} opacity={0.2} strokeLinejoin="round" />
          </G>
        ))}
        {arrows.map((a, i) => (
          <G key={`a-${i}`}>
            <Path d={a.d} fill={colors.accent.gold} opacity={0.6} />
            <Path d={a.d} fill="none" stroke={colors.accent.gold} strokeWidth={3} opacity={0.15} />
          </G>
        ))}
      </Svg>
      )}
    </View>
  );
}

export const exerciseImgs: Record<string, MuscleTarget> = {
  'Shadow Push': 'chest',
  'Samurai Row': 'back',
  'Iron Squat': 'legs',
  'Crimson Press': 'shoulders',
  'Steel Deadlift': 'back',
  'Core Strike': 'abs',
  'Blade Curl': 'biceps',
  'Dojo Dip': 'triceps',
  'Ronin Lunge': 'legs',
  'Warrior Pull-up': 'back',
  'Oni Press': 'chest',
  'Shield Raise': 'shoulders',
  'Thunder Slam': 'full',
  'Silent Plank': 'abs',
  'Dragon Squat': 'legs',
  'Shadow Sprint': 'legs',
  'Iron Grip': 'biceps',
  'Kensei Cut': 'back',
  'Stone Lift': 'glutes',
  'Wind Strike': 'abs',
};