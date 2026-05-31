import { aiApi, ModelThinkingRequest } from '../apiClient';

export async function runModelThinking(profile: any, token?: string) {
  const payload: ModelThinkingRequest = {
    profile: {
      age: profile.age,
      height_cm: profile.heightCm,
      weight_kg: profile.weightKg,
      experience_level: profile.experience,
      primary_goal: profile.goal,
      injuries: profile.injuries,
      active_program_id: profile.activeProgramId,
    },
  };

  return aiApi.runModelThinking(payload, token);
}
