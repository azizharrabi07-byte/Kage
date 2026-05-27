import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, Circle, G } from 'react-native-svg';
import { KageText } from '@/components/ui/KageText';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { useColors, spacing } from '@/theme';

// Single detailed unified body silhouette — bigger, proportionate, athletic
const BODY_OUTLINE = 'M150,12 C160,10 168,14 172,24 C174,34 170,44 164,48 L162,52 L174,54 Q200,58 210,72 Q218,84 220,100 Q224,120 222,144 Q220,164 216,180 Q212,194 204,204 L200,210 Q206,220 210,240 Q214,260 214,284 Q214,308 210,330 Q206,348 200,362 Q196,372 190,378 L184,384 L178,386 L172,384 Q168,378 166,368 Q164,354 164,336 Q164,310 166,286 Q168,262 168,240 Q168,220 166,206 Q164,198 162,196 L156,192 L152,186 L148,192 L138,196 Q136,198 134,206 Q132,220 132,240 Q132,262 134,286 Q136,310 136,336 Q136,354 134,368 Q132,378 128,384 L122,386 L116,384 Q110,378 106,368 Q100,348 96,330 Q92,308 90,284 Q90,260 94,240 Q98,220 104,210 L100,204 Q92,194 88,180 Q84,164 82,144 Q80,120 84,100 Q86,84 94,72 Q104,58 130,54 L138,52 L136,48 Q130,44 128,34 Q126,24 134,12 Q142,10 150,12Z';

const MUSCLE_REGIONS: { id: string; name: string; path: string; muscleGroup: string }[] = [
  { id: 'shoulders', name: 'Shoulders', path: 'M120,66 Q140,58 160,58 Q180,60 190,70 Q185,78 170,82 Q155,84 140,82 Q125,78 120,66Z', muscleGroup: 'shoulders' },
  { id: 'chest', name: 'Chest', path: 'M128,78 Q148,72 162,72 Q178,76 186,84 Q184,98 172,108 Q158,114 144,112 Q130,106 124,94 Q124,84 128,78Z', muscleGroup: 'chest' },
  { id: 'biceps_left', name: 'Biceps L', path: 'M112,64 Q104,72 100,88 Q96,106 96,120 Q98,130 104,132 Q108,130 110,122 Q112,108 112,94 Q112,80 112,64Z', muscleGroup: 'arms' },
  { id: 'biceps_right', name: 'Biceps R', path: 'M200,64 Q208,72 212,88 Q216,106 216,120 Q214,130 208,132 Q204,130 202,122 Q200,108 200,94 Q200,80 200,64Z', muscleGroup: 'arms' },
  { id: 'forearms_left', name: 'Forearm L', path: 'M96,132 Q92,144 90,158 Q90,170 94,176 Q98,178 100,172 Q102,162 102,150 Q102,138 96,132Z', muscleGroup: 'arms' },
  { id: 'forearms_right', name: 'Forearm R', path: 'M216,132 Q220,144 222,158 Q222,170 218,176 Q214,178 212,172 Q210,162 210,150 Q210,138 216,132Z', muscleGroup: 'arms' },
  { id: 'abs', name: 'Core', path: 'M140,112 Q154,106 164,108 Q174,114 176,128 Q176,144 172,160 Q168,172 160,178 Q152,180 146,178 Q138,172 134,160 Q130,144 130,128 Q130,118 140,112Z', muscleGroup: 'core' },
  { id: 'lats', name: 'Lats', path: 'M120,84 Q116,100 114,120 Q112,140 114,154 Q116,162 120,164 Q124,160 124,148 Q124,130 124,114 Q124,98 120,84Z M190,84 Q194,100 196,120 Q198,140 196,154 Q194,162 190,164 Q186,160 186,148 Q186,130 186,114 Q186,98 190,84Z', muscleGroup: 'back' },
  { id: 'glutes', name: 'Glutes', path: 'M120,168 Q140,158 160,158 Q180,164 186,176 Q184,188 172,196 Q160,200 148,198 Q136,196 128,188 Q120,178 120,168Z', muscleGroup: 'legs' },
  { id: 'quads_left', name: 'Quads L', path: 'M120,192 Q118,210 116,232 Q114,254 116,272 Q118,284 122,286 Q126,280 126,266 Q126,244 126,224 Q126,206 128,196 Q130,190 120,192Z', muscleGroup: 'legs' },
  { id: 'quads_right', name: 'Quads R', path: 'M180,192 Q182,210 184,232 Q186,254 184,272 Q182,284 178,286 Q174,280 174,266 Q174,244 174,224 Q174,206 172,196 Q170,190 180,192Z', muscleGroup: 'legs' },
  { id: 'calves_left', name: 'Calves L', path: 'M116,286 Q114,306 114,326 Q114,344 118,356 Q122,362 126,360 Q128,350 126,336 Q124,318 124,302 Q124,290 116,286Z', muscleGroup: 'legs' },
  { id: 'calves_right', name: 'Calves R', path: 'M184,286 Q186,306 186,326 Q186,344 182,356 Q178,362 174,360 Q172,350 174,336 Q176,318 176,302 Q176,290 184,286Z', muscleGroup: 'legs' },
  { id: 'traps', name: 'Traps', path: 'M118,56 Q134,48 152,46 Q170,48 186,54 Q192,60 190,66 Q186,70 176,70 Q160,68 148,68 Q136,68 126,70 Q116,70 114,64 Q114,58 118,56Z', muscleGroup: 'back' },
];

