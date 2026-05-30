import { dietApi } from '../apiClient';

export async function getDietRecommendation(profile: any, token?: string) {
  const payload = {
    profile: {
      age: profile.age,
      height_cm: profile.heightCm,
      weight_kg: profile.weightKg,
      experience_level: profile.experience,
      primary_goal: profile.goal,
    },
  };

  return dietApi.getRecommendation(payload, token);
}
