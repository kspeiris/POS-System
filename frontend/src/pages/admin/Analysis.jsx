import { useEffect, useState } from 'react';
import { CalendarRange, TrendingUp, Users, ShoppingBag, DollarSign, Clock3 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { orderApi } from '../../api/orderApi';
import { userApi } from '../../api/userApi';
import dayjs from 'dayjs';

export default function AnalysisAdmin() {
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [staff, setStaff] = useState([]);
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState({
        from: dayjs().subtract(13, 'day').format('YYYY-MM-DD'),
        to: dayjs().format('YYYY-MM-DD'),
    });

    useEffect(() => {
        const load = async () => {
            try {
                setError('');
                const [ordersRes, usersRes] = await Promise.all([orderApi.getAll(), userApi.getAll()]);
                setOrders(ordersRes.data || []);
                setStaff(usersRes.data || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load analysis.');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const filteredOrders = orders.filter((order) => {
        const from = dayjs(dateRange.from).startOf('day');
        const to = dayjs(dateRange.to).endOf('day');
        const created = dayjs(order.createdAt);
        return created.isValid() && created.isAfter(from.subtract(1, 'millisecond')) && created.isBefore(to.add(1, 'millisecond'));
    });

    const avgOrder = filteredOrders.length ? filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0) / filteredOrders.length : 0;
    const completed = filteredOrders.filter((o) => o.status === 'completed').length;
    const pending = filteredOrders.filter((o) => o.status === 'pending').length;

    const series = [];
    for (let i = 13; i >= 0; i -= 1) {
        const day = dayjs(dateRange.to).subtract(i, 'day');
        const total = orders
            .filter((order) => dayjs(order.createdAt).isSame(day, 'day'))
            .reduce((sum, order) => sum + (order.total || 0), 0);
        series.push({ label: day.format('D'), value: total });
    }

    const maxSeries = Math.max(...series.map((point) => point.value), 1);
    const chartPoints = series.map((point, index) => {
        const x = series.length === 1 ? 0 : (index / (series.length - 1)) * 100;
        const y = 100 - (point.value / maxSeries) * 100;
        return `${x},${y}`;
    }).join(' ');

    if (isLoading) return <Loader fullPage />;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Analysis</p>
                <h1 className="text-3xl font-bold text-dark mt-1">Admin Analysis</h1>
                <p className="text-slate-500 text-sm">Operational insights for management and planning.</p>
            </div>

            <div className="glass rounded-3xl p-4 flex flex-col lg:flex-row lg:items-end gap-4">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                    <CalendarRange size={18} className="text-primary" />
                    Date range
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    <label className="flex flex-col gap-1.5 text-sm text-slate-600">
                        From
                        <input
                            type="date"
                            value={dateRange.from}
                            onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm text-slate-600">
                        To
                        <input
                            type="date"
                            value={dateRange.to}
                            onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </label>
                </div>
            </div>

            {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                    { label: 'Revenue', value: `$${filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}`, icon: DollarSign, color: 'text-primary bg-primary/10' },
                    { label: 'Orders', value: filteredOrders.length.toString(), icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Average Ticket', value: `$${avgOrder.toFixed(2)}`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Staff Members', value: staff.length.toString(), icon: Users, color: 'text-violet-600 bg-violet-50' },
                ].map((item) => (
                    <Card key={item.label}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">{item.label}</p>
                                <h3 className="text-2xl font-bold text-dark mt-1">{item.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${item.color}`}>
                                <item.icon size={24} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Revenue Trend" subtitle="Daily sales over the selected range" className="lg:col-span-2">
                    <div className="h-72">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <defs>
                                <linearGradient id="adminTrendFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0f766e" stopOpacity="0.35" />
                                    <stop offset="100%" stopColor="#0f766e" stopOpacity="0.02" />
                                </linearGradient>
                            </defs>
                            <polyline fill="none" stroke="#0f766e" strokeWidth="2.5" points={chartPoints} />
                            <polyline fill="url(#adminTrendFill)" stroke="none" points={`0,100 ${chartPoints} 100,100`} />
                            {series.map((point, index) => {
                                const x = series.length === 1 ? 0 : (index / (series.length - 1)) * 100;
                                const y = 100 - (point.value / maxSeries) * 100;
                                return (
                                    <circle key={point.label} cx={x} cy={y} r="1.7" fill="#0f766e" />
                                );
                            })}
                        </svg>
                    </div>
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                        {series.map((point) => (
                            <span key={point.label} className="min-w-8 text-center text-xs font-semibold text-slate-500">
                                {point.label}
                            </span>
                        ))}
                    </div>
                </Card>

                <Card title="Order Status Split" subtitle="Current mix of completed and pending orders">
                    <div className="space-y-4">
                        {[
                            { label: 'Completed', value: completed, color: 'bg-emerald-500' },
                            { label: 'Pending', value: pending, color: 'bg-amber-500' },
                            { label: 'Other', value: orders.length - completed - pending, color: 'bg-slate-300' },
                        ].map((item) => (
                            <div key={item.label} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-dark">{item.label}</span>
                                    <span className="text-slate-500">{item.value}</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className={`h-full ${item.color}`}
                                        style={{ width: `${filteredOrders.length ? (item.value / filteredOrders.length) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Recent Activity" subtitle="Latest orders processed">
                    <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                        {(filteredOrders.slice(0, 6)).map((order) => (
                            <div key={order._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                                <div>
                                    <p className="font-semibold text-dark">{order.orderNo}</p>
                                    <p className="text-xs text-slate-500">{dayjs(order.createdAt).format('MMM D, HH:mm')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-dark">${Number(order.total || 0).toFixed(2)}</p>
                                    <p className="text-xs text-slate-500 capitalize">{order.status}</p>
                                </div>
                            </div>
                        ))}
                        {filteredOrders.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No analysis data for this range.</p>}
                    </div>
                </Card>

                <Card title="Insights" subtitle="Quick summary">
                    <div className="space-y-4">
                        <div className="rounded-2xl bg-primary/5 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Revenue</p>
                            <p className="mt-2 text-sm text-slate-600">Average order value is ${avgOrder.toFixed(2)} across {filteredOrders.length} orders.</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Timing</p>
                            <p className="mt-2 text-sm text-slate-600 flex items-center gap-2">
                                <Clock3 size={16} />
                                Inspect daily reports for date-specific trends.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
