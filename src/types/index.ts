export interface NutrientData {
    calories: number; // kcal
    protein: number; // g
    iron: number; // mg
    vitC: number; // mg
    vitD: number; // mcg
    zinc: number; // mg
}

export interface FoodItem {
    id: string;
    name: string;
    category: 'Fruits' | 'Veggies' | 'Dairy' | 'Protein' | 'Indian' | 'Grains' | 'Snacks';
    nutrients: NutrientData;
    servingSize: string; // e.g., '100g', '1 cup', '1 piece'
}

export interface MealLog {
    id: string;
    foodId: string;
    timestamp: string; // ISO date string
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    quantityMultiplier: number;
}

export interface UserProfile {
    name: string;
    age: number;
    height: number; // cm
    weight: number; // kg
    allergies: string[];
}

export interface UserContextData {
    profile: UserProfile;
    meals: MealLog[];
    isAdmin: boolean;
    streak: number;
    preferences?: string[];
}
