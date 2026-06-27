
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
    const location = useLocation();
    return (
        <div className="min-h-screen">
            <Sidebar />
            <main className="pl-64 min-h-screen">
                <div key={location.pathname} className="page-shell py-6 sm:py-8 animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
