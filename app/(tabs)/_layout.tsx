import { Tabs } from 'expo-router';
import { View, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { KageText } from '@/components/ui/KageText';
import { useColors } from '@/theme';
import { playSound } from '@/utils/sound';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ── Custom icon components (View-based for native feel) ──────────────────
function HomeIcon({ size, color }: { size: number; color: string }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View style={[styles.iconSquare, { width: size * 0.7, height: size * 0.7, borderColor: color, borderWidth: 1.5 }]}>
          <View style={[styles.iconDiamond, { width: size * 0.35, height: size * 0.35, borderColor: color, borderWidth: 1.5 }]} />
        </View>
      </View>
    </View>
  );
}

function SenseiIcon({ size, color }: { size: number; color: string }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ alignItems: 'center' }}>
        <View style={[styles.iconCircle, { width: size * 0.35, height: size * 0.35, borderColor: color, borderWidth: 1.5, marginBottom: -size * 0.05 }]} />
        <View style={[styles.iconBody, { width: size * 0.65, height: size * 0.35, borderColor: color, borderWidth: 1.5, borderTopLeftRadius: size * 0.35, borderTopRightRadius: size * 0.35 }]} />
      </View>
    </View>
  );
}

function TrainIcon({ size, color }: { size: number; color: string }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ alignItems: 'center' }}>
        <View style={[styles.iconDiamondSmall, { width: size * 0.45, height: size * 0.45, backgroundColor: color, transform: [{ rotate: '45deg' }] }]} />
        <View style={{ flexDirection: 'row', marginTop: -size * 0.1, gap: size * 0.05 }}>
          <View style={{ width: size * 0.2, height: size * 0.25, borderColor: color, borderWidth: 1.5, borderTopLeftRadius: 8 }} />
          <View style={{ width: size * 0.2, height: size * 0.25, borderColor: color, borderWidth: 1.5, borderTopRightRadius: 8 }} />
        </View>
      </View>
    </View>
  );
}

function SoulIcon({ size, color }: { size: number; color: string }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={[styles.iconCircle, { width: size * 0.6, height: size * 0.6, borderColor: color, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' }]}>
        <View style={[styles.iconInner, { width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const tabs = [
  { name: 'index', title: 'Home', Icon: HomeIcon },
  { name: 'sensei', title: 'Sensei', Icon: SenseiIcon },
  { name: 'workout', title: 'Train', Icon: TrainIcon },
  { name: 'profile', title: 'Soul', Icon: SoulIcon },
];

const transition = {
  duration: 300,
  create: { type: 'easeInEaseOut' as const, property: 'opacity' as const },
  update: { type: 'easeInEaseOut' as const },
  delete: { type: 'easeInEaseOut' as const, property: 'opacity' as const },
};

export default function TabLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={({ route }) => {
        const isTrain = route.name === 'workout';
        return {
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            height: 80,
            borderTopWidth: 0,
            borderRadius: 24,
            backgroundColor: 'rgba(9,10,15,0.85)',
            borderColor: 'rgba(255,255,255,0.06)',
            borderWidth: 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
            paddingTop: 12,
            paddingBottom: 14,
          },
          tabBarActiveTintColor: colors.accent.primary,
          tabBarInactiveTintColor: colors.text.muted,
          tabBarShowLabel: false,
        };
      }}
      screenListeners={{
        tabPress: () => {
          LayoutAnimation.configureNext(transition);
          playSound('tab_switch');
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.tabItem, tab.name === 'workout' && styles.tabItemCenter]}>
                {tab.name !== 'workout' ? (
                  <>
                    <tab.Icon
                      size={22}
                      color={focused ? colors.accent.cyan : colors.text.muted}
                    />
                    <KageText
                      variant="bodyBold"
                      color={focused ? colors.accent.cyan : colors.text.muted}
                      style={{
                        fontSize: 9,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        marginTop: 3,
                      }}
                    >
                      {tab.title}
                    </KageText>
                    {/* Active indicator */}
                    <View style={[styles.activeDot, { backgroundColor: focused ? colors.accent.cyan : 'transparent' }]} />
                  </>
                ) : (
                  // Center elevated Train tab
                  <View style={[styles.trainTabBg, {
                    backgroundColor: focused ? 'rgba(0,245,212,0.15)' : 'rgba(0,245,212,0.06)',
                    borderColor: focused ? colors.accent.cyan : 'rgba(0,245,212,0.2)',
                    shadowColor: focused ? colors.accent.cyan : 'transparent',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: focused ? 0.4 : 0,
                    shadowRadius: 12,
                  }]}>
                    <TrainIcon size={24} color={focused ? colors.accent.cyan : colors.text.muted} />
                    <KageText
                      variant="bodyBold"
                      color={focused ? colors.accent.cyan : colors.text.muted}
                      style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}
                    >
                      {tab.title}
                    </KageText>
                  </View>
                )}
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    paddingTop: 4,
  },
  tabItemCenter: {
    marginTop: -18,
    paddingTop: 0,
  },
  activeDot: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginTop: 3,
  },
  trainTabBg: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
  },
  // Icon styles
  iconSquare: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    overflow: 'hidden',
  },
  iconDiamond: {
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
  iconCircle: {
    borderRadius: 900,
  },
  iconBody: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconDiamondSmall: {
    borderRadius: 2,
  },
  iconInner: {
    opacity: 0.8,
  },
});
