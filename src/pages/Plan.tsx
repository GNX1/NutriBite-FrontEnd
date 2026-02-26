import React, { useRef } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Download, Calendar, ShoppingCart, Lightbulb, CheckCircle2, ActivitySquare } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useStore } from '../store/StoreContext';

const weeklyPlan = [
    { day: 'Monday', theme: 'Immunity Boost', description: 'High Vitamin C & Antioxidants', meals: ['Oatmeal with Blueberries', 'Lentil Soup with Spinach', 'Grilled Tofu & Broccoli'] },
    { day: 'Tuesday', theme: 'Strength Day', description: 'Protein-packed meals for muscle recovery', meals: ['Greek Yogurt with Nuts', 'Paneer Tikka Wrap', 'Quinoa & Bean Bowl'] },
    { day: 'Wednesday', theme: 'Iron Builder', description: 'Focus on Iron absorption', meals: ['Fortified Cereal', 'Spinach Dal with Lemon', 'Beetroot & Carrot Salad'] },
    { day: 'Thursday', theme: 'Digestive Health', description: 'Fiber-rich foods & probiotics', meals: ['Papaya & Chia Seeds', 'Khichdi with Curd', 'Steamed Veggies'] },
    { day: 'Friday', theme: 'Brain Power', description: 'Omega-3s and healthy fats', meals: ['Avocado Toast', 'Walnut Salad', 'Flaxseed Smoothie'] },
    { day: 'Saturday', theme: 'Energy Balance', description: 'Complex carbs for sustained energy', meals: ['Sweet Potato Mash', 'Multigrain Dosa', 'Mixed Fruit Bowl'] },
    { day: 'Sunday', theme: 'Cheat/Treat Day', description: 'Moderation with your favorites', meals: ['Pancakes', 'Homemade Pizza (Veggie loaded)', 'Dark Chocolate'] }
];

const shoppingList = [
    { category: 'Produce', items: ['Spinach (2 bunches)', 'Blueberries (1 box)', 'Broccoli (1 head)', 'Lemons (5 pcs)', 'Avocados (2 pcs)', 'Beetroot & Carrots'] },
    { category: 'Dairy & Alternatives', items: ['Greek Yogurt (500g)', 'Paneer (200g)', 'Tofu (200g)', 'Curd (500g)'] },
    { category: 'Pantry Core', items: ['Oats (500g)', 'Lentils/Dal (1kg)', 'Quinoa (500g)', 'Chia/Flax Seeds', 'Walnuts'] }
];

export const Plan: React.FC = () => {
    const { userData } = useStore();
    const planRef = useRef<HTMLDivElement>(null);

    const exportToPDF = async () => {
        if (!planRef.current) return;
        try {
            const canvas = await html2canvas(planRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('NutriBite_7Day_Plan.pdf');
        } catch (error) {
            console.error('PDF Export failed:', error);
            alert('Could not export PDF at this time.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">My Diet Plan</h2>
                    <p className="text-slate-500 mt-1">Personalized 7-day nutrition strategy and shopping list.</p>
                </div>
                <Button onClick={exportToPDF} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white shadow-lg shadow-slate-200">
                    <Download size={18} /> Export as PDF
                </Button>
            </div>

            {/* Recommendations AI Box */}
            <GlassCard className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2 relative z-10">
                    <Lightbulb className="text-indigo-500" size={20} /> Personalized AI Recommendations for {userData.profile.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    <div className="bg-white/60 p-4 rounded-xl border border-white flex gap-3">
                        <div className="mt-0.5"><CheckCircle2 className="text-emerald-500" size={18} /></div>
                        <div>
                            <span className="font-bold text-slate-800 text-sm block">Vitamin C Intake is Great</span>
                            <span className="text-slate-600 text-xs mt-1 block">Keep enjoying citrus fruits. They help boost your immune system.</span>
                        </div>
                    </div>
                    <div className="bg-white/60 p-4 rounded-xl border border-white flex gap-3">
                        <div className="mt-0.5"><ActivitySquare className="text-amber-500" size={18} /></div>
                        <div>
                            <span className="font-bold text-slate-800 text-sm block">Focus on Iron Absorption</span>
                            <span className="text-slate-600 text-xs mt-1 block">Pair your spinach with a squeeze of lemon to maximize iron uptake!</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Content to be exported to PDF */}
            <div ref={planRef} className="space-y-8 bg-slate-50 p-2 md:p-6 rounded-3xl">

                {/* 7-Day Plan */}
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Calendar className="text-primary" /> 7-Day Themed Meal Plan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {weeklyPlan.map((day, idx) => (
                            <GlassCard key={day.day} className={`p-5 hover:shadow-md transition-shadow ${idx === 0 ? 'ring-2 ring-primary/50' : ''}`}>
                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="font-bold text-slate-800">{day.day}</span>
                                    {idx === 0 && <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Today</span>}
                                </div>
                                <div className="text-sm font-semibold text-indigo-600 mb-1">{day.theme}</div>
                                <div className="text-xs text-slate-500 mb-4">{day.description}</div>

                                <ul className="space-y-2">
                                    {day.meals.map((meal, mIdx) => (
                                        <li key={mIdx} className="text-sm text-slate-700 flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5 shrink-0"></span>
                                            {meal}
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        ))}
                    </div>
                </div>

                {/* Auto-generated Shopping List */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <ShoppingCart className="text-emerald-500" /> Auto-Generated Shopping List
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {shoppingList.map(category => (
                            <div key={category.category} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                                <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">{category.category}</h4>
                                <ul className="space-y-3">
                                    {category.items.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 group">
                                            <div className="w-4 h-4 rounded border border-slate-300 group-hover:border-emerald-500 transition-colors cursor-pointer flex-shrink-0"></div>
                                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors cursor-pointer">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
