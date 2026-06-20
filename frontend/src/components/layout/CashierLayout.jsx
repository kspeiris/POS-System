
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function CashierLayout() {
    return (
        <div className="min-h-screen pt-16">
            <Navbar />
            <main className="h-[calc(100vh-64px)] overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}
