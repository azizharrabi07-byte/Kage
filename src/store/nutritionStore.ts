import { apiGetNutrition, apiAddFood, apiDeleteFood } from './api';
import { foodDB, type FoodItem } from '@/constants/foodDatabase';

export interface FoodEntry {
  id: string;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  photoBase64?: string;
}

export interface DayTotals {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  entries: FoodEntry[];
}

export async function getDayLog(date: string): Promise<FoodEntry[]> {
  return (await apiGetNutrition(date)) || [];
}

export async function addFood(entry: Omit<FoodEntry, 'id'>): Promise<void> {
  await apiAddFood(entry);
}

export async function removeFood(id: string): Promise<void> {
  await apiDeleteFood(id);
}

export async function getDayTotals(date: string): Promise<DayTotals> {
  const entries = await getDayLog(date);
  const totals = entries.reduce((acc, e) => ({
    calories: acc.calories + e.calories,
    protein: acc.protein + e.protein,
    carbs: acc.carbs + e.carbs,
    fat: acc.fat + e.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  return { date, ...totals, entries };
}

export async function getWeekHistory(): Promise<DayTotals[]> {
  const all = (await apiGetNutrition()) || [];
  const days: DayTotals[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const entries = all.filter((e: FoodEntry) => e.date === dateStr);
    days.push({
      date: dateStr,
      calories: entries.reduce((a: number, e: FoodEntry) => a + e.calories, 0),
      protein: entries.reduce((a: number, e: FoodEntry) => a + e.protein, 0),
      carbs: entries.reduce((a: number, e: FoodEntry) => a + e.carbs, 0),
      fat: entries.reduce((a: number, e: FoodEntry) => a + e.fat, 0),
      entries,
    });
  }
  return days;
}

export function calculateFoodMacros(food: FoodItem, grams: number) {
  const ratio = grams / 100;
  return {
    name: food.name,
    grams,
    calories: Math.round(food.calories * ratio),
    protein: Math.round(food.protein * ratio * 10) / 10,
    carbs: Math.round(food.carbs * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10,
  };
}
