
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function CashierLayout() {
    return (
        <div className="min-h-screen bg-light pt-16">
            <Navbar />
            <main className="h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden">
                <div className="page-shell py-8 sm:py-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
