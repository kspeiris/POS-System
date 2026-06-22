import { useEffect, useState } from 'react';
import { CalendarRange, TrendingUp, ShoppingBag, DollarSign, Clock3 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { orderApi } from '../../api/orderApi';
import dayjs from 'dayjs';
import { formatLKR } from '../../utils/money';

export default function AnalysisCashier() {
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState({
        from: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
        to: dayjs().format('YYYY-MM-DD'),
    });

    useEffect(() => {
        const load = async () => {
            try {
                setError('');
                const { data } = await orderApi.getAll();
                setOrders(data || []);
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

    const today = dayjs().format('YYYY-MM-DD');
    const todayOrders = filteredOrders.filter((order) => dayjs(order.createdAt).format('YYYY-MM-DD') === today);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const avgTicket = filteredOrders.length ? filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0) / filteredOrders.length : 0;

    const topPayment = ['cash', 'card', 'qr'].reduce((acc, method) => {
        const total = filteredOrders.filter((order) => order.payment?.method === method).reduce((sum, order) => sum + (order.total || 0), 0);
        return total > acc.total ? { method, total } : acc;
    }, { method: 'cash', total: 0 });

    const series = [];
    for (let i = 6; i >= 0; i -= 1) {
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
        <div className="space-y-6 max-w-[1400px] mx-auto">
            <div className="glass rounded-3xl p-6 sm:p-8">
                <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Analysis</p>
                <h1 className="text-3xl font-bold text-dark mt-1">Cashier Analysis</h1>
                <p className="text-slate-500 text-sm">Today's performance and service rhythm.</p>
            </div>

            <div className="glass rounded-3xl p-5 flex flex-col lg:flex-row lg:items-end gap-4">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 shrink-0">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Today Revenue', value: formatLKR(todayRevenue), icon: DollarSign, color: 'text-primary bg-primary/10' },
                    { label: 'Orders in Range', value: filteredOrders.length.toString(), icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Avg Ticket', value: formatLKR(avgTicket), icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
                ].map((item) => (
                    <Card key={item.label} className="rounded-[1.75rem]">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Revenue Trend" subtitle="Last 7 days within your selected range" className="rounded-[2rem]">
                    <div className="h-72">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <defs>
                                <linearGradient id="cashierTrendFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0f766e" stopOpacity="0.35" />
                                    <stop offset="100%" stopColor="#0f766e" stopOpacity="0.02" />
                                </linearGradient>
                            </defs>
                            <polyline fill="none" stroke="#0f766e" strokeWidth="2.5" points={chartPoints} />
                            <polyline fill="url(#cashierTrendFill)" stroke="none" points={`0,100 ${chartPoints} 100,100`} />
                            {series.map((point, index) => {
                                const x = series.length === 1 ? 0 : (index / (series.length - 1)) * 100;
                                const y = 100 - (point.value / maxSeries) * 100;
                                return <circle key={point.label} cx={x} cy={y} r="1.7" fill="#0f766e" />;
                            })}
                        </svg>
                    </div>
                </Card>

                <Card title="Peak Payment Method" subtitle="Most-used payment option in range" className="rounded-[2rem]">
                    <div className="rounded-2xl bg-slate-50 p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Method</p>
                            <p className="mt-2 text-lg font-bold text-dark capitalize">{topPayment.method}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Value</p>
                            <p className="mt-2 text-lg font-bold text-dark">{formatLKR(topPayment.total)}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card title="Recent Tickets" subtitle="Your latest orders in the selected range" className="rounded-[2rem]">
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {filteredOrders.slice(0, 6).map((order) => (
                        <div key={order._id} className="rounded-2xl bg-slate-50 px-4 py-3 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-dark">{order.orderNo}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <Clock3 size={12} />
                                    {dayjs(order.createdAt).format('HH:mm')}
                                </p>
                            </div>
                            <p className="font-semibold text-dark">{formatLKR(order.total)}</p>
                        </div>
                    ))}
                    {filteredOrders.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No orders found for this range.</p>}
                </div>
            </Card>
        </div>
    );
}
