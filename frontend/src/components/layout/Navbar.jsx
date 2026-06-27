
import { Link } from 'react-router-dom';
import { LogOut, History, Home, User, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
    const { logout } = useAuth();
    const { isDark, toggle } = useTheme();

    return (
        <header className="h-16 fixed top-0 left-0 right-0 z-20 border-b border-border bg-white/80 dark:bg-white/5 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between shadow-[0_12px_40px_rgba(15,23,42,0.05)] dark:shadow-none">
            <Link to="/pos" className="flex items-center gap-3 text-lg font-bold text-dark">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">Q</div>
                <div className="leading-tight">
                    <div>QuickPOS Lite</div>
                    <div className="text-xs font-medium text-gray">Cashier workspace</div>
                </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
                <Link to="/pos" className="hidden sm:flex items-center gap-2 text-gray hover:text-primary font-semibold px-3 py-2 rounded-xl hover:bg-light transition-colors">
                    <Home className="w-5 h-5" />
                    POS
                </Link>
                <Link to="/orders" className="hidden sm:flex items-center gap-2 text-gray hover:text-primary font-semibold px-3 py-2 rounded-xl hover:bg-light transition-colors">
                    <History className="w-5 h-5" />
                    History
                </Link>
                <Link to="/profile" className="hidden sm:flex items-center gap-2 text-gray hover:text-primary font-semibold px-3 py-2 rounded-xl hover:bg-light transition-colors">
                    <User className="w-5 h-5" />
                    Profile
                </Link>
                <button
                    onClick={toggle}
                    className="p-2 rounded-xl text-gray hover:bg-light transition-colors"
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                    onClick={logout}
                    className="bg-light text-gray px-4 py-2 rounded-xl font-semibold hover:bg-light-red hover:text-danger flex items-center gap-2 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </button>
            </div>
        </header>
    );
}
