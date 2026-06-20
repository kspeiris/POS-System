
import { Link } from 'react-router-dom';

export default function Unauthorized() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <div className="max-w-md glass rounded-[2rem] p-8">
                <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Access denied</p>
                <h1 className="text-3xl font-bold text-dark mt-2 mb-4">Unauthorized Access</h1>
                <p className="mb-6 text-slate-500">You do not have permission to view this page.</p>
                <Link to="/" className="inline-flex px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors">
                    Go Home
                </Link>
            </div>
        </div>
    );
}
