import React, { createContext, useContext } from 'react';
import { UserContextData, FoodItem, MealLog } from '../types';
import { useSessionStorage } from './useSessionStorage';
import { defaultUser, foodDatabase as initialFoodDB } from './data';

interface AppContextType {
    userData: UserContextData;
    setUserData: (data: UserContextData | ((prev: UserContextData) => UserContextData)) => void;
    foods: FoodItem[];
    setFoods: (data: FoodItem[] | ((prev: FoodItem[]) => FoodItem[])) => void;
    addMeal: (meal: MealLog) => void;
}

const StoreContext = createContext<AppContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useSessionStorage<UserContextData>('nutribite-user', {
        profile: defaultUser,
        meals: [],
        isAdmin: false,
        streak: 0,
    });

    const [foods, setFoods] = useSessionStorage<FoodItem[]>('nutribite-foods', initialFoodDB);

    const addMeal = (meal: MealLog) => {
        setUserData(prev => ({
            ...prev,
            meals: [...prev.meals, meal],
        }));
    };

    return (
        <StoreContext.Provider value={{ userData, setUserData, foods, setFoods, addMeal }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error('useStore must be used within StoreProvider');
    return context;
};
