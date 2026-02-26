import { FoodItem, UserProfile } from '../types';

export const defaultUser: UserProfile = {
    name: 'Riya',
    age: 12,
    height: 145,
    weight: 38,
    allergies: [],
};

// Represents a sub-slice of the 300 Indian foods requirement
export const foodDatabase: FoodItem[] = [
    { id: '1', name: 'Idli', category: 'Indian', nutrients: { calories: 39, protein: 1, iron: 0.3, vitC: 0, vitD: 0, zinc: 0.2 }, servingSize: '1 piece' },
    { id: '2', name: 'Dosa', category: 'Indian', nutrients: { calories: 133, protein: 3, iron: 0.5, vitC: 0, vitD: 0, zinc: 0.4 }, servingSize: '1 piece' },
    { id: '3', name: 'Apple', category: 'Fruits', nutrients: { calories: 95, protein: 0.5, iron: 0.2, vitC: 8.4, vitD: 0, zinc: 0.1 }, servingSize: '1 medium' },
    { id: '4', name: 'Banana', category: 'Fruits', nutrients: { calories: 105, protein: 1.3, iron: 0.3, vitC: 10.3, vitD: 0, zinc: 0.2 }, servingSize: '1 medium' },
    { id: '5', name: 'Roti', category: 'Indian', nutrients: { calories: 120, protein: 3.5, iron: 1.1, vitC: 0, vitD: 0, zinc: 0.6 }, servingSize: '1 piece' },
    { id: '6', name: 'Dal (Cooked)', category: 'Indian', nutrients: { calories: 116, protein: 9, iron: 2.5, vitC: 0, vitD: 0, zinc: 1 }, servingSize: '1 cup' },
    { id: '7', name: 'Paneer (Raw)', category: 'Dairy', nutrients: { calories: 265, protein: 18, iron: 0.2, vitC: 0, vitD: 0.8, zinc: 2 }, servingSize: '100g' },
    { id: '8', name: 'Milk', category: 'Dairy', nutrients: { calories: 149, protein: 8, iron: 0.1, vitC: 0, vitD: 2.4, zinc: 1 }, servingSize: '1 cup (240ml)' },
    { id: '9', name: 'Spinach (Cooked)', category: 'Veggies', nutrients: { calories: 41, protein: 5.3, iron: 6.4, vitC: 17.6, vitD: 0, zinc: 1.4 }, servingSize: '1 cup' },
    { id: '10', name: 'Chicken Breast (Cooked)', category: 'Protein', nutrients: { calories: 165, protein: 31, iron: 1, vitC: 0, vitD: 0.1, zinc: 1 }, servingSize: '100g' },
    { id: '11', name: 'Curd (Yogurt)', category: 'Dairy', nutrients: { calories: 98, protein: 11, iron: 0.1, vitC: 0, vitD: 0, zinc: 0.9 }, servingSize: '1 cup' },
    { id: '12', name: 'Moong Dal Chilla', category: 'Indian', nutrients: { calories: 125, protein: 7, iron: 1.5, vitC: 1, vitD: 0, zinc: 0.8 }, servingSize: '1 piece' },
    { id: '13', name: 'Poha', category: 'Indian', nutrients: { calories: 250, protein: 5, iron: 2.5, vitC: 5, vitD: 0, zinc: 1.2 }, servingSize: '1 bowl' },
    { id: '14', name: 'Upma', category: 'Indian', nutrients: { calories: 220, protein: 6, iron: 1.8, vitC: 3, vitD: 0, zinc: 0.9 }, servingSize: '1 bowl' },
    { id: '15', name: 'Oats (Cooked)', category: 'Grains', nutrients: { calories: 154, protein: 5, iron: 1.2, vitC: 0, vitD: 0, zinc: 1.1 }, servingSize: '1 cup' },
    { id: '16', name: 'Carrot', category: 'Veggies', nutrients: { calories: 25, protein: 0.5, iron: 0.2, vitC: 3.6, vitD: 0, zinc: 0.1 }, servingSize: '1 medium' },
    { id: '17', name: 'Almonds', category: 'Snacks', nutrients: { calories: 164, protein: 6, iron: 1, vitC: 0, vitD: 0, zinc: 0.9 }, servingSize: '1 oz (28g)' },
    { id: '18', name: 'Boiled Egg', category: 'Protein', nutrients: { calories: 78, protein: 6.3, iron: 0.6, vitC: 0, vitD: 1.1, zinc: 0.6 }, servingSize: '1 large' },
    { id: '19', name: 'Orange', category: 'Fruits', nutrients: { calories: 47, protein: 0.9, iron: 0.1, vitC: 53.2, vitD: 0, zinc: 0.1 }, servingSize: '1 medium' },
    { id: '20', name: 'Chickpeas (Cooked)', category: 'Protein', nutrients: { calories: 269, protein: 14.5, iron: 4.7, vitC: 2.1, vitD: 0, zinc: 2.5 }, servingSize: '1 cup' }
];
