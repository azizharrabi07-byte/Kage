import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, ScrollView, TextInput, Animated as RNAnimated, LayoutAnimation, Platform, UIManager, useWindowDimensions, TouchableOpacity } from 'react-native';
import AnimatedView, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { MealLogger } from '@/components/nutrition/MealLogger';
import { KageLineChart, KageBarChart, KageRadarChart } from '@/components/charts';
import { CalendarHeatmap } from '@/components/recovery/CalendarHeatmap';
import { useColors, useTheme, spacing } from '@/theme';
import { useAuth } from '@/auth/AuthContext';
import { getProgression } from '@/store/progressionStore';
import { getWorkoutHistory, getWeeklyVolumeData, getStrengthProgressData } from '@/store/workoutStore';
import { getFeed, likePost, addComment, type Post } from '@/store/socialStore';
import { getDayTotals, type DayTotals } from '@/store/nutritionStore';
import { getPRs, getExerciseHistory, type PRRecord } from '@/store/prStore';
import { calculateMacros } from '@/constants/nutritionGoals';
import type { PlayerProgression } from '@/components/progression/types';
import type { WorkoutSession } from '@/store/types';

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

function useResponsive() {
  const { width } = useWindowDimensions();
  const isMobile = width < BREAKPOINTS.tablet;
  const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
  const isDesktop = width >= BREAKPOINTS.desktop;
  const isWide = width >= BREAKPOINTS.wide;
  
  return { isMobile, isTablet, isDesktop, isWide, width };
}

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
  const rawColors = useColors();
  const colors = rawColors || {
    accent: { primary: '#00F5D4', neon: '#00F5D4', gold: '#FFD700' },
    text: { primary: '#FFFFFF', muted: '#AAAAAA', secondary: '#CCCCCC' },
    glass: { border: '#333333', medium: '#1A1A1A', light: '#222222' },
    background: { primary: '#0A0A0A' },
    status: { ready: '#00FF88', recovery: '#FFAA00' }
  };
  const { mode, toggleTheme } = useTheme();
  const router = useRouter();
  const { isMobile, isTablet, isDesktop, isWide, width } = useResponsive();
  const { signIn, user } = useAuth();
  const [prog, setProg] = useState<PlayerProgression | null>(null);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [nutritionTotals, setNutritionTotals] = useState<DayTotals | null>(null);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [strengthData, setStrengthData] = useState<any[]>([]);
  const [prs, setPrs] = useState<Record<string, PRRecord>>({});
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [exerciseHistory, setExerciseHistory] = useState<any[]>([]);
  const [showMealLogger, setShowMealLogger] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  useFocusEffect(useCallback(() => { loadData(); }, []));

  async function loadData() {
    setProg(await getProgression());
    setHistory(await getWorkoutHistory());
    setPosts(await getFeed());
    const today = new Date().toISOString().slice(0, 10);
    setNutritionTotals(await getDayTotals(today));

    // Load chart data
    const [vol, str, prData] = await Promise.all([
      getWeeklyVolumeData(),
      getStrengthProgressData(),
      getPRs()
    ]);
    setVolumeData(vol);
    setStrengthData(str);
    setPrs(prData || {});

    // Auto-select first exercise with data for PR history
    const firstExercise = Object.keys(prData || {})[0];
    if (firstExercise) {
      setSelectedExercise(firstExercise);
      const hist = await getExerciseHistory(firstExercise);
      setExerciseHistory(hist.slice(0, 8).map((h: any, i: number) => ({
        label: `S${i+1}`,
        value: h.weight || 0
      })));
    }
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
      <ScrollView contentContainerStyle={{ 
        paddingTop: isDesktop ? 60 : 50, 
        paddingHorizontal: isDesktop ? spacing.xl * 2 : spacing.lg,
        maxWidth: isWide ? 1400 : isDesktop ? 1200 : isTablet ? 900 : undefined,
        alignSelf: isDesktop ? 'center' : undefined,
        width: '100%'
      }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <AnimatedView.View entering={FadeInDown.delay(80).duration(600)} style={{ marginBottom: 16, alignItems: 'center' }}>
          <KageText variant="caption" letterSpacing={3} color={colors.accent.gold} style={{ fontSize: isDesktop ? 10 : 8, textTransform: 'uppercase', marginBottom: 4 }}>
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

        {/* Auth Polish - Simple Login */}
        <AnimatedView.View entering={FadeInDown.delay(220).duration(600)} style={{ marginBottom: 16 }}>
          <GlassContainer padding={spacing.lg} style={{ borderRadius: 14, borderColor: colors.accent.gold, borderWidth: 1 }}>
            <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 9, letterSpacing: 2 }}>AUTH STATUS</KageText>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <KageText variant="bodyBold">{isAuthenticated ? '✅ Authenticated (real token mode)' : 'Dev mode (bypass active)'}</KageText>
              <KageButton 
                title={isAuthenticated ? "LOGOUT" : "LOGIN (SIMULATED)"} 
                variant={isAuthenticated ? "ghost" : "gold"} 
                size="sm" 
                onPress={() => {
                  if (isAuthenticated) {
                    setIsAuthenticated(false);
                  } else {
                    setShowLogin(true);
                  }
                }} 
              />
            </View>
          </GlassContainer>
        </AnimatedView.View>

        {/* Simple Login Modal */}
        <Modal visible={showLogin} transparent animationType="fade" onRequestClose={() => setShowLogin(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 }}>
            <GlassContainer padding={spacing.xl} style={{ borderRadius: 16 }}>
              <KageText variant="h3" style={{ marginBottom: 16, textAlign: 'center' }}>Sign In (Dev)</KageText>
              <TextInput
                placeholder="email@example.com"
                value={loginEmail}
                onChangeText={setLoginEmail}
                style={{ backgroundColor: colors.glass.light, color: colors.text.primary, padding: 12, borderRadius: 8, marginBottom: 12 }}
                placeholderTextColor={colors.text.muted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                placeholder="Password"
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry
                style={{ backgroundColor: colors.glass.light, color: colors.text.primary, padding: 12, borderRadius: 8, marginBottom: 12 }}
                placeholderTextColor={colors.text.muted}
              />
              <KageButton 
                title="SIGN IN WITH SUPABASE" 
                variant="primary" 
                onPress={async () => {
                  if (!loginEmail) {
                    alert('Please enter email');
                    return;
                  }
                  // TODO: Replace with proper password input field in production
                  try {
                    await signIn(loginEmail, loginPassword);
                    setShowLogin(false);
                    setLoginPassword('');
                  } catch (e: any) {
                    alert(e.message || 'Login failed');
                  }
                }} 
              />
              <KageButton title="CANCEL" variant="ghost" style={{ marginTop: 8 }} onPress={() => setShowLogin(false)} />
              <KageText variant="caption" color={colors.text.muted} style={{ textAlign: 'center', marginTop: 12, fontSize: 10 }}>
                For full Supabase auth: install @supabase/supabase-js on frontend and call signInWithPassword.
              </KageText>
              <KageText variant="caption" color={colors.text.muted} style={{ textAlign: 'center', marginTop: 4, fontSize: 9 }}>
                (Current: Dev bypass. Paste a real JWT below to test /prs etc.)
              </KageText>
            </GlassContainer>
          </View>
        </Modal>

        {/* Journey Stats */}
        <AnimatedView.View entering={FadeInDown.delay(240).duration(600)} style={{ marginBottom: 16 }}>
          <GlassContainer accentTop accentColor={colors.accent.gold} padding={isDesktop ? spacing.xl : spacing.lg} style={{ borderRadius: 14 }}>
            <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: isDesktop ? 9 : 7.5, textTransform: 'uppercase', marginBottom: 12 }}>
              Journey Stats
            </KageText>
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              gap: isDesktop ? 12 : 8,
              justifyContent: isDesktop ? 'center' : 'flex-start',
            }}>
              {stats.map((s, i) => (
                <View key={i} style={{ 
                  width: isDesktop ? '14%' : '30%', 
                  minWidth: isDesktop ? 86 : undefined,
                  alignItems: 'center', 
                  gap: 4, 
                  paddingVertical: isDesktop ? 12 : 8 
                }}>
                  <KageText variant="mono" color={s.color} style={{ fontSize: isDesktop ? 24 : 18 }}>{s.value}</KageText>
                  <KageText variant="caption" style={{ fontSize: isDesktop ? 9 : 7.5, letterSpacing: 1, color: colors.text.muted, textTransform: 'uppercase' }}>{s.label}</KageText>
                </View>
              ))}
            </View>
          </GlassContainer>
        </AnimatedView.View>

        {/* Per-Exercise PR History with Selector (Chart Polish) */}
        <AnimatedView.View entering={FadeInDown.delay(260).duration(600)} style={{ marginBottom: 16 }}>
          <GlassContainer padding={spacing.lg} style={{ borderRadius: 14 }}>
            <KageText variant="h3" style={{ marginBottom: 8 }}>PR History by Exercise</KageText>
            
            {/* Per-exercise selector (polished dropdown-style) */}
            <View style={{ marginBottom: 8 }}>
              <KageText variant="caption" color={colors.text.muted} style={{ marginBottom: 4 }}>
                Select exercise for history:
              </KageText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {Object.keys(prs).slice(0, 6).map((ex) => (
                  <TouchableOpacity
                    key={ex}
                    onPress={async () => {
                      setSelectedExercise(ex);
                      const hist = await getExerciseHistory(ex);
                      setExerciseHistory(hist.slice(0, 10).map((h: any, i: number) => ({
                        label: `S${i+1}`,
                        value: h.weight || 0
                      })));
                    }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                      backgroundColor: selectedExercise === ex ? colors.accent.neon : colors.glass.medium,
                      borderWidth: 1,
                      borderColor: selectedExercise === ex ? colors.accent.neon : colors.glass.border
                    }}
                  >
                    <KageText variant="caption" style={{ fontSize: 11, color: selectedExercise === ex ? colors.background.primary : colors.text.primary }}>
                      {ex.length > 16 ? ex.slice(0, 16) + '...' : ex}
                    </KageText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <KageLineChart
              title={selectedExercise ? `${selectedExercise} History` : "Select exercise above"}
              data={exerciseHistory.length > 0 ? exerciseHistory : [{label: 'S1', value: 0}]}
              yAxisLabel="Weight (kg)"
              height={130}
              compact
            />
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
              <View>
                <KageText variant="body" color={colors.text.muted} style={{ fontSize: 11, marginBottom: 8 }}>
                  Your clan has not heard your voice yet.
                </KageText>
                <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 10 }}>
                  Go to the FEED tab and share your first victory, question, or fire.
                </KageText>
              </View>
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
              <KageButton title="OPEN FULL DIET" variant="ghost" size="sm" onPress={() => router.push('/diet')} style={{ flex: 1 }} />
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
              <View>
                <KageText variant="body" color={colors.text.muted} style={{ fontSize: 11, marginBottom: 8 }}>
                  No meals logged today. Tracking your fuel is how you become unstoppable.
                </KageText>
                <KageButton title="📷 LOG FIRST MEAL" variant="gold" size="sm" onPress={() => setShowMealLogger(true)} />
              </View>
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
