export interface FoodItem {
  name: string;
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
}

export const foodDB: FoodItem[] = [
  // Meats & Poultry
  { name: 'Chicken Breast', protein: 31, calories: 165, carbs: 0, fat: 3.6 },
  { name: 'Chicken Thigh', protein: 24, calories: 209, carbs: 0, fat: 12 },
  { name: 'Turkey Breast', protein: 29, calories: 135, carbs: 0, fat: 1.5 },
  { name: 'Lean Beef (sirloin)', protein: 26, calories: 187, carbs: 0, fat: 8.7 },
  { name: 'Ground Beef (90/10)', protein: 27, calories: 192, carbs: 0, fat: 9 },
  { name: 'Pork Loin', protein: 26, calories: 176, carbs: 0, fat: 7.5 },
  { name: 'Bacon', protein: 12, calories: 541, carbs: 1.4, fat: 55 },

  // Fish & Seafood
  { name: 'Salmon', protein: 22, calories: 208, carbs: 0, fat: 13 },
  { name: 'Tuna (canned in water)', protein: 26, calories: 116, carbs: 0, fat: 0.8 },
  { name: 'Shrimp', protein: 24, calories: 119, carbs: 0.2, fat: 2.2 },
  { name: 'Cod', protein: 20, calories: 95, carbs: 0, fat: 0.7 },
  { name: 'Sardines', protein: 25, calories: 208, carbs: 0, fat: 11 },

  // Eggs & Dairy
  { name: 'Whole Egg', protein: 13, calories: 155, carbs: 1.1, fat: 11 },
  { name: 'Egg White', protein: 11, calories: 52, carbs: 0.7, fat: 0.2 },
  { name: 'Greek Yogurt (plain)', protein: 10, calories: 97, carbs: 3.6, fat: 5 },
  { name: 'Cottage Cheese', protein: 11, calories: 98, carbs: 3.4, fat: 4.3 },
  { name: 'Whole Milk', protein: 3.2, calories: 61, carbs: 4.8, fat: 3.3 },
  { name: 'Skim Milk', protein: 3.4, calories: 34, carbs: 5, fat: 0.1 },
  { name: 'Cheese (cheddar)', protein: 25, calories: 403, carbs: 1.3, fat: 33 },
  { name: 'Mozzarella', protein: 22, calories: 280, carbs: 3.1, fat: 20 },

  // Grains & Carbs
  { name: 'White Rice (cooked)', protein: 2.7, calories: 130, carbs: 28, fat: 0.3 },
  { name: 'Brown Rice (cooked)', protein: 2.6, calories: 111, carbs: 23, fat: 0.9 },
  { name: 'Oats (rolled)', protein: 13, calories: 379, carbs: 68, fat: 6.5 },
  { name: 'Pasta (cooked)', protein: 5, calories: 131, carbs: 25, fat: 1.1 },
  { name: 'Whole Wheat Pasta', protein: 6, calories: 124, carbs: 25, fat: 0.5 },
  { name: 'Quinoa (cooked)', protein: 4.4, calories: 120, carbs: 21, fat: 1.9 },
  { name: 'Sweet Potato', protein: 1.6, calories: 86, carbs: 20, fat: 0.1 },
  { name: 'White Potato', protein: 2, calories: 77, carbs: 17, fat: 0.1 },
  { name: 'Bread (whole wheat)', protein: 9, calories: 247, carbs: 41, fat: 3.4 },
  { name: 'Bread (white)', protein: 7, calories: 265, carbs: 49, fat: 3.2 },

  // Legumes
  { name: 'Black Beans (cooked)', protein: 8.9, calories: 132, carbs: 24, fat: 0.5 },
  { name: 'Lentils (cooked)', protein: 9, calories: 116, carbs: 20, fat: 0.4 },
  { name: 'Chickpeas (cooked)', protein: 8.9, calories: 139, carbs: 23, fat: 2.6 },
  { name: 'Tofu (firm)', protein: 8, calories: 76, carbs: 1.9, fat: 4.8 },

  // Nuts & Seeds
  { name: 'Almonds', protein: 21, calories: 579, carbs: 22, fat: 50 },
  { name: 'Peanuts', protein: 26, calories: 567, carbs: 16, fat: 49 },
  { name: 'Peanut Butter', protein: 25, calories: 588, carbs: 20, fat: 50 },
  { name: 'Walnuts', protein: 15, calories: 654, carbs: 14, fat: 65 },
  { name: 'Chia Seeds', protein: 17, calories: 486, carbs: 42, fat: 31 },
  { name: 'Flax Seeds', protein: 18, calories: 534, carbs: 29, fat: 42 },

  // Vegetables
  { name: 'Broccoli', protein: 2.8, calories: 34, carbs: 7, fat: 0.4 },
  { name: 'Spinach', protein: 2.9, calories: 23, carbs: 3.6, fat: 0.4 },
  { name: 'Kale', protein: 4.3, calories: 49, carbs: 8.8, fat: 0.9 },
  { name: 'Avocado', protein: 2, calories: 160, carbs: 8.5, fat: 15 },
  { name: 'Mixed Salad Greens', protein: 1.5, calories: 15, carbs: 2.8, fat: 0.2 },

  // Fruits
  { name: 'Banana', protein: 1.1, calories: 89, carbs: 23, fat: 0.3 },
  { name: 'Apple', protein: 0.3, calories: 52, carbs: 14, fat: 0.2 },
  { name: 'Blueberries', protein: 0.7, calories: 57, carbs: 14, fat: 0.3 },
  { name: 'Orange', protein: 0.9, calories: 47, carbs: 12, fat: 0.1 },
  { name: 'Grapes', protein: 0.7, calories: 67, carbs: 17, fat: 0.2 },

  // Oils & Fats
  { name: 'Olive Oil', protein: 0, calories: 884, carbs: 0, fat: 100 },
  { name: 'Coconut Oil', protein: 0, calories: 862, carbs: 0, fat: 100 },
  { name: 'Butter', protein: 0.9, calories: 717, carbs: 0.1, fat: 81 },

  // Condiments & Others
  { name: 'Honey', protein: 0.3, calories: 304, carbs: 82, fat: 0 },
  { name: 'Maple Syrup', protein: 0, calories: 260, carbs: 67, fat: 0.1 },
  { name: 'Protein Powder (whey)', protein: 80, calories: 380, carbs: 10, fat: 3.5 },
  { name: 'Tomato Sauce', protein: 1.7, calories: 36, carbs: 7, fat: 0.1 },
  { name: 'Hummus', protein: 7.9, calories: 177, carbs: 20, fat: 8.6 },
  { name: 'Soy Sauce', protein: 8, calories: 53, carbs: 4.7, fat: 0.1 },
  { name: 'Dark Chocolate (70%)', protein: 7.8, calories: 598, carbs: 46, fat: 43 },
];

export function searchFoods(query: string): FoodItem[] {
  if (!query.trim()) return foodDB.slice(0, 20);
  const q = query.toLowerCase();
  return foodDB.filter(f => f.name.toLowerCase().includes(q)).slice(0, 20);
}
