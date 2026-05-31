import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { KageText } from '@/components/ui/KageText';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { useColors, spacing } from '@/theme';
import { getWorkoutHistory } from '@/store/workoutStore';

interface CalendarHeatmapProps {
  workoutDates?: string[]; // 'YYYY-MM-DD' format - if not provided, it will fetch from history
  title?: string;
  showStreak?: boolean;
}

export function CalendarHeatmap({ workoutDates: propDates, title = "Consistency", showStreak = true }: CalendarHeatmapProps) {
  const colors = useColors();
  const today = new Date();
  const [dates, setDates] = useState<string[]>(propDates || []);

  useEffect(() => {
    if (propDates) {
      setDates(propDates);
      return;
    }
    // Fetch real workout dates
    getWorkoutHistory().then((history: any[]) => {
      const uniqueDates = new Set<string>();
      history.forEach((s: any) => {
        const d = s.startedAt || s.date;
        if (d) {
          const key = new Date(d).toISOString().slice(0, 10);
          uniqueDates.add(key);
        }
      });
      setDates(Array.from(uniqueDates));
    });
  }, [propDates]);

  const dateSet = new Set(dates);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(today);
  while (true) {
    const key = checkDate.toISOString().slice(0, 10);
    if (dateSet.has(key)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <KageText variant="h4" color={colors.text.primary}>{title}</KageText>
        {showStreak && currentStreak > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <KageText variant="caption" color={colors.accent.gold}>🔥</KageText>
            <KageText variant="bodyBold" color={colors.accent.gold}>{currentStreak} day streak</KageText>
          </View>
        )}
      </View>

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