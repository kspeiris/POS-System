
import { Outlet, useLocation } from 'react-router-dom';

export default function AuthLayout() {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    return (
        <div className={`min-h-screen ${isLanding ? 'block' : 'flex items-center justify-center px-4 py-8'}`}>
            <div className={`w-full ${isLanding ? '' : 'max-w-md'}`}>
                <Outlet />
            </div>
        </div>
    );
}
