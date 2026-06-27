
import { Link, useLocation } from 'react-router-dom';
import { Home, Box, Grid, Users, FileText, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export default function Sidebar() {
    const location = useLocation();
    const { logout } = useAuth();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: Home, label: 'Dashboard', path: '/admin' },
        { icon: Box, label: 'Products', path: '/admin/products' },
        { icon: Grid, label: 'Categories', path: '/admin/categories' },
        { icon: Users, label: 'Staff Management', path: '/admin/users' },
        { icon: FileText, label: 'Daily Reports', path: '/admin/reports/daily' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <aside className="w-64 fixed left-0 top-0 h-screen flex flex-col border-r border-border bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-[8px_0_40px_rgba(15,23,42,0.04)] dark:shadow-none">
            <div className="p-6 border-b border-border">
                <Link to="/admin" className="text-xl font-bold text-dark flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl flex items-center justify-center text-white text-sm shadow-lg shadow-primary/20">Q</div>
                    <div>
                        <div>QuickPOS</div>
                        <div className="text-xs font-medium text-gray">Admin Console</div>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                    className={clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                            isActive(item.path)
                                ? "bg-primary text-white shadow-lg shadow-primary/15"
                                : "text-gray hover:bg-light hover:text-dark"
                        )}
                    >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-danger hover:bg-light-red rounded-xl transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Log Out
                </button>
            </div>
        </aside>
    );
}
