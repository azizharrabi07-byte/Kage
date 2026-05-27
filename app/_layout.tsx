import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider } from '@/theme';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { SakuraPetals } from '@/components/cinematic/SakuraPetals';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <GestureHandlerRootView style={styles.root}>
          <StatusBar style="light" />
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <SakuraPetals count={4} speed={0.5} />
          </View>
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', animationDuration: 300 }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="lock-in" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
            <Stack.Screen name="(modals)/settings" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          </Stack>
        </GestureHandlerRootView>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});