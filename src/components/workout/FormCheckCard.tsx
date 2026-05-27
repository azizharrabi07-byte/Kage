import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { KageText } from '@/components/ui/KageText';
import { useColors, spacing } from '@/theme';
import { getFormChecks, type FormCheck } from '@/constants/formChecks';

interface FormCheckCardProps {
  exerciseName: string;
  setNumber: number;
  results: Record<string, boolean>;
  onChange: (id: string, value: boolean) => void;
  onDone: () => void;
  programStyle?: string;
}

const PRIORITY_LABELS: Record<string, string> = { critical: '●', important: '○', refinement: '·' };
const PRIORITY_COLORS: Record<string, string> = {};

export function FormCheckCard({ exerciseName, setNumber, results, onChange, onDone, programStyle }: FormCheckCardProps) {
  const colors = useColors();
  const checks = getFormChecks(exerciseName);
  const checkedCount = Object.values(results).filter(Boolean).length;
  const allChecked = checkedCount === checks.length;
  const hasFailures = Object.values(results).some(v => v === false);
  const critIssues = checks.filter(c => c.priority === 'critical' && results[c.id] === false).length;

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={{ marginBottom: 12 }}>
      <GlassContainer padding={spacing.md} intensity="heavy" style={{ borderRadius: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: 7.5, textTransform: 'uppercase' }}>
              Form Check · Set {setNumber}
            </KageText>
            {critIssues > 0 && (
              <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: 'rgba(255,26,26,0.15)' }}>
                <KageText variant="caption" color={colors.status.danger} style={{ fontSize: 7, letterSpacing: 1 }}>
                  {critIssues} CRITICAL
                </KageText>
              </View>
            )}
          </View>
          <KageText variant="caption" style={{ fontSize: 8, color: hasFailures ? colors.status.danger : colors.text.muted }}>
            {checkedCount}/{checks.length}
          </KageText>
        </View>

        {checks.map((check) => {
          const val = results[check.id];
          const isCritical = check.priority === 'critical' && val === false;
          return (
            <View key={check.id} style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              paddingVertical: 5, paddingHorizontal: 4,
              backgroundColor: isCritical ? 'rgba(255,26,26,0.06)' : 'transparent',
              borderRadius: 4,
            }}>
              <View style={{
                width: 24, height: 24, borderRadius: 6,
                borderWidth: 2,
                borderColor: val === true ? colors.status.ready : val === false ? colors.status.danger :
                  isCritical ? colors.status.danger : colors.glass.border,
                backgroundColor: val === true ? colors.status.ready : 'transparent',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {val === true && <KageText variant="mono" color="#FFFFFF" style={{ fontSize: 12 }}>✓</KageText>}
                {val === false && <KageText variant="mono" color={colors.status.danger} style={{ fontSize: 10 }}>✗</KageText>}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <KageText variant="caption" style={{
                    fontSize: 7, letterSpacing: 1,
                    color: check.priority === 'critical' ? colors.status.danger :
                      check.priority === 'important' ? colors.accent.gold : colors.text.muted,
                  }}>
                    {PRIORITY_LABELS[check.priority] || '·'}
                  </KageText>
                  <KageText variant="body" style={{ fontSize: 11, color: colors.text.secondary, flex: 1 }}>{check.question}</KageText>
                </View>
                {check.cue && (
                  <KageText variant="caption" style={{ fontSize: 7.5, color: colors.text.muted, opacity: 0.5, marginTop: 2 }}>
                    {check.cue}
                  </KageText>
                )}
              </View>
              {val !== undefined && (
                <View
                  onTouchEnd={() => onChange(check.id, undefined as any)}
                  style={{ paddingHorizontal: 4, paddingVertical: 4 }}
                >
                  <KageText variant="caption" style={{ fontSize: 8, color: colors.text.muted }}>CLR</KageText>
                </View>
              )}
              {val === undefined && (
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <View onTouchEnd={() => onChange(check.id, true)} style={{
                    width: 22, height: 22, borderRadius: 4,
                    backgroundColor: colors.status.ready, opacity: 0.3,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <KageText variant="mono" color="#FFF" style={{ fontSize: 10 }}>✓</KageText>
                  </View>
                  <View onTouchEnd={() => onChange(check.id, false)} style={{
                    width: 22, height: 22, borderRadius: 4,
                    backgroundColor: colors.status.danger, opacity: 0.3,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <KageText variant="mono" color="#FFF" style={{ fontSize: 10 }}>✗</KageText>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        <View
          onTouchEnd={onDone}
          style={{
            marginTop: 8, paddingVertical: 8, borderRadius: 8,
            backgroundColor: allChecked ? colors.status.ready : critIssues > 0 ? colors.status.danger : colors.accent.primary,
            alignItems: 'center',
          }}
        >
          <KageText variant="bodyBold" style={{ fontSize: 10, letterSpacing: 2, color: '#FFFFFF' }}>
            {allChecked ? '✓ ALL CHECKS PASSED' : critIssues > 0 ? `✗ ${critIssues} CRITICAL — REVIEW` : 'DONE — LOG FORM'}
          </KageText>
        </View>
      </GlassContainer>
    </Animated.View>
  );
}
