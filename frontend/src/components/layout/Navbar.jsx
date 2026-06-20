
import { Link } from 'react-router-dom';
import { LogOut, History, Home, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { logout } = useAuth();

    return (
        <header className="h-16 fixed top-0 left-0 right-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <Link to="/pos" className="flex items-center gap-3 text-lg font-bold text-dark">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">Q</div>
                <div className="leading-tight">
                    <div>QuickPOS Lite</div>
                    <div className="text-xs font-medium text-slate-500">Cashier workspace</div>
                </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
                <Link to="/pos" className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-primary font-semibold px-3 py-2 rounded-xl hover:bg-slate-100/80 transition-colors">
                    <Home className="w-5 h-5" />
                    POS
                </Link>
                <Link to="/orders" className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-primary font-semibold px-3 py-2 rounded-xl hover:bg-slate-100/80 transition-colors">
                    <History className="w-5 h-5" />
                    History
                </Link>
                <Link to="/profile" className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-primary font-semibold px-3 py-2 rounded-xl hover:bg-slate-100/80 transition-colors">
                    <User className="w-5 h-5" />
                    Profile
                </Link>
                <button
                    onClick={logout}
                    className="bg-slate-100/80 text-slate-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </button>
            </div>
        </header>
    );
}
