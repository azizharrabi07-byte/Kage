import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, ScrollView, TextInput, Animated as RNAnimated, LayoutAnimation, Platform, UIManager } from 'react-native';
import AnimatedView, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { MealLogger } from '@/components/nutrition/MealLogger';
import { useColors, useTheme, spacing } from '@/theme';
import { getProgression } from '@/store/progressionStore';
import { getWorkoutHistory } from '@/store/workoutStore';
import { getFeed, likePost, addComment, type Post } from '@/store/socialStore';
import { getDayTotals, type DayTotals } from '@/store/nutritionStore';
import { calculateMacros } from '@/constants/nutritionGoals';
import type { PlayerProgression } from '@/components/progression/types';
import type { WorkoutSession } from '@/store/types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ACHIEVEMENTS = [
  { id: '1', title: 'First Blood', desc: 'Complete your first workout', icon: '⚔', unlocked: false },
  { id: '2', title: 'Shadow Warrior', desc: '7-day streak', icon: '🌑', unlocked: false },
  { id: '3', title: 'Iron Will', desc: 'Complete 30 workouts', icon: '🛡', unlocked: false },
  { id: '4', title: 'Rising Sun', desc: 'Reach rank 4', icon: '☀', unlocked: false },
  { id: '5', title: 'Dragon Slayer', desc: 'Set 5 PRs', icon: '🐉', unlocked: false },
  { id: '6', title: 'Sage', desc: 'Apprentice rank', icon: '📜', unlocked: false },
  { id: '7', title: 'Sensei', desc: 'Reach rank 6', icon: '🏯', unlocked: false },
  { id: '8', title: 'Century', desc: '100 total sets', icon: '💯', unlocked: false },
];

