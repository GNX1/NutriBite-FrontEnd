import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Trash2, Edit, X, Users, Activity, Database, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { Bar, Pie, Radar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { FoodItem } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler);

const categories = ['Fruits', 'Veggies', 'Dairy', 'Protein', 'Indian', 'Grains', 'Snacks'] as const;

export const Admin: React.FC = () => {
    const { foods, setFoods } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [activeTab, setActiveTab] = useState<'overview' | 'database' | 'users'>('overview');

    // Modal States
    const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
    const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

    // Form State
    const defaultFormState: Omit<FoodItem, 'id'> = {
        name: '',
        category: 'Fruits',
        servingSize: '',
        nutrients: { calories: 0, protein: 0, iron: 0, vitC: 0, vitD: 0, zinc: 0 }
    };
    const [formData, setFormData] = useState(defaultFormState);

    const filteredFoods = foods.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Mock global data
    const pieData = {
        labels: ['Iron Deficient', 'Vit C Deficient', 'Protein Low', 'Healthy'],
        datasets: [{
            data: [35, 25, 15, 25],
            backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'],
            borderWidth: 0,
        }]
    };

    const barData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Active Users',
            data: [120, 150, 180, 190, 160, 210, 250],
            backgroundColor: '#8B5CF6',
            borderRadius: 4
        }]
    };

    const userDistributionData = {
        labels: ['6-9 yrs', '10-13 yrs', '14-17 yrs'],
        datasets: [{
            data: [400, 500, 348],
            backgroundColor: ['#FCA5A5', '#FCD34D', '#6EE7B7'],
            borderWidth: 0,
        }]
    };

    const popularFoodsData = {
        labels: ['Apple', 'Milk', 'Idli', 'Dal', 'Egg'],
        datasets: [{
            label: 'Times Logged',
            data: [1500, 1200, 950, 800, 750],
            backgroundColor: '#F59E0B',
            borderRadius: 4
        }]
    };

    const deficiencyTrendsData = {
        labels: ['Iron', 'Vit C', 'Protein', 'Calcium', 'Zinc'],
        datasets: [
            { label: '6-9 yrs', data: [30, 20, 10, 25, 15], backgroundColor: '#EF4444', borderRadius: 2 },
            { label: '10-13 yrs', data: [40, 25, 15, 20, 20], backgroundColor: '#F59E0B', borderRadius: 2 },
            { label: '14-17 yrs', data: [25, 15, 20, 15, 10], backgroundColor: '#10B981', borderRadius: 2 },
        ]
    };

    const complianceRadarData = {
        labels: ['Calories', 'Protein', 'Iron', 'Vitamin C', 'Vitamin D', 'Zinc'],
        datasets: [
            {
                label: 'Global Average %',
                data: [85, 90, 60, 75, 65, 80],
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                borderColor: '#8B5CF6',
                pointBackgroundColor: '#8B5CF6',
            }
        ]
    };

    const mockUsersList = [
        { id: '1', name: 'Riya Patel', age: 12, bmi: 18.2, status: 'At Risk', lastActive: '2 mins ago', activePlan: 'Immunity Builder' },
        { id: '2', name: 'Aarav Sharma', age: 15, bmi: 22.1, status: 'Healthy', lastActive: '1 hr ago', activePlan: 'Strength Focus' },
        { id: '3', name: 'Sneha Gupta', age: 9, bmi: 26.4, status: 'Intervention Required', lastActive: '3 hrs ago', activePlan: 'Balanced Base' },
        { id: '4', name: 'Kabir Singh', age: 14, bmi: 19.5, status: 'Healthy', lastActive: 'Yesterday', activePlan: 'Energy Balance' }
    ];

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this food item?')) {
            setFoods(prev => prev.filter(f => f.id !== id));
        }
    };

    const openAddModal = () => {
        setFormData(defaultFormState);
        setEditingFood(null);
        setIsFoodModalOpen(true);
    };

    const openEditModal = (food: FoodItem) => {
        setFormData({
            name: food.name,
            category: food.category,
            servingSize: food.servingSize,
            nutrients: { ...food.nutrients }
        });
        setEditingFood(food);
        setIsFoodModalOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFood) {
            // Update existing
            setFoods(prev => prev.map(f => f.id === editingFood.id ? { ...formData, id: editingFood.id } : f));
        } else {
            // Add new
            const newFood: FoodItem = {
                ...formData,
                id: Math.random().toString(36).substr(2, 9)
            };
            setFoods(prev => [newFood, ...prev]);
        }
        setIsFoodModalOpen(false);
    };

    const handleNutrientChange = (field: keyof typeof formData.nutrients, value: string) => {
        const numValue = value === '' ? 0 : Number(value);
        setFormData(prev => ({
            ...prev,
            nutrients: { ...prev.nutrients, [field]: numValue }
        }));
    };

    return (
        <div className="space-y-8 relative">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">Admin Dashboard</h2>
                <p className="text-slate-500 mt-1">Platform Analytics and System Management.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <Activity size={18} /> Overview
                </button>
                <button
                    onClick={() => setActiveTab('database')}
                    className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'database' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <Database size={18} /> Food Database
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <Users size={18} /> User Management
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <GlassCard className="p-4 text-center hover:scale-105 transition-transform">
                            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Users</h4>
                            <div className="text-3xl font-black text-slate-800 mt-2">1,248</div>
                        </GlassCard>
                        <GlassCard className="p-4 text-center hover:scale-105 transition-transform">
                            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Meals Logged</h4>
                            <div className="text-3xl font-black text-primary mt-2">45K+</div>
                        </GlassCard>
                        <GlassCard className="p-4 text-center hover:scale-105 transition-transform">
                            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Avg Deficiencies</h4>
                            <div className="text-3xl font-black text-red-500 mt-2">2.1</div>
                        </GlassCard>
                        <GlassCard className="p-4 text-center hover:scale-105 transition-transform">
                            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Plans</h4>
                            <div className="text-3xl font-black text-emerald-500 mt-2">892</div>
                        </GlassCard>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <GlassCard className="col-span-1 lg:col-span-2 shadow-sm border border-slate-200/60">
                            <h3 className="font-bold text-lg mb-4 text-slate-800">Deficiency Trends by Age</h3>
                            <div className="h-64"><Bar data={deficiencyTrendsData} options={{ maintainAspectRatio: false, scales: { x: { stacked: false }, y: { stacked: false } } }} /></div>
                        </GlassCard>
                        <GlassCard className="shadow-sm border border-slate-200/60">
                            <h3 className="font-bold text-lg mb-4 text-slate-800">Nutrient Compliance</h3>
                            <div className="h-64 flex justify-center"><Radar data={complianceRadarData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { min: 0, max: 100 } } }} /></div>
                        </GlassCard>
                        <GlassCard className="shadow-sm border border-slate-200/60">
                            <h3 className="font-bold text-lg mb-4 text-slate-800">Global Health Status</h3>
                            <div className="h-64 flex justify-center"><Pie data={pieData} options={{ maintainAspectRatio: false }} /></div>
                        </GlassCard>
                        <GlassCard className="shadow-sm border border-slate-200/60">
                            <h3 className="font-bold text-lg mb-4 text-slate-800">Age Distribution</h3>
                            <div className="h-64 flex justify-center"><Doughnut data={userDistributionData} options={{ maintainAspectRatio: false }} /></div>
                        </GlassCard>
                        <GlassCard className="shadow-sm border border-slate-200/60">
                            <h3 className="font-bold text-lg mb-4 text-slate-800">Most Logged Foods</h3>
                            <div className="h-64"><Bar data={popularFoodsData} options={{ indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
                        </GlassCard>
                        <GlassCard className="col-span-1 md:col-span-2 lg:col-span-3 shadow-sm border border-slate-200/60">
                            <h3 className="font-bold text-lg mb-4 text-slate-800">Platform Engagement (Logins)</h3>
                            <div className="h-64"><Line data={barData} options={{ maintainAspectRatio: false, elements: { line: { tension: 0.4 } } }} /></div>
                        </GlassCard>
                    </div>
                </div>
            )}

            {/* Food Database Tab */}
            {activeTab === 'database' && (
                <GlassCard className="overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm border border-slate-200/60">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="flex flex-col gap-2">
                            <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">Food Database <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{foods.length} items</span></h3>
                            <div className="flex gap-2 flex-wrap">
                                {['All', ...categories].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${selectedCategory === cat ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-primary/5'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            <input
                                placeholder="Search foods..."
                                className="px-3 py-2 flex-1 md:w-48 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-colors text-sm"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <Button size="sm" variant="secondary" onClick={() => alert('Bulk CSV Import mocked for demo!')} className="flex-1 md:flex-none whitespace-nowrap"><Download size={16} className="mr-1 inline" /> Import CSV</Button>
                            <Button size="sm" onClick={openAddModal} className="flex-1 md:flex-none whitespace-nowrap"><Plus size={16} className="mr-1 inline" /> Add Food</Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-800 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Name</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Serving</th>
                                    <th className="px-4 py-3">Calories</th>
                                    <th className="px-4 py-3">Protein</th>
                                    <th className="px-4 py-3">Iron</th>
                                    <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredFoods.map(food => (
                                    <tr key={food.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-800">{food.name}</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-bold">{food.category}</span>
                                        </td>
                                        <td className="px-4 py-3">{food.servingSize || '-'}</td>
                                        <td className="px-4 py-3">{food.nutrients.calories} kcal</td>
                                        <td className="px-4 py-3">{food.nutrients.protein}g</td>
                                        <td className="px-4 py-3">{food.nutrients.iron}mg</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => openEditModal(food)} className="p-1.5 text-slate-400 hover:text-primary transition-colors"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(food.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredFoods.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-slate-500">No foods found matching "{searchTerm}".</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            )}

            {/* Users Tab (Mock) */}
            {activeTab === 'users' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <GlassCard className="shadow-sm border border-slate-200/60">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-slate-800">User Management</h3>
                            <Button size="sm" variant="secondary">Export Report</Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                                <div className="text-xs text-slate-500 font-bold uppercase">Total Users</div>
                                <div className="text-2xl font-black text-slate-800">1,248</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                                <div className="text-xs text-slate-500 font-bold uppercase">At Risk</div>
                                <div className="text-2xl font-black text-amber-600">312</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                                <div className="text-xs text-slate-500 font-bold uppercase">Interventions</div>
                                <div className="text-2xl font-black text-red-600">89</div>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col justify-center">
                                <div className="text-xs text-emerald-700 font-bold uppercase">Healthy Track</div>
                                <div className="text-2xl font-black text-emerald-600">847</div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-800 uppercase text-[10px] font-bold tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">User</th>
                                        <th className="px-4 py-3">Health Profile</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Active Plan</th>
                                        <th className="px-4 py-3">Last Active</th>
                                        <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {mockUsersList.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                                                <div className="text-xs text-slate-500">ID: {user.id.padStart(5, '0')}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-xs">Age: <span className="font-medium text-slate-800">{user.age} yrs</span></div>
                                                <div className="text-xs">BMI: <span className="font-medium text-slate-800">{user.bmi}</span></div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full flex w-fit items-center gap-1 ${user.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' :
                                                        user.status === 'At Risk' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {user.status === 'Healthy' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="font-medium text-indigo-600 text-xs bg-indigo-50 px-2.5 py-1 rounded-md">{user.activePlan}</span>
                                            </td>
                                            <td className="px-4 py-4 text-xs font-medium text-slate-500">{user.lastActive}</td>
                                            <td className="px-4 py-4 text-right">
                                                <Button size="sm" variant="secondary" className="text-xs py-1 px-3">Review</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Add/Edit Food Modal */}
            {isFoodModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsFoodModalOpen(false)}></div>

                    {/* Modal Content */}
                    <GlassCard className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 p-6 md:p-8">
                        <button
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                            onClick={() => setIsFoodModalOpen(false)}
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-2xl font-bold text-slate-800 mb-6">
                            {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
                        </h3>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Food Name"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Greek Yogurt"
                                />
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-slate-700">Category</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <Input
                                        label="Serving Size"
                                        required
                                        value={formData.servingSize}
                                        onChange={e => setFormData({ ...formData, servingSize: e.target.value })}
                                        placeholder="e.g. 1 cup (245g)"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Nutritional Values (Per Serving)</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <Input
                                        label="Calories (kcal)"
                                        type="number"
                                        min="0"
                                        required
                                        value={formData.nutrients.calories || ''}
                                        onChange={e => handleNutrientChange('calories', e.target.value)}
                                    />
                                    <Input
                                        label="Protein (g)"
                                        type="number"
                                        min="0" step="0.1"
                                        required
                                        value={formData.nutrients.protein || ''}
                                        onChange={e => handleNutrientChange('protein', e.target.value)}
                                    />
                                    <Input
                                        label="Iron (mg)"
                                        type="number"
                                        min="0" step="0.1"
                                        required
                                        value={formData.nutrients.iron || ''}
                                        onChange={e => handleNutrientChange('iron', e.target.value)}
                                    />
                                    <Input
                                        label="Vitamin C (mg)"
                                        type="number"
                                        min="0" step="0.1"
                                        required
                                        value={formData.nutrients.vitC || ''}
                                        onChange={e => handleNutrientChange('vitC', e.target.value)}
                                    />
                                    <Input
                                        label="Vitamin D (mcg)"
                                        type="number"
                                        min="0" step="0.1"
                                        required
                                        value={formData.nutrients.vitD || ''}
                                        onChange={e => handleNutrientChange('vitD', e.target.value)}
                                    />
                                    <Input
                                        label="Zinc (mg)"
                                        type="number"
                                        min="0" step="0.1"
                                        required
                                        value={formData.nutrients.zinc || ''}
                                        onChange={e => handleNutrientChange('zinc', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <Button type="button" variant="secondary" onClick={() => setIsFoodModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingFood ? 'Save Changes' : 'Add Food Item'}
                                </Button>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            )}
        </div>
    );
};
