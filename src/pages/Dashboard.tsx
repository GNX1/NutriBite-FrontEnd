import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import {
    Chart as ChartJS,
    RadialLinearScale, PointElement, LineElement, Filler,
    Tooltip, Legend, CategoryScale, LinearScale, BarElement
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/StoreContext';
import {
    Plus, ArrowRight, Flame, Trophy, ActivitySquare,
    Utensils, Clock, TrendingUp, Zap, Apple, Droplets,
    Heart, Moon, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export const Dashboard: React.FC = () => {
    const { userData, foods } = useStore();
    const navigate = useNavigate();
    const { width, height } = useWindowSize();

    // Calculate today's intake
    const todayMeals = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return userData.meals.filter(m => m.timestamp.startsWith(today));
    }, [userData.meals]);

    const dailyTotals = useMemo(() => {
        const totals = { calories: 0, protein: 0, iron: 0, vitC: 0, vitD: 0, zinc: 0 };
        todayMeals.forEach(meal => {
            const food = foods.find(f => f.id === meal.foodId);
            if (food) {
                totals.calories += food.nutrients.calories * meal.quantityMultiplier;
                totals.protein += food.nutrients.protein * meal.quantityMultiplier;
                totals.iron += food.nutrients.iron * meal.quantityMultiplier;
                totals.vitC += food.nutrients.vitC * meal.quantityMultiplier;
                totals.vitD += food.nutrients.vitD * meal.quantityMultiplier;
                totals.zinc += food.nutrients.zinc * meal.quantityMultiplier;
            }
        });
        return totals;
    }, [todayMeals, foods]);

    const rda = { calories: 2000, protein: 50, iron: 18, vitC: 90, vitD: 20, zinc: 11 };

    const radarData = {
        labels: ['Calories', 'Protein', 'Iron', 'Vitamin C', 'Vitamin D', 'Zinc'],
        datasets: [{
            label: '% of Daily Goal',
            data: [
                Math.min(100, (dailyTotals.calories / rda.calories) * 100),
                Math.min(100, (dailyTotals.protein / rda.protein) * 100),
                Math.min(100, (dailyTotals.iron / rda.iron) * 100),
                Math.min(100, (dailyTotals.vitC / rda.vitC) * 100),
                Math.min(100, (dailyTotals.vitD / rda.vitD) * 100),
                Math.min(100, (dailyTotals.zinc / rda.zinc) * 100),
            ],
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            borderColor: '#8B5CF6',
            pointBackgroundColor: '#8B5CF6',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#A100FF',
        }],
    };

    const weeklyChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
        datasets: [{
            label: 'Calories',
            data: [1850, 2100, 1950, 1700, 2200, 2050, dailyTotals.calories],
            backgroundColor: (context: any) => {
                const value = context.dataset.data[context.dataIndex];
                return value >= rda.calories ? '#10B981' : '#8B5CF6';
            },
            borderRadius: 6
        }]
    };

    const unfulfilled = radarData.datasets[0].data
        .map((val, idx) => ({ name: radarData.labels[idx], val }))
        .filter(item => item.val < 50);

    const points = useMemo(() => userData.meals.length * 10 + (userData.streak || 0) * 50, [userData.meals, userData.streak]);
    const allGoalsMet = radarData.datasets[0].data.every(val => val >= 100) || (userData.streak && userData.streak >= 7);

    const getStatusColor = (percent: number) => {
        if (percent >= 90) return { bar: 'from-emerald-400 to-emerald-500', badge: 'text-emerald-700 bg-emerald-100 border-emerald-200', label: 'Optimal' };
        if (percent >= 70) return { bar: 'from-amber-400 to-amber-500', badge: 'text-amber-700 bg-amber-100 border-amber-200', label: 'Average' };
        return { bar: 'from-red-400 to-red-500', badge: 'text-red-700 bg-red-100 border-red-200', label: 'Low' };
    };

    const nutrients = [
        { label: 'Calories', value: Math.round(dailyTotals.calories), target: rda.calories, unit: 'kcal', icon: <Zap size={16} /> },
        { label: 'Protein', value: Math.round(dailyTotals.protein * 10) / 10, target: rda.protein, unit: 'g', icon: <Heart size={16} /> },
        { label: 'Iron', value: Math.round(dailyTotals.iron * 10) / 10, target: rda.iron, unit: 'mg', icon: <Droplets size={16} /> },
        { label: 'Vitamin C', value: Math.round(dailyTotals.vitC * 10) / 10, target: rda.vitC, unit: 'mg', icon: <Apple size={16} /> },
        { label: 'Vitamin D', value: Math.round(dailyTotals.vitD * 10) / 10, target: rda.vitD, unit: 'mcg', icon: <Moon size={16} /> },
        { label: 'Zinc', value: Math.round(dailyTotals.zinc * 10) / 10, target: rda.zinc, unit: 'mg', icon: <TrendingUp size={16} /> },
    ];

    // Recent meals — last 5
    const recentMeals = useMemo(() => {
        return [...userData.meals]
            .reverse()
            .slice(0, 5)
            .map(meal => {
                const food = foods.find(f => f.id === meal.foodId);
                return food ? { ...meal, food } : null;
            })
            .filter(Boolean) as { food: typeof foods[0]; mealType: string; quantityMultiplier: number; timestamp: string }[];
    }, [userData.meals, foods]);

    const quickActions = [
        { label: 'Log Breakfast', emoji: '🥣', path: '/log-meal' },
        { label: 'View My Plan', emoji: '📅', path: '/plan' },
        { label: 'My Profile', emoji: '👤', path: '/profile' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            {allGoalsMet && <Confetti width={width} height={height} numberOfPieces={200} gravity={0.15} recycle={false} style={{ position: 'fixed', top: 0, left: 0, zIndex: 100, pointerEvents: 'none' }} />}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 p-5 rounded-3xl border border-white/80 shadow-sm backdrop-blur-md">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Hi, {userData.profile.name}! 👋</h2>
                    <p className="text-slate-500 mt-1 font-medium">Here is your daily nutrition summary.</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 rounded-2xl border border-yellow-200 shadow-sm transition-transform hover:scale-105">
                        <Trophy className="text-yellow-600" size={22} fill="currentColor" />
                        <div>
                            <div className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">Total Points</div>
                            <div className="text-lg font-extrabold text-yellow-900 leading-none">{points}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 shadow-sm transition-transform hover:scale-105">
                        <Flame className="text-orange-500" size={22} fill="currentColor" />
                        <div>
                            <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Streak</div>
                            <div className="text-lg font-extrabold text-orange-900 leading-none">{userData.streak || 5} Days</div>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/log-meal')} className="flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                        <Plus size={18} /> Log Meal
                    </Button>
                </div>
            </div>

            {/* Alert Banner */}
            {unfulfilled.length > 0 ? (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50/90 border border-red-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-2 text-red-800">
                        <ActivitySquare className="text-red-500 shrink-0" size={20} />
                        <span className="font-medium"><strong>Alert:</strong> Low intake of <span className="underline decoration-red-400 decoration-2">{unfulfilled.map(u => u.name).join(', ')}</span> today.</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/plan')} className="text-red-700 hover:bg-red-100 whitespace-nowrap bg-red-100/50">
                        View Diet Plan <ArrowRight size={16} className="ml-1" />
                    </Button>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50/90 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                    <ActivitySquare className="text-emerald-500 shrink-0" size={20} />
                    <span className="font-medium text-emerald-800"><strong>Excellent!</strong> Your daily nutrient intake is perfectly balanced. 🎉</span>
                </motion.div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
                {quickActions.map(a => (
                    <motion.button
                        key={a.label}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(a.path)}
                        className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-center"
                    >
                        <span className="text-2xl">{a.emoji}</span>
                        <span className="text-xs font-bold text-slate-700 leading-tight">{a.label}</span>
                    </motion.button>
                ))}
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Radar Chart */}
                <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
                    <GlassCard className="flex flex-col">
                        <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-6 bg-primary rounded-full"></span>
                            Live Nutrient Radar
                        </h3>
                        <div className="flex-1 min-h-[260px] w-full flex justify-center items-center">
                            <Radar
                                data={radarData}
                                options={{
                                    maintainAspectRatio: false,
                                    scales: {
                                        r: {
                                            min: 0, max: 100,
                                            ticks: { stepSize: 20, font: { size: 10 } },
                                            angleLines: { color: 'rgba(0,0,0,0.05)' },
                                            grid: { color: 'rgba(0,0,0,0.05)' },
                                            pointLabels: { font: { size: 12, weight: 'bold' } }
                                        }
                                    },
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: { callbacks: { label: (ctx) => `${ctx.raw}% of Goal` } }
                                    }
                                }}
                            />
                        </div>
                    </GlassCard>

                    {/* Nutrient Progress Bars */}
                    <GlassCard>
                        <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
                            <ActivitySquare size={18} className="text-primary" /> Today's Nutrient Breakdown
                        </h3>
                        <div className="space-y-4">
                            {nutrients.map(n => {
                                const pct = Math.min(100, Math.round((n.value / n.target) * 100));
                                const style = getStatusColor(pct);
                                return (
                                    <div key={n.label}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                <span className="text-slate-500">{n.icon}</span>
                                                {n.label}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-800">{n.value}<span className="text-slate-500 font-normal text-xs ml-0.5">{n.unit}</span></span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>{pct}% · {style.label}</span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
                                                className={`h-full rounded-full bg-gradient-to-r ${style.bar}`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>
                </div>

                {/* Side column */}
                <div className="flex flex-col gap-6">
                    {/* Calories Big Card */}
                    <GlassCard className="flex flex-col justify-center bg-gradient-to-br from-indigo-500 to-primary text-white border-none shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                        <h4 className="text-indigo-100 font-medium mb-1 relative z-10 w-full flex justify-between items-center">
                            <span className="flex items-center gap-1.5"><Utensils size={14} /> Calories Today</span>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-md">{Math.round((dailyTotals.calories / rda.calories) * 100)}%</span>
                        </h4>
                        <div className="text-4xl font-extrabold relative z-10 mt-2">{Math.round(dailyTotals.calories)} <span className="text-lg font-medium text-indigo-200">/ {rda.calories} kcal</span></div>
                        <div className="mt-4 w-full bg-black/20 h-2.5 rounded-full overflow-hidden relative z-10">
                            <div className="bg-white h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(100, (dailyTotals.calories / rda.calories) * 100)}%` }} />
                        </div>
                        <div className="mt-3 text-xs text-indigo-200 relative z-10">{Math.round(rda.calories - dailyTotals.calories > 0 ? rda.calories - dailyTotals.calories : 0)} kcal remaining today</div>
                    </GlassCard>

                    {/* Protein Card */}
                    <GlassCard className="flex flex-col justify-center bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-none shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                        <h4 className="text-emerald-100 font-medium mb-1 relative z-10 w-full flex justify-between items-center">
                            <span className="flex items-center gap-1.5"><Heart size={14} /> Protein Intake</span>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-md">{Math.round((dailyTotals.protein / rda.protein) * 100)}%</span>
                        </h4>
                        <div className="text-4xl font-extrabold relative z-10 mt-2">{Math.round(dailyTotals.protein)}g <span className="text-lg font-medium text-emerald-200">/ {rda.protein}g</span></div>
                        <div className="mt-4 w-full bg-black/20 h-2.5 rounded-full overflow-hidden relative z-10">
                            <div className="bg-white h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(100, (dailyTotals.protein / rda.protein) * 100)}%` }} />
                        </div>
                    </GlassCard>

                    {/* Meals Logged Counter */}
                    <GlassCard className="flex items-center justify-between gap-3 py-4">
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Today's Meals</div>
                            <div className="text-3xl font-black text-slate-800">{todayMeals.length}</div>
                            <div className="text-xs text-slate-500 mt-0.5">items logged</div>
                        </div>
                        <button onClick={() => navigate('/log-meal')} className="bg-primary/10 text-primary p-3 rounded-2xl hover:bg-primary/20 transition-colors">
                            <Plus size={24} />
                        </button>
                    </GlassCard>
                </div>

                {/* Weekly Chart — full width */}
                <GlassCard className="col-span-1 lg:col-span-3">
                    <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-6 bg-secondary rounded-full"></span>
                        Weekly Caloric Consistency
                    </h3>
                    <div className="h-48 w-full">
                        <Bar
                            data={weeklyChartData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { color: 'rgba(0,0,0,0.05)' }, suggestedMax: 2500 },
                                    x: { grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                </GlassCard>

                {/* Recent Meals */}
                <GlassCard className="col-span-1 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Clock size={18} className="text-primary" /> Recent Meals
                        </h3>
                        <button onClick={() => navigate('/log-meal')} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                            Log New <ChevronRight size={14} />
                        </button>
                    </div>
                    {recentMeals.length === 0 ? (
                        <div className="text-center py-10 flex flex-col items-center gap-3">
                            <span className="text-4xl">🍽️</span>
                            <p className="text-slate-500 font-medium">No meals logged yet today.</p>
                            <Button size="sm" onClick={() => navigate('/log-meal')}><Plus size={16} className="mr-1" /> Log First Meal</Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentMeals.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl hover:bg-slate-100/80 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-lg">
                                            {m.food.category === 'Fruits' ? '🍎' : m.food.category === 'Dairy' ? '🥛' : m.food.category === 'Protein' ? '🥩' : m.food.category === 'Veggies' ? '🥦' : '🍛'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{m.food.name}</div>
                                            <div className="text-xs text-slate-500">{m.mealType} · {m.quantityMultiplier}x {m.food.servingSize}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-slate-700">{Math.round(m.food.nutrients.calories * m.quantityMultiplier)} kcal</div>
                                        <div className="text-[10px] text-slate-400">{Math.round(m.food.nutrients.protein * m.quantityMultiplier * 10) / 10}g protein</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </GlassCard>

                {/* Today's Tips */}
                <GlassCard className="col-span-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="text-yellow-500">💡</span> Today's Health Tips
                    </h3>
                    <div className="space-y-3">
                        {[
                            { tip: 'Drink 8 glasses of water today!', icon: '💧' },
                            { tip: 'Pair iron-rich foods with vitamin C for better absorption.', icon: '🍋' },
                            { tip: 'Include dairy or fortified foods for Vitamin D.', icon: '☀️' },
                            { tip: 'Eat within 2 hours of waking up to kickstart metabolism.', icon: '⏰' },
                        ].map((t, i) => (
                            <div key={i} className="flex items-start gap-2 p-2.5 bg-amber-50/70 rounded-xl border border-amber-100 text-xs text-amber-800">
                                <span className="text-base shrink-0">{t.icon}</span>
                                <span>{t.tip}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
