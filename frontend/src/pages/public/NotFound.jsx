
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-light flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-8">
                <h1 className="text-[12rem] font-black text-gray-200 leading-none select-none">404</h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-bounce">
                        <span className="text-4xl">🍕</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4 max-w-md">
                <h2 className="text-3xl font-bold text-dark">Whoops! Page Not Found</h2>
                <p className="text-gray-500">
                    It looks like the page you are looking for has been moved or doesn't exist. Maybe it was a limited time offer?
                </p>
                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="secondary" onClick={() => navigate(-1)} className="flex items-center gap-2">
                        <ArrowLeft size={18} />
                        Go Back
                    </Button>
                    <Button onClick={() => navigate('/')} className="flex items-center gap-2">
                        <Home size={18} />
                        Home Page
                    </Button>
                </div>
            </div>

            {/* Support info */}
            <div className="mt-20 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-400">
                    Need help? Contact our support team at <span className="font-medium text-primary">support@quickpos.com</span>
                </p>
            </div>
        </div>
    );
}
