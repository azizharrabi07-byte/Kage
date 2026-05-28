import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { useColors, spacing } from '@/theme';
import { workoutTemplates } from '@/constants/workouts';
import { savePlayerProgram } from '@/store/programStore';

interface CustomPlanCreatorProps {
  onClose: () => void;
  onSave?: () => void;
}

export function CustomPlanCreator({ onClose, onSave }: CustomPlanCreatorProps) {
  const colors = useColors();
  const [planName, setPlanName] = useState('My Custom Path');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [restDays, setRestDays] = useState([5, 6]);
  
  // Max upgrade: Exercise -> Day assignment
  const [exerciseDays, setExerciseDays] = useState<Record<string, number[]>>({}); // exercise -> array of days (0-6)

  const allExercises = workoutTemplates.flatMap(w => w.exercises.map(e => e.name));

  const toggleExercise = (name: string) => {
    if (selectedExercises.includes(name)) {
      setSelectedExercises(selectedExercises.filter(e => e !== name));
      const newDays = { ...exerciseDays };
      delete newDays[name];
      setExerciseDays(newDays);
    } else {
      setSelectedExercises([...selectedExercises, name]);
      // Default to Day 1
      setExerciseDays(prev => ({ ...prev, [name]: [0] }));
    }
  };

  const toggleExerciseOnDay = (exercise: string, day: number) => {
    const current = exerciseDays[exercise] || [];
    if (current.includes(day)) {
      setExerciseDays(prev => ({ ...prev, [exercise]: current.filter(d => d !== day) }));
    } else {
      setExerciseDays(prev => ({ ...prev, [exercise]: [...current, day].sort() }));
    }
  };

  const toggleRestDay = (day: number) => {
    if (restDays.includes(day)) {
      setRestDays(restDays.filter(d => d !== day));
    } else {
      setRestDays([...restDays, day].sort());
    }
  };

  const handleSave = async () => {
    if (selectedExercises.length === 0) return;

    // MAX UPGRADE: Rich custom plan with per-exercise day assignment
    const customProgram = {
      id: 'custom-' + Date.now(),
      name: planName,
      style: 'mixed' as const,
      difficulty: 'intermediate' as const,
      daysPerWeek,
      xpMultiplier: 1.1,
      description: 'Your personal warrior path — fully customized',
      exercises: selectedExercises.map(name => ({
        name,
        sets: 3,
        reps: '6-12',
        rest: 90,
        assignedDays: exerciseDays[name] || [0], // Which days this exercise lives on
      })),
      restDays,
      isCustom: true,
    };

    await savePlayerProgram({
      programId: customProgram.id,
      currentWeek: 1,
      currentDay: 1,
      startedAt: Date.now(),
      completedDays: [],
      isActive: true,
      swaps: {},
      customData: customProgram,
    } as any);

    onSave?.();
    onClose();
  };

  return (
    <GlassContainer intensity="heavy" padding={spacing.lg} style={{ maxHeight: '90%' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KageText variant="h3" letterSpacing={2} align="center" style={{ marginBottom: spacing.md }}>
          BUILD YOUR OWN PATH
        </KageText>

        <KageText variant="caption" color={colors.accent.gold} style={{ marginBottom: 6 }}>PLAN NAME</KageText>
        <TextInput
          value={planName}
          onChangeText={setPlanName}
          style={{
            backgroundColor: colors.glass.light,
            color: colors.text.primary,
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.glass.border,
            marginBottom: spacing.md,
            fontSize: 16,
          }}
        />

        <KageText variant="caption" color={colors.accent.gold} style={{ marginBottom: 6 }}>CHOOSE EXERCISES ({selectedExercises.length} selected)</KageText>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.md }}>
          {allExercises.slice(0, 20).map(ex => (
            <TouchableOpacity
              key={ex}
              onPress={() => toggleExercise(ex)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: selectedExercises.includes(ex) ? colors.accent.primary : colors.glass.light,
                borderWidth: 1,
                borderColor: selectedExercises.includes(ex) ? colors.accent.primary : colors.glass.border,
              }}
            >
              <KageText style={{ fontSize: 11, color: selectedExercises.includes(ex) ? '#fff' : colors.text.primary }}>
                {ex}
              </KageText>
            </TouchableOpacity>
          ))}
        </View>

        {/* MAX UPGRADE: Per-exercise day assignment */}
        {selectedExercises.length > 0 && (
          <View style={{ marginBottom: spacing.lg }}>
            <KageText variant="caption" color={colors.accent.gold} style={{ marginBottom: 8 }}>
              ASSIGN EXERCISES TO DAYS (tap days below each exercise)
            </KageText>
            {selectedExercises.map(ex => (
              <View key={ex} style={{ marginBottom: 10 }}>
                <KageText variant="body" style={{ marginBottom: 4 }}>{ex}</KageText>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {[0,1,2,3,4,5,6].map(day => {
                    const isSelected = (exerciseDays[ex] || []).includes(day);
                    const dayLabel = ['S','M','T','W','T','F','S'][day];
                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleExerciseOnDay(ex, day)}
                        style={{
                          width: 28, height: 28, borderRadius: 14,
                          backgroundColor: isSelected ? colors.accent.gold : colors.glass.light,
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <KageText style={{ fontSize: 10, color: isSelected ? '#000' : colors.text.primary }}>
                          {dayLabel}
                        </KageText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}

        <KageText variant="caption" color={colors.accent.gold} style={{ marginBottom: 6 }}>TRAINING DAYS PER WEEK</KageText>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: spacing.md }}>
          {[3,4,5,6].map(d => (
            <TouchableOpacity key={d} onPress={() => setDaysPerWeek(d)} style={{
              padding: 8, borderRadius: 8,
              backgroundColor: daysPerWeek === d ? colors.accent.gold : colors.glass.light,
            }}>
              <KageText style={{ color: daysPerWeek === d ? '#000' : colors.text.primary }}>{d} days</KageText>
            </TouchableOpacity>
          ))}
        </View>

        <KageText variant="caption" color={colors.accent.gold} style={{ marginBottom: 6 }}>REST DAYS (tap to toggle)</KageText>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: spacing.lg }}>
          {['S','M','T','W','T','F','S'].map((day, index) => (
            <TouchableOpacity key={index} onPress={() => toggleRestDay(index)} style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: restDays.includes(index) ? colors.status.ready : colors.glass.light,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <KageText style={{ fontSize: 12, color: restDays.includes(index) ? '#000' : colors.text.primary }}>{day}</KageText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <KageButton title="CANCEL" variant="ghost" onPress={onClose} style={{ flex: 1 }} />
          <KageButton 
            title="SAVE MY PATH" 
            variant="gold" 
            onPress={handleSave} 
            style={{ flex: 1 }} 
            disabled={selectedExercises.length === 0}
          />
        </View>

        <KageText variant="caption" align="center" color={colors.text.muted} style={{ marginTop: spacing.md, fontSize: 9 }}>
          Your plan will appear in the Programs section. You are the master of your path.
        </KageText>
      </ScrollView>
    </GlassContainer>
  );
}