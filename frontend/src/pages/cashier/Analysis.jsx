import { useEffect, useState, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { orderApi } from '../../api/orderApi';
import dayjs from 'dayjs';
import { formatLKR } from '../../utils/money';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0f766e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function AnalysisCashier() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    to: dayjs().format('YYYY-MM-DD'),
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await orderApi.getAll();
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to load analysis:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredOrders = useMemo(() => {
    const from = dayjs(dateRange.from).startOf('day');
    const to = dayjs(dateRange.to).endOf('day');
    return orders.filter((order) => {
      const created = dayjs(order.createdAt);
      return created.isValid() && created.isAfter(from.subtract(1, 'millisecond')) && created.isBefore(to.add(1, 'millisecond'));
    });
  }, [orders, dateRange]);

  const revenueByDay = useMemo(() => {
    const map = new Map();
    for (let i = 0; i < 7; i++) {
      const day = dayjs(dateRange.to).subtract(6 - i, 'day');
      map.set(day.format('MMM D'), 0);
    }
    filteredOrders.forEach((o) => {
      const key = dayjs(o.createdAt).format('MMM D');
      if (map.has(key)) map.set(key, map.get(key) + (o.total || 0));
    });
    return Array.from(map.entries()).map(([date, revenue]) => ({ date, revenue: Number(revenue.toFixed(2)) }));
  }, [filteredOrders, dateRange]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgTicket = filteredOrders.length ? totalRevenue / filteredOrders.length : 0;
  const completed = filteredOrders.filter((o) => o.status === 'completed').length;
  const pending = filteredOrders.filter((o) => o.status === 'pending').length;

  const paymentData = useMemo(() => {
    const map = new Map();
    filteredOrders.forEach((o) => {
      const method = o.payment?.method || 'unknown';
      map.set(method, (map.get(method) || 0) + (o.total || 0));
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));
  }, [filteredOrders]);

  const todayStr = dayjs().format('YYYY-MM-DD');
  const todayOrders = filteredOrders.filter((o) => dayjs(o.createdAt).format('YYYY-MM-DD') === todayStr);

  if (isLoading) return <Loader fullPage />;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Analysis</p>
          <h1 className="text-3xl font-bold text-dark mt-1">Cashier Analytics</h1>
          <p className="text-gray text-sm">Your daily performance and service rhythm.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
            className="rounded-xl border-border bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
          <span className="text-gray">to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
            className="rounded-xl border-border bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Today Revenue', value: formatLKR(totalRevenue), sub: `${todayOrders.length} orders today`, icon: '💰' },
          { label: 'Orders in Range', value: filteredOrders.length.toString(), sub: `${completed} completed`, icon: '📦' },
          { label: 'Avg Ticket', value: formatLKR(avgTicket), sub: `${pending} pending`, icon: '📊' },
        ].map((item) => (
          <Card key={item.label} className="rounded-[1.75rem]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray font-medium">{item.label}</p>
                <h3 className="text-2xl font-bold text-dark mt-1">{item.value}</h3>
                <p className="text-xs text-gray mt-1">{item.sub}</p>
              </div>
              <div className="text-3xl">{item.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Revenue Trend" subtitle="Your sales over the last 7 days" className="rounded-[2rem]">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-gray" />
              <YAxis tick={{ fontSize: 12 }} className="text-gray" />
              <Tooltip
                formatter={(value) => [formatLKR(value), 'Revenue']}
                contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', backgroundColor: 'var(--white)' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Payment Methods" subtitle="Revenue breakdown by payment type" className="rounded-[2rem]">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                dataKey="value"
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatLKR(value), 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Recent Tickets" subtitle="Your latest orders in the selected range" className="rounded-[2rem]">
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {filteredOrders.slice(0, 6).map((order) => (
            <div key={order._id} className="rounded-2xl bg-light px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-dark">{order.orderNo}</p>
                <p className="text-xs text-gray">{dayjs(order.createdAt).format('MMM D, HH:mm')}</p>
              </div>
              <p className="font-semibold text-dark">{formatLKR(order.total)}</p>
            </div>
          ))}
          {filteredOrders.length === 0 && <p className="text-sm text-gray text-center py-4">No orders found for this range.</p>}
        </div>
      </Card>
    </div>
  );
}
