import { useState } from 'react';
import { Store, Bell, Shield, Printer, Save, Globe, Moon, Sun } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useTheme } from '../../context/ThemeContext';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('shop');
    const { isDark, toggle } = useTheme();

    const tabs = [
        { id: 'shop', label: 'Shop Info', icon: Store },
        { id: 'localization', label: 'Localization', icon: Globe },
        { id: 'appearance', label: 'Appearance', icon: isDark ? Moon : Sun },
        { id: 'receipt', label: 'Receipt Printer', icon: Printer },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Administration</p>
                <h1 className="text-3xl font-bold text-dark mt-1">System Settings</h1>
                <p className="text-slate-500 text-sm">Configure your POS system preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-slate-600 hover:bg-white/80 hover:text-dark'
                                }`}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1">
                    {activeTab === 'shop' && (
                        <Card title="Shop Information" subtitle="Update your business details shown on receipts">
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <Input label="Business Name" defaultValue="QuickPOS Lite" />
                                    </div>
                                    <Input label="Email Address" defaultValue="contact@quickpos.com" />
                                    <Input label="Phone Number" defaultValue="+1 (234) 567-890" />
                                    <div className="md:col-span-2">
                                        <Input label="Physical Address" defaultValue="123 Restaurant Street, City Center" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700 block mb-1.5">Shop Logo</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold">
                                                QP
                                            </div>
                                            <Button variant="secondary" size="sm">Change Logo</Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <Button className="flex items-center gap-2">
                                        <Save size={18} />
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {activeTab === 'appearance' && (
                        <Card title="Appearance" subtitle="Customize the look and feel of the POS">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-light rounded-2xl border border-border">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${isDark ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'}`}>
                                            {isDark ? <Moon size={24} /> : <Sun size={24} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-dark text-lg">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
                                            <p className="text-xs text-gray">
                                                {isDark ? 'Easy on the eyes for night shifts' : 'Clean and bright for daytime use'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggle}
                                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${isDark ? 'bg-primary' : 'bg-gray-200'}`}
                                    >
                                        <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                                <p className="text-xs text-gray">
                                    Dark mode reduces eye strain during long shifts. The setting is saved automatically and applies across all pages.
                                </p>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'localization' && (
                        <Card title="Localization" subtitle="Currency and regional settings">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-slate-700">Currency Symbol</label>
                                        <select className="rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                                            <option>USD ($)</option>
                                            <option>EUR (€)</option>
                                            <option>GBP (£)</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-slate-700">Timezone</label>
                                        <select className="rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                                            <option>UTC (Greenwich Mean Time)</option>
                                            <option>EST (Eastern Standard Time)</option>
                                            <option>PST (Pacific Standard Time)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'receipt' && (
                        <Card title="Receipt Settings" subtitle="Configure how receipts are printed">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100/80 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-xl text-primary shadow-sm">
                                                <Printer size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-dark">Auto-print Receipt</p>
                                                <p className="text-xs text-slate-500">Automatically print receipt after checkout</p>
                                            </div>
                                        </div>
                                        <input type="checkbox" className="w-5 h-5 accent-primary" defaultChecked />
                                    </label>

                                    <Input label="Receipt Footer Message" defaultValue="Thank you for your visit!" />

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-slate-700">Paper Size</label>
                                        <select className="rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                                            <option>80mm (Thermal)</option>
                                            <option>58mm (Thermal)</option>
                                            <option>A4 (Standard)</option>
                                        </select>
                                    </div>
                                </div>
                                <Button className="w-full">Test Printer</Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
