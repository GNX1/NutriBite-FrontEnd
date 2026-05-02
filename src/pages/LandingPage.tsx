import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Sparkles, ArrowRight, ShieldCheck, Search, BarChart2, CalendarCheck, RefreshCw,
    Star, Zap, Users, Award
} from 'lucide-react';
import { useStore } from '../store/StoreContext';

const STATS = [
    { icon: '👧', value: '50K+', label: 'Happy Kids' },
    { icon: '🍎', value: '200+', label: 'Foods Tracked' },
    { icon: '⭐', value: '95%', label: 'Parent Satisfaction' },
    { icon: '👨‍⚕️', value: '40+', label: 'Expert Nutritionists' },
];

const FEATURES = [
    { icon: <Search size={22} />, title: 'Detect Deficiencies', desc: 'Instantly scan for missing nutrients based on your meals', color: 'bg-purple-100 text-purple-600' },
    { icon: <CalendarCheck size={22} />, title: 'Smart Meal Plans', desc: 'Personalized 7-day plans tailored to your child\'s needs', color: 'bg-emerald-100 text-emerald-600' },
    { icon: <BarChart2 size={22} />, title: 'Progress Tracking', desc: 'Visual charts showing nutrient intake over time', color: 'bg-blue-100 text-blue-600' },
    { icon: <RefreshCw size={22} />, title: 'Smart Swaps', desc: 'Easy food swaps to boost nutrition without the fight', color: 'bg-amber-100 text-amber-600' },
];

const STEPS = [
    { num: '01', icon: '🥗', title: 'Log Your Meals', desc: 'Quickly add what your child ate — breakfast, lunch, dinner, and snacks', color: 'from-orange-400 to-red-500' },
    { num: '02', icon: '🔍', title: 'Scan for Deficits', desc: 'Our algorithm checks against age-appropriate nutrient targets instantly', color: 'from-blue-400 to-indigo-500' },
    { num: '03', icon: '📋', title: 'Get Smart Plans', desc: 'Receive a personalized 7-day meal plan to fill nutritional gaps', color: 'from-emerald-400 to-teal-500' },
];

const TESTIMONIALS = [
    { text: '"My daughter finally gets excited about vegetables! NutriBite made it a game."', name: 'Jessica M.', role: 'Parent of a 10-year-old', avatar: '👩' },
    { text: '"This tool helps parents understand exactly what nutrients their kids are missing."', name: 'Dr. Arjun P.', role: "Pediatric Nutrition Dr.", avatar: '👨‍⚕️' },
    { text: '"The deficit alerts are amazing. Fixed my son\'s iron issue within a month!"', name: 'Carlos R.', role: 'Parent of twins', avatar: '👨' },
];

