export interface UserProfileForAI {
  age?: number;
  height_cm?: number;
  weight_kg?: number;
  experience_level?: 'beginner' | 'intermediate' | 'advanced';
  primary_goal?: 'build_muscle' | 'lose_fat' | 'performance' | 'general';
  injuries?: string;
  active_program_id?: string;
}
