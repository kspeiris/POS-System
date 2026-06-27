
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function CashierLayout() {
    const location = useLocation();
    return (
        <div className="min-h-screen pt-16">
            <Navbar />
            <main className="h-[calc(100vh-64px)] overflow-hidden">
                <div key={location.pathname} className="h-full animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
