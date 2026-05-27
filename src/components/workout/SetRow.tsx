import React, { useState, useRef } from 'react';
import { View, TextInput } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { KageText } from '@/components/ui/KageText';
import { useColors } from '@/theme';
import { getFormChecks } from '@/constants/formChecks';
import type { WorkoutSet } from '@/store/types';

interface SetRowProps {
  set: WorkoutSet;
  onToggle: () => void;
  onUpdate?: (setId: string, weight: number, reps: number) => void;
  disabled?: boolean;
  exerciseName?: string;
  onCheckForm?: (setId: string) => void;
}

export function SetRow({ set, onToggle, onUpdate, disabled, exerciseName, onCheckForm }: SetRowProps) {
  const colors = useColors();
  const [editing, setEditing] = useState<'weight' | 'reps' | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<TextInput>(null);

  function startEdit(field: 'weight' | 'reps') {
    if (set.completed) return;
    setEditing(field);
    setEditValue(field === 'weight' ? String(set.weight || 0) : String(set.reps));
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function submitEdit() {
    if (!editing || !onUpdate) return;
    const val = parseInt(editValue, 10);
    if (isNaN(val) || val < 0) { setEditing(null); return; }
    onUpdate(set.id, editing === 'weight' ? val : set.weight, editing === 'reps' ? val : set.reps);
    setEditing(null);
  }

  const formResults = set.formResults || {};
  const exerciseChecks = exerciseName ? getFormChecks(exerciseName) : [];
  const expectedCheckCount = exerciseChecks.length;
  const toggledChecks = Object.keys(formResults).length;
  const passedChecks = Object.values(formResults).filter(Boolean).length;
  const formScore = expectedCheckCount > 0
    ? Math.round((passedChecks / expectedCheckCount) * 100)
    : toggledChecks > 0
      ? Math.round((passedChecks / toggledChecks) * 100)
      : 0;

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 12,
      paddingVertical: 10, paddingHorizontal: 14,
      borderRadius: 10,
      backgroundColor: set.completed ? 'rgba(0,204,136,0.06)' : colors.glass.light,
      borderWidth: 1,
      borderColor: set.completed ? 'rgba(0,204,136,0.12)' : colors.glass.borderLight,
      marginBottom: 5,
    }}>
      <View
        style={{
          width: 26, height: 26, borderRadius: 13,
          borderWidth: 2,
          borderColor: set.completed ? colors.status.ready : colors.glass.border,
          backgroundColor: set.completed ? colors.status.ready : 'transparent',
          alignItems: 'center', justifyContent: 'center',
        }}
        onTouchEnd={disabled ? undefined : onToggle}
      >
        {set.completed && <KageText variant="mono" color={colors.text.inverse} style={{ fontSize: 12 }}>✓</KageText>}
      </View>

      <KageText variant="bodyBold" style={{ fontSize: 13, flex: 1, color: colors.text.primary }}>
        Set {set.setNumber}
      </KageText>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {/* Weight */}
        <View onTouchEnd={() => startEdit('weight')}>
          {editing === 'weight' ? (
            <TextInput
              ref={inputRef}
              value={editValue}
              onChangeText={setEditValue}
              onSubmitEditing={submitEdit}
              onBlur={submitEdit}
              keyboardType="numeric"
              style={{
                color: colors.accent.primary,
                fontSize: 13,
                fontFamily: 'monospace',
                backgroundColor: colors.glass.medium,
                borderRadius: 6,
                paddingHorizontal: 6,
                paddingVertical: 2,
                minWidth: 40,
                textAlign: 'center',
                borderWidth: 1,
                borderColor: colors.accent.primary,
              }}
            />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <KageText variant="mono" style={{ fontSize: 13, color: set.weight > 0 ? colors.accent.primary : colors.text.muted }}>
                {set.weight > 0 ? set.weight : '-'}
              </KageText>
              {set.weight > 0 && (
                <KageText variant="caption" style={{ fontSize: 8, color: colors.text.muted }}>kg</KageText>
              )}
            </View>
          )}
        </View>

        {/* Reps */}
        <View onTouchEnd={() => startEdit('reps')}>
          {editing === 'reps' ? (
            <TextInput
              ref={inputRef}
              value={editValue}
              onChangeText={setEditValue}
              onSubmitEditing={submitEdit}
              onBlur={submitEdit}
              keyboardType="numeric"
              style={{
                color: colors.accent.primary,
                fontSize: 13,
                fontFamily: 'monospace',
                backgroundColor: colors.glass.medium,
                borderRadius: 6,
                paddingHorizontal: 6,
                paddingVertical: 2,
                minWidth: 40,
                textAlign: 'center',
                borderWidth: 1,
                borderColor: colors.accent.primary,
              }}
            />
          ) : (
            <KageText variant="mono" style={{ fontSize: 13, color: colors.text.secondary }}>
              {set.reps}
            </KageText>
          )}
        </View>
        <KageText variant="caption" style={{ fontSize: 8, color: colors.text.muted, letterSpacing: 1, textTransform: 'uppercase' }}>reps</KageText>
      </View>

      {set.completed && (
        <View
          onTouchEnd={() => onCheckForm?.(set.id)}
          style={{
            paddingHorizontal: 8, paddingVertical: 2,
            borderRadius: 6,
            backgroundColor: 'rgba(0,204,136,0.1)',
            borderWidth: 1,
            borderColor: 'rgba(0,204,136,0.15)',
            alignItems: 'center',
          }}
        >
          <KageText variant="caption" color={colors.status.ready} style={{ fontSize: 7, letterSpacing: 1.5 }}>
            DONE
          </KageText>
          {expectedCheckCount > 0 && (
            <KageText variant="caption" style={{
              fontSize: 6, letterSpacing: 0.5,
              color: formScore >= 75 ? colors.status.ready : formScore >= 50 ? colors.accent.gold : colors.status.danger,
            }}>
              ★ {formScore}%
            </KageText>
          )}
        </View>
      )}
    </View>
  );
}