import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, BarChart3, Clock, ArrowRight, Star, House } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function Landing() {
    return (
        <div className="min-h-screen overflow-hidden">
            <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                <Star size={14} className="fill-primary" />
                                Web-first restaurant POS
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-dark leading-tight">
                                Run your <span className="text-primary">Restaurant</span> Smarter & Faster.
                            </h1>
                            <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
                                QuickPOS Lite keeps billing, staff, and inventory inside one responsive browser experience built for Sri Lanka.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link to="/login">
                                    <Button size="lg" className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg shadow-xl shadow-primary/20">
                                        Open POS Terminal
                                        <ArrowRight size={20} className="ml-2" />
                                    </Button>
                                </Link>
                                <a href="#features">
                                    <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg">
                                        See Features
                                    </Button>
                                </a>
                            </div>
                        </div>

                        <div className="relative lg:block">
                            <div className="relative bg-white rounded-[2rem] shadow-2xl border border-white/70 p-3">
                                <img
                                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1000"
                                    alt="POS Interface"
                                    className="rounded-[1.6rem] w-full"
                                />
                                <div className="absolute top-10 -right-4 bg-white p-4 rounded-2xl shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                            <ShoppingBag size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">New Order</p>
                                            <p className="text-sm font-bold text-dark">$45.50 Paid</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-10 -left-4 bg-white p-4 rounded-2xl shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                                            <BarChart3 size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Daily Revenue</p>
                                            <p className="text-sm font-bold text-dark">+$1,240.00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="bg-white/70 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-4xl font-black text-dark tracking-tight">Everything you need to run the floor</h2>
                        <p className="text-slate-500">Fast checkout, clear reporting, and secure access control inside a clean browser app.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Lightning Fast Billing', desc: 'Process orders in seconds with a clean touchscreen-friendly interface.', icon: Clock, color: 'bg-orange-500' },
                            { title: 'Detailed Analytics', desc: 'Track sales, top items, and busy hours with modern reporting screens.', icon: BarChart3, color: 'bg-blue-500' },
                            { title: 'Secure & Reliable', desc: 'JWT auth and role-based access keep staff workflows separated.', icon: ShieldCheck, color: 'bg-emerald-500' },
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
                                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center text-white mb-6`}>
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-dark mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-dark rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-primary/10" />
                    <div className="relative space-y-8">
                        <h2 className="text-4xl lg:text-5xl font-black text-white">Ready to modernize your restaurant?</h2>
                        <p className="text-slate-300 text-lg max-w-xl mx-auto">Everything is designed for the browser, so staff can work from the devices they already have.</p>
                        <div className="flex justify-center pt-4">
                            <Link to="/login">
                                <Button size="lg" className="bg-white text-dark hover:bg-slate-100 px-10 py-5 rounded-2xl text-xl font-black shadow-2xl">
                                    Start Billing Now
                                </Button>
                            </Link>
                        </div>
                        <div className="pt-2">
                            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors">
                                <House size={16} />
                                Back to landing
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
