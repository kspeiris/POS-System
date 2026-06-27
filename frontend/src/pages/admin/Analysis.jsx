import { useEffect, useState, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { orderApi } from '../../api/orderApi';
import { userApi } from '../../api/userApi';
import dayjs from 'dayjs';
import { formatLKR } from '../../utils/money';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0f766e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function AnalysisAdmin() {
  const [orders, setOrders] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: dayjs().subtract(13, 'day').format('YYYY-MM-DD'),
    to: dayjs().format('YYYY-MM-DD'),
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([orderApi.getAll(), userApi.getAll()]);
        setOrders(ordersRes.data || []);
        setStaff(usersRes.data || []);
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
    for (let i = 0; i < 14; i++) {
      const day = dayjs(dateRange.from).add(i, 'day');
      map.set(day.format('MMM D'), 0);
    }
    filteredOrders.forEach((o) => {
      const key = dayjs(o.createdAt).format('MMM D');
      if (map.has(key)) map.set(key, map.get(key) + (o.total || 0));
    });
    return Array.from(map.entries()).map(([date, revenue]) => ({ date, revenue: Number(revenue.toFixed(2)) }));
  }, [filteredOrders, dateRange]);

  const peakHoursData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, orders: 0, revenue: 0 }));
    filteredOrders.forEach((o) => {
      const h = dayjs(o.createdAt).hour();
      hours[h].orders += 1;
      hours[h].revenue += o.total || 0;
    });
    return hours.filter((h) => h.orders > 0);
  }, [filteredOrders]);

  const cashierPerformance = useMemo(() => {
    const map = new Map();
    filteredOrders.forEach((o) => {
      const name = o.cashierName || 'Unknown';
      if (!map.has(name)) map.set(name, { name, orders: 0, revenue: 0 });
      const entry = map.get(name);
      entry.orders += 1;
      entry.revenue += o.total || 0;
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  const categoryData = useMemo(() => {
    const map = new Map();
    filteredOrders.forEach((o) => {
      o.items?.forEach((item) => {
        const cat = item.product?.category || 'Uncategorized';
        map.set(cat, (map.get(cat) || 0) + (item.total || 0));
      });
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) })).sort((a, b) => b.value - a.value);
  }, [filteredOrders]);

  if (isLoading) return <Loader fullPage />;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Analysis</p>
          <h1 className="text-3xl font-bold text-dark mt-1">Admin Analytics</h1>
          <p className="text-gray text-sm">Revenue trends, peak hours, and team performance.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Revenue Trend" subtitle="Daily sales over the selected range" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-gray" />
              <YAxis tick={{ fontSize: 12 }} className="text-gray" />
              <Tooltip
                formatter={(value) => [formatLKR(value), 'Revenue']}
                contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', backgroundColor: 'var(--white)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Peak Sales Hours" subtitle="Orders and revenue by hour of day">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} className="text-gray" />
              <YAxis tick={{ fontSize: 12 }} className="text-gray" />
              <Tooltip
                formatter={(value) => [value, value > 1000 ? formatLKR(value) : `${value} orders`]}
                contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', backgroundColor: 'var(--white)' }}
              />
              <Legend />
              <Bar dataKey="orders" fill="#0f766e" radius={[4, 4, 0, 0]} name="Orders" />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Cashier Performance" subtitle="Revenue per staff member">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashierPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fontSize: 12 }} className="text-gray" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} className="text-gray" />
              <Tooltip
                formatter={(value) => [formatLKR(value), 'Revenue']}
                contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', backgroundColor: 'var(--white)' }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#0f766e" radius={[0, 4, 4, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Sales by Category" subtitle="Revenue share across menu categories">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatLKR(value), 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Recent Activity" subtitle="Latest orders processed">
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {filteredOrders.slice(0, 8).map((order) => (
              <div key={order._id} className="flex items-center justify-between rounded-2xl bg-light px-4 py-3">
                <div>
                  <p className="font-semibold text-dark">{order.orderNo}</p>
                  <p className="text-xs text-gray">{dayjs(order.createdAt).format('MMM D, HH:mm')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-dark">{formatLKR(order.total)}</p>
                  <p className="text-xs text-gray capitalize">{order.status}</p>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && <p className="text-sm text-gray text-center py-4">No data for this range.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
