import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@kage_onboarding_done';
const GOALS_KEY = '@kage_goals_complete';

export default function Index() {
  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((done) => {
      if (done === 'true') router.replace('/(tabs)');
      else router.replace('/onboarding');
    });
  }, []);

  return <View style={{ flex: 1, backgroundColor: '#0B1A2E' }} />;
}