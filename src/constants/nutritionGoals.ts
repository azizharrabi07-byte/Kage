export interface DailyMacros {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
}

export function calculateMacros(weightKg: number): DailyMacros {
  return {
    protein: Math.round(weightKg * 2.2),
    calories: Math.round(weightKg * 33),
    carbs: Math.round(weightKg * 4),
    fat: Math.round(weightKg * 0.8),
  };
}
