
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import clsx from 'clsx';

// Validation Schema
const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
        const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');

    
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            setServerError('');
            const user = await login(data.email, data.password);

            // Redirect based on role
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/pos');
            }
        } catch (error) {
            setServerError(error.message);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-50 blur-3xl" />
            </div>

            <div className="w-full max-w-[460px] text-center z-10">
                <div className="mx-auto mb-5 w-[110px] h-[110px] rounded-[2rem] bg-white/80 backdrop-blur border border-white/70 shadow-modal flex items-center justify-center">
                    <svg width="78" height="78" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="25" y="20" width="50" height="40" rx="8" fill="#2563EB" />
                        <rect x="28" y="23" width="44" height="34" rx="6" fill="#60A5FA" />
                        <path d="M40 35 L48 43 L60 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="30" y="60" width="40" height="10" rx="5" fill="#1D4ED8" />
                        <path d="M35 60 V75 C35 75 35 80 40 80 H60 C65 80 65 75 65 75 V60" fill="#E5E7EB" />
                    </svg>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-2">Welcome back</h1>
                <p className="text-gray mb-6 sm:mb-8">Sign in to access cashier tools, inventory, and reporting.</p>

                <div className="glass p-8 sm:p-10 rounded-[2rem] text-left">
                    {serverError && (
                        <div className="mb-4 p-3 bg-light-red text-danger text-sm rounded-xl border border-light-red flex items-center gap-2">
                            <span className="font-bold">Error:</span> {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray w-5 h-5" />
                                <input
                                    type="email"
                                    {...register('email')}
                                    className={clsx(
                                        "w-full pl-11 pr-4 py-3 border rounded-xl text-dark bg-white/90 shadow-sm focus:outline-none focus:ring-2 transition-all",
                                        errors.email
                                            ? "border-danger focus:ring-danger/20"
                                            : "border-border focus:border-primary focus:ring-primary/20"
                                    )}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register('password')}
                                    className={clsx(
                                        "w-full pl-11 pr-11 py-3 border rounded-xl text-dark bg-white/90 shadow-sm focus:outline-none focus:ring-2 transition-all",
                                        errors.password
                                            ? "border-danger focus:ring-danger/20"
                                            : "border-border focus:border-primary focus:ring-primary/20"
                                    )}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray hover:text-dark-2"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-danger">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-card"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
                        </button>

                        <div className="text-center mt-4">
                            <a href="#" className="text-primary hover:underline text-sm font-medium">Forgot password?</a>
                        </div>

                    </form>

                    <div className="mt-6 pt-5 border-t border-border text-center text-xs text-gray space-y-1">
                        <p>Demo Credentials:</p>
                        <p>Admin: admin@pos.com / admin123</p>
                        <p>Cashier: cashier@pos.com / cashier123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
