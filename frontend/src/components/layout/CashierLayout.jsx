
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function CashierLayout() {
    return (
        <div className="min-h-screen pt-16">
            <Navbar />
            <main className="h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden">
                <div className="page-shell py-6 sm:py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