interface ExpandableSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function ExpandableSection({ title, icon, children, defaultOpen = false }: ExpandableSectionProps) {
  const colors = useColors();
  const [open, setOpen] = useState(defaultOpen);
  const animHeight = useRef(new RNAnimated.Value(defaultOpen ? 1 : 0)).current;

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  }

  return (
    <GlassContainer accentTop accentColor={colors.accent.gold} padding={spacing.lg} style={{ borderRadius: 14, marginBottom: spacing.md }}>
      <View onTouchEnd={toggle} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <KageText variant="body" style={{ fontSize: 16 }}>{icon}</KageText>
        <KageText variant="bodyBold" color={colors.text.primary} style={{ fontSize: 13, letterSpacing: 1.5, flex: 1 }}>{title}</KageText>
        <KageText variant="mono" color={colors.text.muted} style={{ fontSize: 12 }}>{open ? '▾' : '▸'}</KageText>
      </View>
      {open && <View style={{ marginTop: spacing.md }}>{children}</View>}
    </GlassContainer>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const { mode, toggleTheme } = useTheme();
  const router = useRouter();
  const [prog, setProg] = useState<PlayerProgression | null>(null);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [nutritionTotals, setNutritionTotals] = useState<DayTotals | null>(null);
  const [showMealLogger, setShowMealLogger] = useState(false);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  useFocusEffect(useCallback(() => { loadData(); }, []));

  async function loadData() {
    setProg(await getProgression());
    setHistory(await getWorkoutHistory());
    setPosts(await getFeed());
    const today = new Date().toISOString().slice(0, 10);
    setNutritionTotals(await getDayTotals(today));
  }

  const stats = [
    { label: 'Total XP', value: prog?.totalXP ?? 0, color: colors.accent.gold },
    { label: 'Level', value: prog?.level ?? 1, color: colors.status.recovery },
    { label: 'Workouts', value: prog?.workoutsCompleted ?? 0, color: colors.accent.primary },
    { label: 'Streak', value: prog?.streak ?? 0, color: colors.status.ready },
    { label: 'Lock-In', value: prog?.lockInSessions ?? 0, color: colors.accent.neon },
    { label: 'Rank', value: (prog?.rankIndex ?? 0) + 1, color: colors.accent.gold },
  ];

  const attrs = [
    { label: 'Strength', value: prog?.xpMap?.strength ?? 0, color: colors.accent.primary },
    { label: 'Discipline', value: prog?.xpMap?.discipline ?? 0, color: colors.status.ready },
    { label: 'Endurance', value: prog?.xpMap?.endurance ?? 0, color: colors.accent.gold },
    { label: 'Focus', value: prog?.xpMap?.focus ?? 0, color: colors.status.recovery },
    { label: 'Recovery', value: prog?.xpMap?.recovery ?? 0, color: colors.accent.neon },
  ];

  const maxAttr = Math.max(...attrs.map(a => a.value), 1);
  const goals = nutritionTotals ? calculateMacros(75) : null;

  async function handleLike(postId: string) {
    const feed = await likePost(postId, 'kage_warrior');
    setPosts(feed);
  }

  async function handleComment(postId: string) {
    const text = commentText[postId]?.trim();
    if (!text) return;
    await addComment(postId, 'kage_warrior', 'Warrior', text);
    setCommentText(prev => ({ ...prev, [postId]: '' }));
    setPosts(await getFeed());
  }

  if (showMealLogger) {
    return (
      <ScreenContainer>
        <ScrollView contentContainerStyle={{ paddingTop: 50, paddingHorizontal: spacing.lg }}>
          <MealLogger
            onComplete={() => { setShowMealLogger(false); loadData(); }}
            onClose={() => setShowMealLogger(false)}
          />
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingTop: 50, paddingHorizontal: spacing.lg }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <AnimatedView.View entering={FadeInDown.delay(80).duration(600)} style={{ marginBottom: 16, alignItems: 'center' }}>
          <KageText variant="caption" letterSpacing={3} color={colors.accent.gold} style={{ fontSize: 8, textTransform: 'uppercase', marginBottom: 4 }}>
            The story of a warrior
          </KageText>
          <KageText variant="h3" letterSpacing={4}>SOUL</KageText>
        </AnimatedView.View>

        <AnimatedView.View entering={FadeInDown.delay(160).duration(600)} style={{ marginBottom: 16 }}>
          <GlassContainer accentTop accentColor={colors.accent.primary} padding={spacing.xxl} style={{ borderRadius: 14, alignItems: 'center', gap: 12 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: colors.accent.primary, backgroundColor: colors.glass.medium, alignItems: 'center', justifyContent: 'center' }}>
              <KageText variant="kanji" style={{ fontSize: 32, color: colors.accent.primary }}>魂</KageText>
            </View>
            <KageText variant="h3" letterSpacing={4}>WARRIOR</KageText>
            <KageText variant="caption" letterSpacing={2} color={colors.text.secondary}>Shadow Disciple</KageText>
            <View style={{ paddingHorizontal: 18, paddingVertical: 6, borderRadius: 20, borderWidth: 1, backgroundColor: colors.glass.medium, borderColor: colors.glass.border }}>
              <KageText variant="mono" color={colors.accent.gold} style={{ fontSize: 14 }}>{prog?.totalXP ?? 0} XP</KageText>
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <View onTouchEnd={toggleTheme} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, borderWidth: 1, backgroundColor: colors.glass.medium, borderColor: colors.glass.border }}>
                <KageText variant="caption" color={colors.text.secondary} style={{ fontSize: 10, letterSpacing: 2 }}>
                  {mode === 'dark' ? '☀ LIGHT' : '🌙 DARK'}
                </KageText>
              </View>
              <View onTouchEnd={() => router.push('/(modals)/settings')} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, borderWidth: 1, backgroundColor: colors.glass.medium, borderColor: colors.glass.border }}>
                <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 10, letterSpacing: 2 }}>⚙ SETTINGS</KageText>
              </View>
            </View>
          </GlassContainer>
        </AnimatedView.View>

        {/* Journey Stats */}
        <AnimatedView.View entering={FadeInDown.delay(240).duration(600)} style={{ marginBottom: 16 }}>
          <GlassContainer accentTop accentColor={colors.accent.gold} padding={spacing.lg} style={{ borderRadius: 14 }}>
            <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: 7.5, textTransform: 'uppercase', marginBottom: 12 }}>
              Journey Stats
            </KageText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {stats.map((s, i) => (
                <View key={i} style={{ width: '30%', alignItems: 'center', gap: 4, paddingVertical: 8 }}>
                  <KageText variant="mono" color={s.color} style={{ fontSize: 18 }}>{s.value}</KageText>
                  <KageText variant="caption" style={{ fontSize: 7.5, letterSpacing: 1, color: colors.text.muted, textTransform: 'uppercase' }}>{s.label}</KageText>
                </View>
              ))}
            </View>
          </GlassContainer>
        </AnimatedView.View>

        {/* Attributes */}
        {prog && (
          <AnimatedView.View entering={FadeInDown.delay(320).duration(600)} style={{ marginBottom: 16 }}>
            <GlassContainer accentTop accentColor={colors.accent.primary} padding={spacing.lg} style={{ borderRadius: 14 }}>
              <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: 7.5, textTransform: 'uppercase', marginBottom: 12 }}>
                Attributes
              </KageText>
              {attrs.map(a => (
                <View key={a.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <KageText variant="caption" style={{ width: 60, fontSize: 10, color: colors.text.secondary }}>{a.label}</KageText>
                  <View style={{ flex: 1, height: 4, backgroundColor: colors.glass.border, borderRadius: 2, overflow: 'hidden' }}>
                    <View style={{ width: `${(a.value / maxAttr) * 100}%`, height: '100%', backgroundColor: a.color, borderRadius: 2 }} />
                  </View>
                  <KageText variant="caption" style={{ width: 30, fontSize: 9, textAlign: 'right', color: colors.text.muted }}>{a.value}</KageText>
                </View>
              ))}
            </GlassContainer>
          </AnimatedView.View>
        )}

        {/* Expandable: Progress */}
        <AnimatedView.View entering={FadeInDown.delay(400).duration(600)}>
          <ExpandableSection title="Progress" icon="📈">
            <View style={{ gap: spacing.md }}>
              {/* Achievement grid */}
              <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 8, letterSpacing: 1.5, marginBottom: spacing.sm }}>
                ACHIEVEMENTS
              </KageText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {ACHIEVEMENTS.map(a => (
                  <View key={a.id} style={{
                    width: '48%', padding: spacing.sm, borderRadius: 8,
                    backgroundColor: colors.glass.light, borderWidth: 1, borderColor: colors.glass.borderLight,
                    opacity: a.unlocked ? 1 : 0.4,
                  }}>
                    <KageText variant="body" style={{ fontSize: 16, marginBottom: 2 }}>{a.icon}</KageText>
                    <KageText variant="bodyBold" style={{ fontSize: 10, color: colors.text.primary }}>{a.title}</KageText>
                    <KageText variant="caption" style={{ fontSize: 8, color: colors.text.muted }}>{a.desc}</KageText>
                  </View>
                ))}
              </View>

              {/* Timeline */}
              <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 8, letterSpacing: 1.5, marginTop: spacing.md, marginBottom: spacing.sm }}>
                WORKOUT TIMELINE
              </KageText>
              {history.length === 0 ? (
                <KageText variant="body" color={colors.text.muted} style={{ fontSize: 11 }}>No workouts yet</KageText>
              ) : (
                history.slice(0, 10).map((w, i) => (
                  <View key={w.id} style={{
                    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, paddingHorizontal: 4,
                    borderRadius: 8, backgroundColor: i === 0 ? 'rgba(200,16,46,0.05)' : 'transparent', marginBottom: 2,
                  }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: i === 0 ? colors.accent.primary : colors.glass.border }} />
                    <KageText variant="kanji" style={{ fontSize: 14, color: colors.accent.primary, width: 24 }}>{w.kanji}</KageText>
                    <View style={{ flex: 1 }}>
                      <KageText variant="bodyBold" style={{ fontSize: 12, color: colors.text.primary }}>{w.name}</KageText>
                      <KageText variant="caption" style={{ fontSize: 9, color: colors.text.muted }}>+{w.totalXP} XP · {w.exercises.length} exercises</KageText>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ExpandableSection>
        </AnimatedView.View>

        {/* Premium Movement Intelligence - High Impact Feature */}
        <AnimatedView.View entering={FadeInDown.delay(380).duration(600)} style={{ marginBottom: 16 }}>
          <GlassContainer accentTop accentColor={colors.accent.gold} padding={spacing.lg} style={{ borderRadius: 14 }}>
            <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: 8, textTransform: 'uppercase', marginBottom: 8 }}>
              LONG-TERM INTELLIGENCE
            </KageText>
            <KageText variant="bodyBold" style={{ fontSize: 16, marginBottom: 4 }}>Movement Report</KageText>
            <KageText variant="caption" color={colors.text.muted} style={{ marginBottom: 12 }}>
              Sensei analyzes your form patterns across sessions and gives you a premium coaching report.
            </KageText>
            <KageButton 
              title="VIEW MY MOVEMENT REPORT" 
              variant="gold" 
              size="md" 
              fullWidth 
              onPress={() => router.push('/movement-report')} 
            />
          </GlassContainer>
        </AnimatedView.View>

        {/* Expandable: Recent Activity (see full Feed tab for posting) */}
        <ExpandableSection title="Recent Feats" icon="📜">
          <View style={{ gap: spacing.sm }}>
            {posts.length === 0 ? (
              <KageText variant="body" color={colors.text.muted} style={{ fontSize: 11 }}>No posts yet. Use the new FEED tab to share messages!</KageText>
            ) : (
              posts.slice(0, 5).map(post => (
                <GlassContainer key={post.id} intensity="light" padding={spacing.md} glow="subtle">
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.glass.medium, alignItems: 'center', justifyContent: 'center' }}>
                      <KageText variant="kanji" style={{ fontSize: 14, color: colors.accent.primary }}>影</KageText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <KageText variant="bodyBold" style={{ fontSize: 11, color: colors.text.primary }}>{post.username || 'Warrior'}</KageText>
                      <KageText variant="caption" style={{ fontSize: 9, color: colors.text.muted }}>
                    {post.type} · {new Date(post.createdAt).toLocaleDateString()}
                  </KageText>
                    </View>
                  </View>
                  <KageText variant="body" style={{ fontSize: 11, color: colors.text.secondary, lineHeight: 16, marginBottom: 6 }}>{post.message}</KageText>
                  <View style={{ flexDirection: 'row', gap: spacing.md }}>
                    <View onTouchEnd={() => handleLike(post.id)} style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                      <KageText variant="body" style={{ fontSize: 12 }}>❤</KageText>
                      <KageText variant="caption" style={{ fontSize: 9, color: colors.text.muted }}>{post.likes}</KageText>
                    </View>
                    <View onTouchEnd={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))} style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                      <KageText variant="body" style={{ fontSize: 12 }}>💬</KageText>
                      <KageText variant="caption" style={{ fontSize: 9, color: colors.text.muted }}>{post.comments?.length || 0}</KageText>
                    </View>
                  </View>
                  {expandedComments[post.id] && (
                    <View style={{ marginTop: 6, gap: 4 }}>
                      {post.comments?.map((c: any, i: number) => (
                        <KageText key={i} variant="caption" style={{ fontSize: 9, color: colors.text.secondary }}>
                          <KageText variant="bodyBold" style={{ fontSize: 9, color: colors.accent.gold }}>{c.username}: </KageText>
                          {c.text}
                        </KageText>
                      ))}
                      <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                        <TextInput
                          style={{
                            flex: 1, backgroundColor: 'transparent', borderWidth: 0,
                            color: colors.text.primary, fontSize: 11,
                            borderBottomWidth: 1, borderBottomColor: colors.glass.border,
                          }}
                          placeholder="Add comment..."
                          placeholderTextColor={colors.text.muted}
                          value={commentText[post.id] || ''}
                          onChangeText={(text: string) => setCommentText(prev => ({ ...prev, [post.id]: text }))}
                          onSubmitEditing={() => handleComment(post.id)}
                        />
                      </View>
                    </View>
                  )}
                </GlassContainer>
              ))
            )}
          </View>
        </ExpandableSection>

        {/* Expandable: Eat / Nutrition */}
        <ExpandableSection title="Nutrition" icon="🍽️">
          <View style={{ gap: spacing.md }}>
            {/* Daily totals */}
            {nutritionTotals && goals && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                  <View style={{ alignItems: 'center' }}>
                    <ProgressRing value={nutritionTotals.calories} maxValue={goals.calories} size={60} color={colors.accent.gold} format="number" label="Calories" />
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <ProgressRing value={nutritionTotals.protein} maxValue={goals.protein} size={60} color={colors.accent.primary} format="number" label="Protein" />
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <ProgressRing value={nutritionTotals.carbs} maxValue={goals.carbs} size={60} color={colors.status.warning} format="number" label="Carbs" />
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <ProgressRing value={nutritionTotals.fat} maxValue={goals.fat} size={60} color={colors.status.ready} format="number" label="Fat" />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 4, marginTop: spacing.sm }}>
                  <KageButton title="📷 LOG MEAL" variant="gold" size="sm" onPress={() => setShowMealLogger(true)} style={{ flex: 1 }} />
                </View>
                {nutritionTotals.entries.length > 0 && (
                  <View style={{ gap: 4, marginTop: spacing.sm }}>
                    <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 8, letterSpacing: 1.5 }}>TODAY'S MEALS</KageText>
                    {nutritionTotals.entries.map(e => (
                      <View key={e.id} style={{
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                        paddingVertical: 4, paddingHorizontal: spacing.sm,
                        backgroundColor: colors.glass.light, borderRadius: 4,
                      }}>
                        <KageText variant="body" style={{ fontSize: 10, color: colors.text.secondary, flex: 1 }}>{e.name}</KageText>
                        <KageText variant="mono" style={{ fontSize: 9, color: colors.text.muted }}>{e.calories} cal</KageText>
                        <KageText variant="mono" style={{ fontSize: 9, color: colors.accent.primary }}>{e.protein}g</KageText>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
            {!nutritionTotals && (
              <KageButton title="📷 LOG FIRST MEAL" variant="gold" size="sm" onPress={() => setShowMealLogger(true)} />
            )}
          </View>
        </ExpandableSection>

        <KageText variant="caption" align="center" style={{ color: colors.text.muted, fontSize: 9, marginBottom: 80, letterSpacing: 3 }}>
          KAGE v1.0 · The Path of the Warrior
        </KageText>
      </ScrollView>
    </ScreenContainer>
  );
}