type AuthRole = 'USER' | 'ADMIN';
type AuthMode = 'login' | 'signup';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { setUserData } = useStore();

    // ─── kept intact (used by other buttons / CTA section) ───────────────────
    const handleDemoLogin = () => {
        setUserData(prev => ({ ...prev, isAdmin: false }));
        navigate('/dashboard');
    };

    const handleAdminLogin = () => {
        setUserData(prev => ({ ...prev, isAdmin: true }));
        navigate('/admin');
    };

    // ─── modal state ─────────────────────────────────────────────────────────
    const [modalOpen, setModalOpen] = useState(false);
    const [modalRole, setModalRole] = useState<AuthRole>('USER');
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [authError, setAuthError] = useState('');

    const openModal = (role: AuthRole) => {
        setModalRole(role);
        setAuthMode('login');
        setEmail('');
        setPassword('');
        setConfirmPwd('');
        setAuthError('');
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const handleAuthSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            setAuthError('Email and password are required.');
            return;
        }

        if (authMode === 'signup' && password !== confirmPwd) {
            setAuthError('Passwords do not match.');
            return;
        }

        try {
            let res;

            if (authMode === 'login') {
                // 🔐 LOGIN
                res = await fetch(`https://terrific-empathy-production-6b32.up.railway.app/api/auth/${authMode}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });

                const text = await res.text();

                let data;

                try {
                    data = JSON.parse(text);
                } catch {
                    data = text;
                }

                if (typeof data === "object" && data.email) {
                    setUserData(prev => ({
                        ...prev,
                        email: data.email,
                        isAdmin: data.role === "ADMIN" || data.role === "Admin"
                    }));

                    closeModal();

                    if (data.role === "Admin" || data.role === "ADMIN") {
                        navigate('/admin');
                    } else if (data.role === "User" || data.role === "USER") {
                        navigate('/profile');
                    } else {
                        navigate('/dashboard');
                    }
                } else {
                    setAuthError(data);
                }

            } else {
                // 🧾 SIGNUP
                res = await fetch(`https://terrific-empathy-production-6b32.up.railway.app/api/auth/${authMode}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        role: modalRole
                    })
                });

                const msg = await res.text();

                alert(msg);

                // after signup → switch to login
                setAuthMode('login');
            }

        } catch (err) {
            console.error(err);
            setAuthError("Server error");
        }
    };

    return (
        <>
            <div className="min-h-screen bg-white font-inter text-slate-800 overflow-x-hidden">

                {/* Top Nav */}
                <header className="flex items-center justify-between px-6 md:px-16 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-800">NutriBite</span>
                    </div>
                    <nav className="flex items-center gap-6">
                        <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">Log In</button>
                        <button
                            onClick={handleDemoLogin}
                            className="bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                            Get Started
                        </button>
                    </nav>
                </header>

                {/* Hero */}
                <section className="relative px-6 md:px-16 py-16 md:py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50/30 to-white pointer-events-none" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />

                    <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-6">
                                <Sparkles size={12} /> Powered by nutrition science for kids
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                                Track your bites,<br />
                                <span className="text-emerald-500">grow strong! 💪</span>
                            </h1>
                            <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
                                NutriBite helps parents and kids track daily nutrition, detect deficiencies early, and get personalized diet plans — making healthy eating fun! 🥗 👍
                            </p>
                            <div className="flex items-center gap-3 mb-8">
                                <button
                                    onClick={handleDemoLogin}
                                    className="flex items-center gap-2 bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors shadow-lg shadow-slate-900/20"
                                >
                                    Start for Free <ArrowRight size={18} />
                                </button>
                                <button
                                    onClick={handleAdminLogin}
                                    className="flex items-center gap-2 bg-white text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-400 transition-colors"
                                >
                                    View Demo <ArrowRight size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                                <span className="font-medium ml-1">50K+ kids tracked this week</span>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="flex justify-center">
                            <div className="relative w-full max-w-md">
                                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 p-6 border border-slate-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <div className="font-bold text-slate-800">Alex's Nutrients</div>
                                            <div className="text-xs text-slate-500">Today's overview 📊</div>
                                        </div>
                                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">🔴 Deficit found!</span>
                                    </div>
                                    {/* Mock radar blob */}
                                    <div className="h-40 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <div className="relative w-32 h-32">
                                            <div className="absolute inset-0 border-2 border-dashed border-teal-200/60 rounded-full"></div>
                                            <div className="absolute inset-[18%] bg-teal-400/20 border border-teal-400/40 rounded-full transform rotate-12"></div>
                                            <div className="absolute inset-[30%] bg-teal-500/30 border border-teal-500/60 rounded-full"></div>
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-600">Protein</div>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-600">Vit C</div>
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-600">Calcium</div>
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-600">Vit D</div>
                                        </div>
                                    </div>
                                    <div className="text-right text-2xl font-black text-slate-800 -mt-2 mb-3">72% <span className="text-sm font-normal text-slate-400">Goal Met</span></div>
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-3 items-start">
                                        <span className="text-xl">⚠️</span>
                                        <div>
                                            <div className="text-sm font-bold text-amber-800">Vitamin D low!</div>
                                            <div className="text-xs text-amber-700/80">Add salmon or fortified milk 🥛</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-center text-xs font-bold text-blue-700">
                                        🔵 +15 nutrients today
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Strip */}
                <section className="bg-emerald-500 py-10">
                    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6 text-white text-center">
                        {STATS.map(s => (
                            <div key={s.label}>
                                <div className="text-3xl mb-1">{s.icon}</div>
                                <div className="text-3xl font-black">{s.value}</div>
                                <div className="text-emerald-100 text-sm font-medium mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section className="py-20 px-6 md:px-16 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Everything your family needs 🌟</h2>
                            <p className="text-slate-500 max-w-lg mx-auto">From tracking bites to building habits — NutriBite makes healthy eating simple, fun, and effective for children of all ages.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {FEATURES.map(f => (
                                <div key={f.title} className="bg-slate-50 rounded-2xl p-6 hover:shadow-md transition-shadow border border-slate-100">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>{f.icon}</div>
                                    <h4 className="font-bold text-slate-800 mb-2 text-sm">{f.title}</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* DEMO ACCESS CARDS — Center Section */}
                <section className="py-20 px-6 md:px-16 bg-gradient-to-br from-slate-50 to-emerald-50/50">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-4">
                            <Zap size={12} /> Instant Access — No Sign Up Required
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Try NutriBite right now 🚀</h2>
                        <p className="text-slate-500 text-lg">Choose your role and experience the full platform instantly.</p>
                    </div>

                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Demo Card */}
                        <motion.div
                            whileHover={{ scale: 1.02, y: -4 }}
                            transition={{ type: 'spring', damping: 15 }}
                            onClick={handleDemoLogin}
                            className="cursor-pointer bg-white rounded-3xl p-8 shadow-xl shadow-emerald-100 border-2 border-emerald-200 hover:border-emerald-400 transition-colors group"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-emerald-200">
                                👧
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">User Demo Account</h3>
                            <p className="text-slate-500 mb-1 font-semibold">Riya Patel — Age 12, Student</p>
                            <p className="text-slate-400 text-sm mb-6">Experience the full nutrition tracking flow — log meals, see deficiency alerts, track your streak, and unlock achievements.</p>
                            <ul className="space-y-2 mb-8 text-sm text-slate-600">
                                <li className="flex gap-2 items-center"><span className="text-emerald-500 font-bold">✓</span> Live Nutrient Radar Chart</li>
                                <li className="flex gap-2 items-center"><span className="text-emerald-500 font-bold">✓</span> Log Meals + Calc Impact</li>
                                <li className="flex gap-2 items-center"><span className="text-emerald-500 font-bold">✓</span> 7-Day Personalized Plan</li>
                                <li className="flex gap-2 items-center"><span className="text-emerald-500 font-bold">✓</span> Points & Streak Gamification</li>
                            </ul>
                            <button
                                onClick={e => { e.stopPropagation(); openModal('USER'); }}
                                className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
                            >
                                Login User <ArrowRight size={18} />
                            </button>
                        </motion.div>

                        {/* Admin Demo Card */}
                        <motion.div
                            whileHover={{ scale: 1.02, y: -4 }}
                            transition={{ type: 'spring', damping: 15 }}
                            onClick={handleAdminLogin}
                            className="cursor-pointer bg-white rounded-3xl p-8 shadow-xl shadow-slate-100 border-2 border-slate-200 hover:border-indigo-300 transition-colors group"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-indigo-200">
                                👨‍⚕️
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Admin Demo Account</h3>
                            <p className="text-slate-500 mb-1 font-semibold">Dr. Sanjay Mehta — Pediatric Nutritionist</p>
                            <p className="text-slate-400 text-sm mb-6">Access the full admin panel — view platform analytics, manage the food database, and monitor user health interventions.</p>
                            <ul className="space-y-2 mb-8 text-sm text-slate-600">
                                <li className="flex gap-2 items-center"><span className="text-indigo-500 font-bold">✓</span> 12+ Platform Analytics Charts</li>
                                <li className="flex gap-2 items-center"><span className="text-indigo-500 font-bold">✓</span> Full CRUD Food Database</li>
                                <li className="flex gap-2 items-center"><span className="text-indigo-500 font-bold">✓</span> User Health Tracking</li>
                                <li className="flex gap-2 items-center"><span className="text-indigo-500 font-bold">✓</span> Deficiency Trend Reports</li>
                            </ul>
                            <button
                                onClick={e => { e.stopPropagation(); openModal('ADMIN'); }}
                                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-slate-700 transition-colors shadow-lg shadow-slate-900/10"
                            >
                                <ShieldCheck size={18} /> Login Admin
                            </button>
                        </motion.div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-20 px-6 md:px-16 bg-white">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">How NutriBite works 🚀</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {STEPS.map(s => (
                                <div key={s.num} className="text-center">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg relative`}>
                                        {s.icon}
                                        <div className="absolute -top-2 -right-2 bg-white text-xs font-black text-slate-700 border border-slate-200 rounded-full w-6 h-6 flex items-center justify-center shadow-sm">{s.num.substring(1)}</div>
                                    </div>
                                    <h4 className="font-extrabold text-slate-800 text-lg mb-2">{s.title}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 px-6 md:px-16 bg-slate-50">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">Loved by families & experts 💚</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {TESTIMONIALS.map(t => (
                                <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                    <div className="flex gap-1 mb-3">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                                    </div>
                                    <p className="text-slate-700 text-sm leading-relaxed mb-4 italic">{t.text}</p>
                                    <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center text-lg">{t.avatar}</div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{t.name}</div>
                                            <div className="text-slate-500 text-xs">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Footer */}
                <section className="py-16 px-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to start your journey? 🌱</h2>
                    <p className="text-emerald-100 mb-8 text-lg">Join 50,000+ families building healthier habits with NutriBite.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={handleDemoLogin} className="bg-white text-emerald-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-emerald-50 transition-colors flex items-center gap-2 shadow-lg">
                            <Users size={18} /> Try User Demo
                        </button>
                        <button onClick={handleAdminLogin} className="bg-white/20 backdrop-blur border border-white/30 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/30 transition-colors flex items-center gap-2">
                            <Award size={18} /> Try Admin Demo
                        </button>
                    </div>
                </section>

            </div>

            {/* ── Auth Modal ────────────────────────────────────────────────────── */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 p-8"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl leading-none"
                            aria-label="Close"
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <div className="mb-6 text-center">
                            <div className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl ${modalRole === 'ADMIN'
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                : 'bg-gradient-to-br from-emerald-400 to-teal-500'
                                }`}>
                                {modalRole === 'ADMIN' ? '👨‍⚕️' : '👧'}
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900">
                                {authMode === 'login' ? 'Welcome back!' : 'Create Account'}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                                {modalRole === 'ADMIN' ? 'Admin Portal' : 'User Dashboard'}
                            </p>
                        </div>

                        {/* Fields */}
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setAuthError(''); }}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setAuthError(''); }}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                            />
                            {authMode === 'signup' && (
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPwd}
                                    onChange={e => { setConfirmPwd(e.target.value); setAuthError(''); }}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                                />
                            )}
                        </div>

                        {/* Error */}
                        {authError && (
                            <p className="mt-3 text-xs text-red-500 text-center font-medium">{authError}</p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handleAuthSubmit}
                                className={`flex-1 font-bold py-2.5 rounded-xl text-sm transition-colors ${modalRole === 'ADMIN'
                                    ? 'bg-slate-900 text-white hover:bg-slate-700'
                                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                                    }`}
                            >
                                {authMode === 'login' ? 'Login' : 'Create Account'}
                            </button>
                            <button
                                onClick={() => {
                                    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
                                    setAuthError('');
                                    setConfirmPwd('');
                                }}
                                className="flex-1 font-bold py-2.5 rounded-xl text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                            >
                                {authMode === 'login' ? 'Create Account' : 'Back to Login'}
                            </button>
                        </div>

                        {/* Role tag */}
                        <p className="text-center text-xs text-slate-400 mt-4">
                            Signing in as <span className="font-semibold text-slate-600">{modalRole}</span>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};


