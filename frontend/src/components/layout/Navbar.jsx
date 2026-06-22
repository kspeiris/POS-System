
import { Link } from 'react-router-dom';
import { LogOut, History, Home, User, LineChart, House } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { logout } = useAuth();

    return (
        <header className="h-16 fixed top-0 left-0 right-0 z-20 border-b border-border/70 bg-white/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between shadow-card">
            <Link to="/" className="flex items-center gap-3 text-lg font-bold text-dark">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-success rounded-2xl flex items-center justify-center text-white shadow-card">Q</div>
                <div className="leading-tight">
                    <div>QuickPOS Lite</div>
                    <div className="text-xs font-medium text-gray">Sri Lanka POS</div>
                </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
                <Link to="/" className="hidden sm:flex items-center gap-2 text-dark-2 hover:text-primary font-semibold px-3 py-2 rounded-xl hover:bg-light transition-colors">
                    <House className="w-5 h-5" />
                    Home
                </Link>
                <Link to="/pos" className="hidden sm:flex items-center gap-2 text-dark-2 hover:text-primary font-semibold px-3 py-2 rounded-xl hover:bg-light transition-colors">
                    <Home className="w-5 h-5" />
                    POS
                </Link>
                <Link to="/analysis" className="hidden sm:flex items-center gap-2 text-dark-2 hover:text-primary font-semibold px-3 py-2 rounded-xl hover:bg-light transition-colors">
                    <LineChart className="w-5 h-5" />
                    Analysis
                </Link>
                <Link to="/orders" className="hidden sm:flex items-center gap-2 text-dark-2 hover:text-primary font-semibold px-3 py-2 rounded-xl hover:bg-light transition-colors">
                    <History className="w-5 h-5" />
                    History
                </Link>
                <Link to="/profile" className="hidden sm:flex items-center gap-2 text-dark-2 hover:text-primary font-semibold px-3 py-2 rounded-xl hover:bg-light transition-colors">
                    <User className="w-5 h-5" />
                    Profile
                </Link>
                <button
                    onClick={logout}
                    className="bg-light text-dark-2 px-4 py-2 rounded-xl font-semibold hover:bg-light-red hover:text-danger flex items-center gap-2 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </button>
            </div>
        </header>
    );
}
