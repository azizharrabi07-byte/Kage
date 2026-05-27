import { ImageSourcePropType } from 'react-native';
import type { MovementType } from '@/store/types';

/**
 * Maps movement types to exercise demonstration photos.
 * Downloaded from user — 6 photos covering the main movement patterns.
 */
export const movementPhotos: Partial<Record<MovementType, ImageSourcePropType>> = {
  press: require('../../assets/exercises/chest.jpg'),
  push: require('../../assets/exercises/chest.jpg'),
  row: require('../../assets/exercises/back.jpg'),
  pull: require('../../assets/exercises/back.jpg'),
  curl: require('../../assets/exercises/back.jpg'),
  squat: require('../../assets/exercises/squat.jpg'),
  hinge: require('../../assets/exercises/hinge.jpg'),
  lunge: require('../../assets/exercises/lunge.jpg'),
  twist: require('../../assets/exercises/core.jpg'),
  hold: require('../../assets/exercises/core.jpg'),
  sprint: require('../../assets/exercises/core.jpg'),
  slam: require('../../assets/exercises/core.jpg'),
  extension: require('../../assets/exercises/core.jpg'),
};
