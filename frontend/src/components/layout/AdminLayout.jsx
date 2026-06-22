
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <main className="pl-64 min-h-screen overflow-y-auto overflow-x-hidden">
                <div className="page-shell py-6 sm:py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