const RECOVERY_TIPS: Record<string, { tip: string; food: string; stretch: string }> = {
  shoulders: { tip: 'Roll shoulders slowly, use lacrosse ball on tight spots', food: 'Omega-3s: salmon, walnuts for joint recovery', stretch: 'Cross-body arm stretch 30s each side' },
  chest: { tip: 'Doorway stretch, light pec massage', food: 'Vitamin C: oranges, bell peppers for tissue repair', stretch: 'Doorway pec stretch 30s each side' },
  arms: { tip: 'Extend and shake out arms, light self-massage', food: 'Protein: lean meat, eggs for bicep/tricep repair', stretch: 'Tricep overhead stretch 30s each side' },
  core: { tip: 'Child\'s pose, cat-cow stretches for core', food: 'Fiber-rich foods, hydration for core recovery', stretch: 'Cat-cow stretch ×10 slow reps' },
  back: { tip: 'Child\'s pose, foam roll lats, avoid heavy loading', food: 'Magnesium: nuts, seeds for muscle relaxation', stretch: 'Child\'s pose 60s, cat-cow ×10' },
  legs: { tip: 'Elevate legs, light walking, foam roll quads', food: 'Potassium: bananas, sweet potatoes for leg recovery', stretch: 'Standing quad stretch 30s each side' },
};

function getRecoveryColor(value: number): string {
  if (value >= 80) return '#00FF88';
  if (value >= 60) return '#FFAA00';
  if (value >= 40) return '#FF6600';
  return '#FF1A1A';
}

function getRecoveryLabel(value: number): string {
  if (value >= 80) return 'Recovered';
  if (value >= 60) return 'Moderate';
  if (value >= 40) return 'Tired';
  return 'Fatigued';
}

function getRandomRecovery(): number {
  return Math.floor(Math.random() * 60) + 20;
}

interface RecoveryHeatmapProps {
  muscleData?: { id: string; recovery: number }[];
}

