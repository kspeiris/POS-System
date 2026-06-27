import { useState, useEffect } from 'react';
import { Store, Bell, Shield, Printer, Save, Globe, Plus, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';

import { taxApi } from '../../api/taxApi';
import api from '../../api/axios';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('shop');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [taxRules, setTaxRules] = useState([]);
    const [newTaxName, setNewTaxName] = useState('');
    const [newTaxRate, setNewTaxRate] = useState('');
    const [newTaxActive, setNewTaxActive] = useState(true);

    const tabs = [
        { id: 'shop', label: 'Shop Info', icon: Store },
        { id: 'localization', label: 'Localization', icon: Globe },
        { id: 'tax', label: 'Tax & VAT', icon: Shield },
        { id: 'receipt', label: 'Receipt Printer', icon: Printer },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    useEffect(() => {
        const fetchTaxRules = async () => {
            try {
                setIsLoading(true);
                const { data } = await taxApi.getAll();
                setTaxRules(data);
            } catch (error) {
                setFeedback('Failed to load tax rules.');
            } finally {
                setIsLoading(false);
            }
        };
        if (activeTab === 'tax') {
            fetchTaxRules();
        }
    }, [activeTab]);

    const handleCreateTaxRule = async (e) => {
        e.preventDefault();
        if (!newTaxName.trim()) return;
        try {
            const rate = Math.max(0, Math.min(100, Number(newTaxRate) || 0));
            const { data } = await taxApi.create({ name: newTaxName.trim(), rate, isActive: newTaxActive });
            setTaxRules(prev => [...prev, data]);
            setNewTaxName('');
            setNewTaxRate('');
            setNewTaxActive(true);
            setFeedback('Tax rule created.');
            setTimeout(() => setFeedback(''), 3000);
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Failed to create tax rule.');
        }
    };

    const handleDeleteTaxRule = async (id) => {
        try {
            await taxApi.delete(id);
            setTaxRules(prev => prev.filter(rule => rule._id !== id));
            setFeedback('Tax rule deleted.');
            setTimeout(() => setFeedback(''), 3000);
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Failed to delete tax rule.');
        }
    };

    const handleToggleTaxRule = async (rule) => {
        try {
            const { data } = await taxApi.update(rule._id, { isActive: !rule.isActive });
            setTaxRules(prev => prev.map(r => r._id === rule._id ? data : r));
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Failed to update tax rule.');
        }
    };

    const currentCombinedRate = taxRules.filter(r => r.isActive).reduce((sum, r) => sum + r.rate, 0);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {feedback && (
                <div className="rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm text-dark-2 shadow-card">
                    {feedback}
                </div>
            )}
            <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Administration</p>
                <h1 className="text-3xl font-bold text-dark mt-1">System Settings</h1>
                <p className="text-gray text-sm">Configure your POS system preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-card'
                                : 'text-dark-2 hover:bg-white/80 hover:text-dark'
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
                                        <label className="text-sm font-medium text-dark-2 block mb-1.5">Shop Logo</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-light border border-border flex items-center justify-center text-gray font-bold">
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

                    {activeTab === 'localization' && (
                        <Card title="Localization" subtitle="Currency and regional settings">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-dark-2">Currency Symbol</label>
                                        <select className="rounded-xl border-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                                            <option>LKR (Rs.)</option>
                                            <option>USD ($)</option>
                                            <option>EUR (€)</option>
                                            <option>GBP (£)</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-dark-2">Timezone</label>
                                        <select className="rounded-xl border-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                                            <option>UTC (Sri Lanka Standard Time)</option>
                                            <option>EST (Eastern Standard Time)</option>
                                            <option>PST (Pacific Standard Time)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'tax' && (
                        <Card title="Tax & VAT Configuration" subtitle="Configure tax rates applied at checkout and printed on receipts">
                            {isLoading ? <Loader fullPage /> : (
                                <div className="space-y-6">
                                    <div className="rounded-2xl bg-primary/5 p-4 border border-primary/10">
                                        <p className="text-sm text-dark">
                                            <span className="font-bold">Current combined tax rate: </span>
                                            <span className="text-primary font-bold text-lg">{currentCombinedRate}%</span>
                                        </p>
                                        <p className="text-xs text-gray mt-1">
                                            Tax is automatically calculated on the POS screen and included on every receipt.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold text-dark-2">Active Tax Rules</p>
                                        {taxRules.length === 0 && (
                                            <p className="text-sm text-gray py-4 text-center">No tax rules configured.</p>
                                        )}
                                        {taxRules.map((rule) => (
                                            <div key={rule._id} className="flex items-center justify-between p-4 bg-light rounded-2xl border border-border">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <p className="font-semibold text-dark">{rule.name}</p>
                                                        <p className="text-xs text-gray">{rule.rate}%</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleTaxRule(rule)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${rule.isActive ? 'bg-success/10 text-success' : 'bg-light-red text-danger'}`}
                                                    >
                                                        {rule.isActive ? 'Active' : 'Inactive'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteTaxRule(rule._id)}
                                                        className="p-2 text-gray hover:text-danger transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <form onSubmit={handleCreateTaxRule} className="border-t border-border pt-6">
                                        <p className="text-sm font-semibold text-dark-2 mb-3">Add New Tax Rule</p>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div className="md:col-span-2">
                                                <Input
                                                    label="Tax Name"
                                                    placeholder="e.g. State Tax, Alcohol Tax"
                                                    value={newTaxName}
                                                    onChange={(e) => setNewTaxName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    label="Rate (%)"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                    placeholder="e.g. 8.5"
                                                    value={newTaxRate}
                                                    onChange={(e) => setNewTaxRate(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-sm font-medium text-dark-2">Status</label>
                                                <select
                                                    value={newTaxActive ? 'active' : 'inactive'}
                                                    onChange={(e) => setNewTaxActive(e.target.value === 'active')}
                                                    className="rounded-xl border-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <Button type="submit" className="flex items-center gap-2">
                                                <Plus size={18} />
                                                Add Tax Rule
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </Card>
                    )}

                    {activeTab === 'receipt' && (
                        <Card title="Receipt Settings" subtitle="Configure how receipts are printed">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-light rounded-2xl border border-border cursor-pointer hover:bg-white/80 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-xl text-primary shadow-sm">
                                                <Printer size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-dark">Auto-print Receipt</p>
                                                <p className="text-xs text-gray">Automatically print receipt after checkout</p>
                                            </div>
                                        </div>
                                        <input type="checkbox" className="w-5 h-5 accent-primary" defaultChecked />
                                    </label>

                                    <Input label="Receipt Footer Message" defaultValue="Thank you for your visit!" />

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-dark-2">Paper Size</label>
                                        <select className="rounded-xl border-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20">
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
