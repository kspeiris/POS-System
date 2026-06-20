
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, BarChart3, Clock, ArrowRight, Star } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Hero Section */}
            <div className="relative pt-20 pb-16 lg:pt-32 lg:pb-24">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-in slide-in-from-left duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                <Star size={14} className="fill-primary" />
                                #1 Rated Restaurant POS System
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-dark leading-tight">
                                Run your <span className="text-primary">Restaurant</span> Smarter & Faster.
                            </h1>
                            <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
                                QuickPOS Lite provides everything you need to manage your billing, staff, and inventory in one beautiful, simple interface.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link to="/login">
                                    <Button size="lg" className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg shadow-xl shadow-primary/30">
                                        Open POS Terminal
                                        <ArrowRight size={20} className="ml-2" />
                                    </Button>
                                </Link>
                                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg">
                                    View Demo
                                </Button>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400 font-medium pt-8">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                            U{i}
                                        </div>
                                    ))}
                                </div>
                                <span>Trusted by 500+ Local Restaurants</span>
                            </div>
                        </div>

                        {/* Hero Image / UI Mockup */}
                        <div className="relative lg:block animate-in slide-in-from-right zoom-in-95 duration-1000">
                            <div className="relative bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-2 overflow-hidden overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1000"
                                    alt="POS Interface"
                                    className="rounded-[1.6rem] w-full"
                                />
                                {/* Floating Badges */}
                                <div className="absolute top-10 -right-4 bg-white p-4 rounded-2xl shadow-xl animate-bounce duration-[3000ms]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                                            <ShoppingBag size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">New Order</p>
                                            <p className="text-sm font-bold text-dark">$45.50 Paid</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-10 -left-4 bg-white p-4 rounded-2xl shadow-xl animate-pulse duration-[4000ms]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                                            <BarChart3 size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Daily Revenue</p>
                                            <p className="text-sm font-bold text-dark">+$1,240.00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-4xl font-black text-dark tracking-tight">Everything You Need to Scale</h2>
                        <p className="text-gray-500">Simplify your operations with our suite of powerful tools designed for modern food бизнеса.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Lightning Fast Billing', desc: 'Process orders in seconds with our optimized touchscreen interface.', icon: Clock, color: 'bg-orange-500' },
                            { title: 'Detailed Analytics', desc: 'Track sales, top items, and busy hours with real-time reporting.', icon: BarChart3, color: 'bg-blue-500' },
                            { title: 'Secure & Reliable', desc: 'Enterprise-grade security for your payments and customer data.', icon: ShieldCheck, color: 'bg-green-500' },
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group">
                                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-dark mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-dark rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-primary/10" />
                    <div className="relative space-y-8">
                        <h2 className="text-4xl lg:text-5xl font-black text-white">Ready to modernize your restaurant?</h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">Join hundreds of owners who saved over 10 hours a week on administration.</p>
                        <div className="flex justify-center pt-4">
                            <Link to="/login">
                                <Button size="lg" className="bg-white text-dark hover:bg-gray-100 px-10 py-5 rounded-2xl text-xl font-black shadow-2xl">
                                    Start Billing Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-dark font-black text-xl italic underline decoration-primary decoration-4 underline-offset-4">
                        QUICKPOS
                    </div>
                    <p className="text-gray-400 text-sm">© 2024 QuickPOS Lite. All rights reserved.</p>
                    <div className="flex gap-8 text-sm font-bold text-gray-500">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
