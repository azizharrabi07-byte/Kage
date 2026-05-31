import { Tabs } from 'expo-router';
import { View, StyleSheet, LayoutAnimation, Platform, UIManager, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { KageText } from '@/components/ui/KageText';
import { useColors } from '@/theme';
import { playSound } from '@/utils/sound';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

const tabs = [
  { name: 'index', title: 'Home', icon: '▣' },
  { name: 'diet', title: 'Diet', icon: '🍽' },
  { name: 'feed', title: 'Feed', icon: '✉' },
  { name: 'sensei', title: 'Sensei', icon: '⟡' },
  { name: 'workout', title: 'Train', icon: '⚡' },
  { name: 'profile', title: 'Soul', icon: '◎' },
];

const transition = {
  duration: 300,
  create: { type: 'easeInEaseOut' as const, property: 'opacity' as const },
  update: { type: 'easeInEaseOut' as const },
  delete: { type: 'easeInEaseOut' as const, property: 'opacity' as const },
};

export default function TabLayout() {
  const colors = useColors();
  const { isMobile, isTablet, isDesktop, isWide, width } = useResponsive();
  const indicatorOffset = useSharedValue(0);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(indicatorOffset.value, { damping: 15, stiffness: 120 }) }],
  }));

  function updateIndicator(tabIndex: number) {
    'worklet';
    indicatorOffset.value = tabIndex * 20; // adjusted for 5 tabs
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: isDesktop ? 95 : 85, borderTopWidth: 1,
          borderTopColor: colors.glass.border,
          backgroundColor: colors.bg.primary,
          paddingBottom: isDesktop ? 28 : 22, paddingTop: isDesktop ? 14 : 10,
          maxWidth: isDesktop ? 800 : undefined,
          alignSelf: isDesktop ? 'center' : undefined,
          borderRadius: isDesktop ? 20 : 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          marginHorizontal: isDesktop ? 'auto' : 0,
        },
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarShowLabel: false,
      }}
      screenListeners={{
        tabPress: (e) => {
          LayoutAnimation.configureNext(transition);
          const idx = tabs.findIndex(t => t.name === e.target?.split?.('-')?.[0]);
          if (idx >= 0) updateIndicator(idx);
          playSound('tab_switch');
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                <KageText variant="body" style={{ fontSize: isDesktop ? 22 : 18, opacity: focused ? 1 : 0.4, color: focused ? colors.accent.cyan : colors.text.muted }}>{tab.icon}</KageText>
                <Animated.View style={focused ? [styles.activeDot, { backgroundColor: colors.accent.cyan, shadowColor: colors.accent.cyanGlow, shadowOpacity: 0.8, shadowRadius: 6 }] : undefined} />
                <KageText
                  variant="bodyBold"
                  color={focused ? colors.accent.cyan : colors.text.muted}
                  style={{
                    fontSize: isDesktop ? 11 : 9, letterSpacing: 1.5, textTransform: 'uppercase',
                    opacity: focused ? 1 : 0.5,
                    marginTop: 2,
                  }}
                >
                  {tab.title}
                </KageText>
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center', gap: 1 },
  activeDot: { width: 18, height: 2, borderRadius: 1 },
});
