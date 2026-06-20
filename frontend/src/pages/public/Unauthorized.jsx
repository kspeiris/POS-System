
import { Link } from 'react-router-dom';

export default function Unauthorized() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
            <p className="mb-4 text-gray-700">You do not have permission to view this page.</p>
            <Link to="/" className="text-primary hover:underline">Go Home</Link>
        </div>
    );
}