export function RecoveryHeatmap({ muscleData }: RecoveryHeatmapProps) {
  const colors = useColors();
  const [selected, setSelected] = useState<string | null>(null);

  const recoveryMap = new Map(muscleData?.map(d => [d.id, d.recovery]));
  const selectedRegion = selected ? MUSCLE_REGIONS.find(r => r.id === selected) : null;
  const selectedRecovery = selectedRegion && selected ? recoveryMap.get(selected) ?? getRandomRecovery() : 0;

  const getAdvice = (region: typeof selectedRegion, recovery: number) => {
    if (!region) return null;
    const tip = RECOVERY_TIPS[region.muscleGroup];
    if (!tip) return { tip: 'Rest and hydrate', food: 'Balanced meal with protein', stretch: 'Light stretching' };
    if (recovery < 40) return { ...tip, tip: `⚠ ${tip.tip} — high fatigue, consider rest day` };
    if (recovery < 60) return { ...tip, tip: `~ ${tip.tip}` };
    return { ...tip, tip: `✓ ${tip.tip} — looking good` };
  };

  const advice = getAdvice(selectedRegion, selectedRecovery);

  return (
    <View style={styles.container}>
      <Svg width="300" height="400" viewBox="0 0 300 400">
        <Defs>
          <RadialGradient id="bodyGlow" cx="50%" cy="40%" rx="35%" ry="40%">
            <Stop offset="0" stopColor={colors.accent.primary} stopOpacity="0.06" />
            <Stop offset="1" stopColor={colors.accent.primary} stopOpacity="0" />
          </RadialGradient>
          {MUSCLE_REGIONS.map((r) => (
            <RadialGradient key={`rg-${r.id}`} id={`grad-${r.id}`} cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor={getRecoveryColor(recoveryMap.get(r.id) ?? getRandomRecovery())} stopOpacity="0.30" />
              <Stop offset="1" stopColor={getRecoveryColor(recoveryMap.get(r.id) ?? getRandomRecovery())} stopOpacity="0.05" />
            </RadialGradient>
          ))}
        </Defs>

        <Circle cx="150" cy="180" r="140" fill="url(#bodyGlow)" />

        <Path d={BODY_OUTLINE} fill="none" stroke={colors.glass.border} strokeWidth={2.5} opacity={0.6} strokeLinejoin="round" />

        {MUSCLE_REGIONS.map((r) => {
          const rec = recoveryMap.get(r.id) ?? getRandomRecovery();
          const isSelected = selected === r.id;
          const fillColor = getRecoveryColor(rec);
          return (
            <G key={r.id} onPress={() => setSelected(isSelected ? null : r.id)}>
              <Path
                d={r.path}
                fill={fillColor}
                fillOpacity={isSelected ? 0.35 : 0.15}
                stroke={isSelected ? fillColor : 'transparent'}
                strokeWidth={isSelected ? 2 : 0}
                strokeOpacity={isSelected ? 0.8 : 0}
                strokeLinejoin="round"
              />
              {isSelected && (
                <Circle cx={150} cy={18} r={4} fill={fillColor} opacity={0.5} />
              )}
            </G>
          );
        })}

        {/* Labels for visible regions */}
        {MUSCLE_REGIONS.filter(r => {
          const rec = recoveryMap.get(r.id) ?? getRandomRecovery();
          return rec < 50 || selected === r.id;
        }).map((r) => {
          const rec = recoveryMap.get(r.id) ?? getRandomRecovery();
          if (selected && selected !== r.id) return null;
          return null; // no text labels on the SVG itself
        })}
      </Svg>

      {/* Legend */}
      <View style={[styles.legend, { borderColor: colors.glass.border, backgroundColor: colors.glass.light }]}>
        {[
          { label: 'Recovered', color: '#00FF88', min: 80 },
          { label: 'Moderate', color: '#FFAA00', min: 60 },
          { label: 'Tired', color: '#FF6600', min: 40 },
          { label: 'Fatigued', color: '#FF1A1A', min: 0 },
        ].map((item) => (
          <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
            <KageText variant="caption" style={{ fontSize: 7, letterSpacing: 0.5, opacity: 0.6 }}>{item.label}</KageText>
          </View>
        ))}
      </View>

      {/* Selected region details */}
      {selectedRegion && advice && (
        <View style={[styles.tooltip, { borderColor: colors.glass.border, backgroundColor: colors.glass.medium }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: getRecoveryColor(selectedRecovery) }} />
            <KageText variant="bodyBold" style={{ fontSize: 12, letterSpacing: 1, color: colors.text.primary }}>
              {selectedRegion.name}
            </KageText>
            <View style={{ flex: 1 }} />
            <KageText variant="mono" style={{ fontSize: 11, color: getRecoveryColor(selectedRecovery) }}>
              {selectedRecovery}%
            </KageText>
          </View>
          <KageText variant="body" style={{ fontSize: 9, color: colors.text.secondary, lineHeight: 13, marginBottom: 4 }}>
            {getRecoveryLabel(selectedRecovery)}
          </KageText>
          <View style={{ gap: 3 }}>
            <KageText variant="caption" style={{ fontSize: 7.5, color: colors.text.muted, lineHeight: 11 }}>
              🧘 {advice.tip}
            </KageText>
            <KageText variant="caption" style={{ fontSize: 7.5, color: colors.text.muted, lineHeight: 11 }}>
              🥗 {advice.food}
            </KageText>
            <KageText variant="caption" style={{ fontSize: 7.5, color: colors.text.muted, lineHeight: 11 }}>
              🙆 {advice.stretch}
            </KageText>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  tooltip: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
});
