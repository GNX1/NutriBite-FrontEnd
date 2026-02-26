import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Calendar as CalendarIcon, User as UserIcon, Shield, LogOut } from 'lucide-react';
import { StoreProvider } from './store/StoreContext';
import { useStore } from './store/StoreContext';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { LogMeal } from './pages/LogMeal';
import { Plan } from './pages/Plan';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData, setUserData } = useStore();
    const isAdmin = userData.isAdmin;

    // Home destination depends on role
    const homePath = isAdmin ? '/admin' : '/dashboard';

    // Hide navbar on landing page
    if (location.pathname === '/') return null;

    const handleLogout = () => {
        // Reset role flag and go to landing page
        setUserData(prev => ({ ...prev, isAdmin: false }));
        navigate('/');
    };

    return (
        <>
            {/* Desktop Top Navbar */}
            <header className="hidden md:flex px-6 py-4 bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-50 items-center justify-between">
                {/* Logo → role-aware home */}
                <Link to={homePath}>
                    <h1 className="text-2xl font-bold text-gradient-primary tracking-tight">NutriBite</h1>
                </Link>

                <nav className="flex gap-6 items-center">
                    {isAdmin ? (
                        /* Admin nav links */
                        <>
                            <Link to="/admin" className={`text-sm font-semibold transition-colors ${location.pathname === '/admin' ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}>Dashboard</Link>
                        </>
                    ) : (
                        /* User nav links */
                        <>
                            <Link to="/dashboard" className={`text-sm font-semibold transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}>Dashboard</Link>
                            <Link to="/log-meal" className={`text-sm font-semibold transition-colors ${location.pathname === '/log-meal' ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}>Log Food</Link>
                            <Link to="/plan" className={`text-sm font-semibold transition-colors ${location.pathname === '/plan' ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}>My Plan</Link>
                            <Link to="/profile" className={`text-sm font-semibold transition-colors ${location.pathname === '/profile' ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}>Profile</Link>
                        </>
                    )}
                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-lg text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-100"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </nav>
            </header>

            {/* Mobile Bottom Tabs */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 z-[100] pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center h-16 px-2">
                    <Link to={homePath} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${(location.pathname === '/dashboard' || location.pathname === '/admin') ? 'text-primary' : 'text-slate-500 hover:text-slate-800'}`}>
                        <Home size={20} />
                        <span className="text-[10px] font-semibold">Home</span>
                    </Link>
                    {!isAdmin && (
                        <Link to="/plan" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${location.pathname === '/plan' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'}`}>
                            <CalendarIcon size={20} />
                            <span className="text-[10px] font-semibold">Plan</span>
                        </Link>
                    )}
                    {!isAdmin && (
                        <div className="relative -top-5 flex justify-center w-full">
                            <Link to="/log-meal" className="bg-primary text-white p-3.5 rounded-full shadow-lg shadow-primary/30 hover:scale-105 transition-transform flex items-center justify-center border-4 border-slate-50">
                                <PlusCircle size={24} />
                            </Link>
                        </div>
                    )}
                    {!isAdmin && (
                        <Link to="/profile" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${location.pathname === '/profile' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'}`}>
                            <UserIcon size={20} />
                            <span className="text-[10px] font-semibold">Profile</span>
                        </Link>
                    )}
                    {!isAdmin && (
                        <Link to="/admin" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${location.pathname === '/admin' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'}`}>
                            <Shield size={20} />
                            <span className="text-[10px] font-semibold">Admin</span>
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-red-500 hover:text-red-700`}
                    >
                        <LogOut size={20} />
                        <span className="text-[10px] font-semibold">Logout</span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default function App() {
    return (
        <StoreProvider>
            <Router>
                <div className="min-h-screen bg-slate-50 text-slate-900 font-inter pb-20 md:pb-0">
                    <Navigation />
                    <main className="p-4 md:p-8 max-w-7xl mx-auto">
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/log-meal" element={<LogMeal />} />
                            <Route path="/plan" element={<Plan />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/admin" element={<Admin />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </StoreProvider>
    );
}
