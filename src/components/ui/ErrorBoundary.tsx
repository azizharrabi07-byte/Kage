import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.warn('KAGE ERROR:', error.message, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>KAGE</Text>
          <Text style={styles.sub}>Something went wrong</Text>
          <Text style={styles.error}>{this.state.error?.message}</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.btnText}>RETRY</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#F5F5F5', fontSize: 32, letterSpacing: 8, marginBottom: 8 },
  sub: { color: '#8A8A8A', fontSize: 14, marginBottom: 24 },
  error: { color: '#FF1A1A', fontSize: 12, textAlign: 'center', marginBottom: 24, fontFamily: 'monospace' },
  btn: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#CC0000', borderRadius: 8 },
  btnText: { color: '#F5F5F5', fontSize: 14, letterSpacing: 2 },
});