import React from 'react';
import { View } from 'react-native';
import { KageText } from '@/components/ui/KageText';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { useColors, spacing } from '@/theme';

interface CalendarHeatmapProps {
  workoutDates: string[]; // 'YYYY-MM-DD' format
}

export function CalendarHeatmap({ workoutDates }: CalendarHeatmapProps) {
  const colors = useColors();
  const today = new Date();
  const dateSet = new Set(workoutDates);

  // Generate last 12 weeks of calendar data
  const weeks: { date: Date; active: boolean }[][] = [];
  const start = new Date(today);
  start.setDate(start.getDate() - 83); // 12 weeks back
  // Go back to Sunday
  start.setDate(start.getDate() - start.getDay());

  for (let w = 0; w < 12; w++) {
    const week: { date: Date; active: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(date.getDate() + w * 7 + d);
      const key = date.toISOString().slice(0, 10);
      week.push({ date, active: dateSet.has(key) });
    }
    weeks.push(week);
  }

  const dayLabels = ['', 'M', '', 'W', '', 'F', ''];

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', gap: 3 }}>
        {/* Day labels */}
        <View style={{ gap: 3, marginRight: 4, justifyContent: 'space-around' }}>
          {dayLabels.map((l, i) => (
            <View key={i} style={{ width: 14, height: 14, justifyContent: 'center', alignItems: 'center' }}>
              {l ? <KageText variant="caption" style={{ fontSize: 6, color: colors.text.muted }}>{l}</KageText> : null}
            </View>
          ))}
        </View>
        {/* Grid */}
        <View style={{ flexDirection: 'row', gap: 3 }}>
          {weeks.map((week, wi) => (
            <View key={wi} style={{ gap: 3 }}>
              {week.map((day, di) => {
                const isToday = day.date.toDateString() === today.toDateString();
                return (
                  <View
                    key={di}
                    style={{
                      width: 14, height: 14, borderRadius: 3,
                      backgroundColor: isToday
                        ? colors.accent.primary
                        : day.active
                          ? colors.accent.neon
                          : colors.glass.border,
                      opacity: day.active ? 0.6 : 0.15,
                      borderWidth: isToday ? 1 : 0,
                      borderColor: isToday ? colors.accent.gold : 'transparent',
                    }}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
        <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: colors.glass.border, opacity: 0.15 }} />
        <KageText variant="caption" style={{ fontSize: 6, color: colors.text.muted }}>Rest</KageText>
        <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: colors.accent.neon, opacity: 0.4 }} />
        <KageText variant="caption" style={{ fontSize: 6, color: colors.text.muted }}>Train</KageText>
        <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: colors.accent.primary }} />
        <KageText variant="caption" style={{ fontSize: 6, color: colors.text.muted }}>Today</KageText>
      </View>
    </View>
  );
}