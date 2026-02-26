import React, { useState, useMemo } from 'react';
import { useStore } from '../store/StoreContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Award, Medal, Star, Leaf, Check, ActivitySquare, AlertTriangle, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'dairy-free', label: 'Dairy-Free' },
    { id: 'nut-free', label: 'Nut-Free' }
];

export const Profile: React.FC = () => {
    const { userData, setUserData } = useStore();
    const [profile, setProfile] = useState(userData.profile);
    // Initialize preferences from user data if it exists, otherwise empty array
    const [preferences, setPreferences] = useState<string[]>(userData.preferences || []);
    const [isEditing, setIsEditing] = useState(false);

    const bmi = useMemo(() => {
        if (!profile.height || !profile.weight) return 0;
        const hM = profile.height / 100;
        return Number((profile.weight / (hM * hM)).toFixed(1));
    }, [profile.height, profile.weight]);

    const getBMICategory = (b: number) => {
        if (b === 0) return { label: 'Enter details', color: 'text-slate-500 bg-slate-100 border-slate-200' };
        if (b < 18.5) return { label: 'Underweight', color: 'text-amber-700 bg-amber-100 border-amber-200' };
        if (b >= 18.5 && b <= 24.9) return { label: 'Healthy Weight', color: 'text-emerald-700 bg-emerald-100 border-emerald-200' };
        if (b >= 25 && b <= 29.9) return { label: 'Overweight', color: 'text-orange-700 bg-orange-100 border-orange-200' };
        return { label: 'Obese', color: 'text-red-700 bg-red-100 border-red-200' };
    };

    const bmiStatus = getBMICategory(bmi);

    const growthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Today'],
        datasets: [
            {
                label: 'Weight (kg)',
                data: [
                    Math.max(30, profile.weight - 2.5),
                    Math.max(30, profile.weight - 2.0),
                    Math.max(30, profile.weight - 1.2),
                    Math.max(30, profile.weight - 0.8),
                    Math.max(30, profile.weight - 0.2),
                    profile.weight
                ],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const handleSave = () => {
        setUserData(prev => ({
            ...prev,
            profile,
            preferences
        }));
        setIsEditing(false);
    };

    const togglePreference = (id: string) => {
        if (!isEditing) return;
        setPreferences(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">My Profile</h2>
                    <p className="text-slate-500 mt-1">Manage your personal details and preferences.</p>
                </div>
            </div>

            <GlassCard className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4 relative z-10">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                        Personal Details
                    </h3>
                    <Button variant={isEditing ? 'primary' : 'secondary'} onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="shadow-sm">
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <Input
                        label="Full Name"
                        value={profile.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, name: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-slate-50/50" : ""}
                    />
                    <Input
                        label="Age (Years)"
                        type="number"
                        value={profile.age}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, age: Number(e.target.value) })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-slate-50/50" : ""}
                    />
                    <Input
                        label="Height (cm)"
                        type="number"
                        value={profile.height}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, height: Number(e.target.value) })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-slate-50/50" : ""}
                    />
                    <Input
                        label="Weight (kg)"
                        type="number"
                        value={profile.weight}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, weight: Number(e.target.value) })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-slate-50/50" : ""}
                    />
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
                    <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Leaf size={16} className="text-emerald-500" /> Dietary Preferences
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                        {dietaryOptions.map(option => {
                            const isSelected = preferences.includes(option.id);
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => togglePreference(option.id)}
                                    disabled={!isEditing}
                                    className={`
                                        flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                                        ${isSelected
                                            ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-500 shadow-sm'
                                            : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300'
                                        }
                                        ${!isEditing && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                                        ${!isEditing && isSelected ? 'cursor-default' : ''}
                                    `}
                                >
                                    {isSelected && <Check size={14} className="text-emerald-600" />}
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                    {isEditing && <p className="text-xs text-slate-500 mt-3">Select any dietary restrictions to tailor food recommendations.</p>}
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <GlassCard className="flex flex-col">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <ActivitySquare className="text-indigo-500" /> Health Risk Assessment
                    </h3>
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Current BMI</div>
                        <div className="text-5xl font-black text-slate-800 mb-4">{bmi || '--'}</div>
                        <div className={`px-4 py-2 rounded-full border-2 font-bold flex items-center gap-2 ${bmiStatus.color}`}>
                            {bmi < 18.5 || bmi >= 25 ? <AlertTriangle size={18} /> : (bmi > 0 ? <Check size={18} /> : null)}
                            {bmiStatus.label}
                        </div>
                        <p className="mt-6 text-sm text-slate-500 px-4 leading-relaxed">
                            {bmi > 0 && bmi < 18.5 && "Your BMI indicates you may be underweight. Consider discussing a nutrition plan with a healthcare provider."}
                            {bmi >= 18.5 && bmi <= 24.9 && "Great job! Your BMI is within the healthy weight range for your height."}
                            {bmi >= 25 && "Your BMI indicates you may be above the ideal weight range. Focus on balanced meals and active routines."}
                        </p>
                    </div>
                </GlassCard>

                <GlassCard className="flex flex-col">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="text-emerald-500" /> Growth Trends
                    </h3>
                    <div className="flex-1 min-h-[200px] w-full">
                        <Line
                            data={growthData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { color: 'rgba(0,0,0,0.05)' } },
                                    x: { grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                </GlassCard>
            </div>

            <div className="pt-4">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Award className="text-amber-500" /> Performance Milestones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className={`text-center p-6 transition-all duration-300 ${userData.streak >= 7 ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200 shadow-orange-100/50 shadow-xl scale-105' : 'bg-slate-50 border-slate-200 grayscale opacity-60'}`}>
                        <div className="relative inline-block">
                            <Award className={`w-16 h-16 mx-auto mb-4 ${userData.streak >= 7 ? 'text-orange-500 drop-shadow-md' : 'text-slate-400'}`} />
                            {userData.streak >= 7 && <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-black px-2 py-0.5 rounded-full border border-orange-200 shadow-sm">LVL 1</span>}
                        </div>
                        <h4 className={`font-bold text-lg ${userData.streak >= 7 ? 'text-orange-900' : 'text-slate-600'}`}>Consistency King</h4>
                        <p className={`text-sm mt-2 ${userData.streak >= 7 ? 'text-orange-700/80' : 'text-slate-500'}`}>Log meals for 7 consecutive days.</p>
                        <div className="mt-4 bg-white/50 h-2 rounded-full overflow-hidden w-full max-w-[120px] mx-auto">
                            <div className="bg-orange-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (userData.streak / 7) * 100)}%` }}></div>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-2">{Math.min(7, userData.streak)} / 7 Days</p>
                    </GlassCard>

                    <GlassCard className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-emerald-100/50 shadow-xl transition-transform hover:-translate-y-1">
                        <div className="relative inline-block">
                            <Medal className="w-16 h-16 text-emerald-500 mx-auto mb-4 drop-shadow-md" />
                            <span className="absolute -top-2 -right-2 bg-white text-emerald-600 text-xs font-black px-2 py-0.5 rounded-full border border-emerald-200 shadow-sm">UNLOCKED</span>
                        </div>
                        <h4 className="font-bold text-lg text-emerald-900">Green Machine</h4>
                        <p className="text-sm mt-2 text-emerald-700/80">Hit your daily Vitamin C and Iron goals.</p>
                        <p className="text-xs font-bold text-emerald-600 bg-emerald-100/50 inline-block px-3 py-1 rounded-full mt-4">Completed Today</p>
                    </GlassCard>

                    <GlassCard className="text-center p-6 bg-slate-50 border-slate-200 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-help group">
                        <Star className="w-16 h-16 text-slate-400 mx-auto mb-4 group-hover:text-blue-400 transition-colors" />
                        <h4 className="font-bold text-lg text-slate-600 group-hover:text-blue-900">Protein Powerhouse</h4>
                        <p className="text-sm mt-2 text-slate-500 group-hover:text-blue-800/80">Exceed protein RDA for 5 days straight.</p>
                        <div className="mt-4 bg-slate-200 h-2 rounded-full overflow-hidden w-full max-w-[120px] mx-auto">
                            <div className="bg-blue-400 h-full rounded-full w-[40%]"></div>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-2 group-hover:text-blue-500">2 / 5 Days</p>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
