import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Camera, Plus, Activity, CheckCircle, Mic } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LogMeal: React.FC = () => {
    const { foods, addMeal } = useStore();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFood, setSelectedFood] = useState<string | null>(null);
    const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');
    const [quantity, setQuantity] = useState(1);
    const [isScanning, setIsScanning] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const selectedFoodData = useMemo(() => {
        return foods.find(f => f.id === selectedFood);
    }, [selectedFood, foods]);

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setSearchTerm('Dosa');
            setSelectedFood(foods.find(f => f.name === 'Dosa')?.id || null);
            setIsScanning(false);
        }, 1500);
    };

    const handleSave = () => {
        if (selectedFood) {
            setIsSaved(true);
            addMeal({
                id: Math.random().toString(36).substr(2, 9),
                foodId: selectedFood,
                timestamp: new Date().toISOString(),
                mealType,
                quantityMultiplier: quantity
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 1200);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Log Food</h2>
            <GlassCard className="relative overflow-hidden">
                <AnimatePresence>
                    {isSaved && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl border-2 border-emerald-400 shadow-xl"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: 360 }}
                                transition={{ type: 'spring', damping: 15 }}
                            >
                                <CheckCircle className="text-emerald-500 w-24 h-24 mb-4 drop-shadow-md" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-slate-800">Meal Logged!</h3>
                            <p className="text-slate-500 font-medium mt-1">Updating your daily progress...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setMealType(type)}
                            className={`px-4 py-2 text-sm md:text-base rounded-full font-medium whitespace-nowrap transition-colors ${mealType === type ? 'bg-primary text-white shadow-md' : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 mb-6 relative">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <Input
                            placeholder="Search foods (e.g. Idli, Apple)..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setSelectedFood(null); }}
                            className="pl-12 pr-10 bg-white/60 focus:bg-white transition-colors"
                        />
                        <button onClick={() => alert('Voice input mocked for demo!')} className="absolute right-3 top-3 text-slate-400 hover:text-primary transition-colors">
                            <Mic size={20} />
                        </button>
                    </div>
                    <Button variant="secondary" onClick={handleScan} disabled={isScanning} className="shrink-0 whitespace-nowrap shadow-sm border border-slate-200">
                        {isScanning ? <span className="animate-pulse">Scanning Image...</span> : <><Camera size={20} className="mr-2 hidden sm:inline-block" /> Scan Photo</>}
                    </Button>
                </div>

                {searchTerm && !selectedFood && (
                    <div className="max-h-60 overflow-y-auto bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-100 mb-6 absolute left-0 right-0 z-20 w-[calc(100%-2rem)] mx-auto mt-[-15px]">
                        {filteredFoods.map(food => (
                            <div
                                key={food.id}
                                onClick={() => { setSelectedFood(food.id); setSearchTerm(food.name); }}
                                className="p-4 hover:bg-primary/5 cursor-pointer border-b border-slate-50 last:border-0 flex justify-between items-center transition-colors"
                            >
                                <div>
                                    <div className="font-semibold text-slate-800">{food.name}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{food.servingSize} • {food.category}</div>
                                </div>
                                <div className="text-right text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                    {food.nutrients.calories} kcal
                                </div>
                            </div>
                        ))}
                        {filteredFoods.length === 0 && <div className="p-8 text-center text-slate-500 font-medium">No foods found. Try a different search.</div>}
                    </div>
                )}

                <AnimatePresence>
                    {selectedFoodData && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 space-y-4">
                            <div className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl shadow-inner">
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                                    <span className="w-2 h-6 bg-primary rounded-full"></span>
                                    <span className="text-primary">{selectedFoodData.name}</span> Selected
                                </h4>
                                <div className="flex flex-wrap items-center gap-4">
                                    <label className="text-sm font-semibold text-slate-600">Servings:</label>
                                    <Input type="number" min="0.5" step="0.5" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-24 bg-white font-bold" />
                                    <span className="text-sm font-medium text-slate-500 tracking-wide bg-white/50 px-3 py-1.5 rounded-lg border border-slate-200">
                                        x {selectedFoodData.servingSize}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Impact Feedback */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-emerald-50/80 border border-emerald-100 p-4 rounded-xl flex items-start sm:items-center gap-3"
                            >
                                <div className="bg-emerald-100 p-2 rounded-full shrink-0">
                                    <Activity className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-emerald-800">Dietary Impact</div>
                                    <div className="text-xs text-emerald-600/80 mt-0.5">
                                        Adding this generates <strong>+{Math.round(selectedFoodData.nutrients.calories * quantity)} kcal</strong> and <strong>+{Math.round(selectedFoodData.nutrients.protein * quantity * 10) / 10}g protein</strong> towards your daily goal.
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button className="w-full shadow-lg shadow-primary/20" size="lg" disabled={!selectedFood} onClick={handleSave}>
                    <Plus size={20} className="mr-2" /> Log {selectedFoodData ? `${quantity}x ${selectedFoodData.name}` : 'Meal'}
                </Button>
            </GlassCard>
        </div>
    );
};
