import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { KageText } from '@/components/ui/KageText';
import { colors, spacing } from '@/theme';

export default function NotFoundScreen() {
  return (
    <View style={[styles.container, { backgroundColor: colors.bg.primary }]}>
      <KageText variant="h2">404</KageText>
      <KageText variant="body" align="center" style={{ opacity: 0.6 }}>
        This path does not exist in the dojo.
      </KageText>
      <Link href="/" style={{ marginTop: 20 }}>
        <KageText variant="body" color={colors.accent.neon}>
          Return to dojo
        </KageText>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    gap: 16,
  },
});