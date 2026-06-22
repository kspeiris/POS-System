
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import { orderApi } from '../../api/orderApi';
import { userApi } from '../../api/userApi';
import Loader from '../../components/ui/Loader';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function Dashboard() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [ordersRes, usersRes] = await Promise.all([
                    orderApi.getAll(),
                    userApi.getAll()
                ]);

                const allOrders = ordersRes.data;
                setOrders(allOrders);
                
                const revenue = allOrders.reduce((acc, o) => acc + o.total, 0);
                const avgValue = allOrders.length > 0 ? revenue / allOrders.length : 0;

                setStats([
                    { label: 'Total Revenue', value: `$${revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, trend: '+12.5%', icon: DollarSign, color: 'text-success bg-light-green' },
                    { label: 'Total Orders', value: allOrders.length.toLocaleString(), trend: '+5.2%', icon: ShoppingBag, color: 'text-primary bg-light-blue' },
                    { label: 'Total Staff', value: usersRes.data.length.toLocaleString(), trend: '0%', icon: Users, color: 'text-secondary bg-orange-50' },
                    { label: 'Avg Order Value', value: `$${avgValue.toFixed(2)}`, trend: '+3.1%', icon: TrendingUp, color: 'text-primary bg-primary/10' },
                ]);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (isLoading) return <Loader fullPage />;

    const recentOrders = orders.slice(0, 5);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Overview</p>
                <h1 className="text-3xl font-bold text-dark mt-1">Admin Dashboard</h1>
                <p className="text-gray text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                <Card key={idx} className="hover:-translate-y-1 transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                            <stat.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                            {stat.trend}
                            {stat.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray font-medium">{stat.label}</p>
                            <h3 className="text-[2rem] font-bold text-dark mt-1 leading-tight">{stat.value}</h3>
                        </div>
                </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Overview Chart placeholder */}
                <Card title="Revenue Overview" subtitle="Illustrative monthly performance" className="lg:col-span-2">
                    <div className="h-[320px] w-full flex items-end justify-between gap-2 px-4">
                        {[40, 70, 45, 90, 65, 85, 55, 75, 50, 80, 60, 95].map((height, i) => (
                            <div key={i} className="flex-1 group relative flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-primary/20 hover:bg-primary rounded-t-lg transition-all duration-500 cursor-pointer"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-dark text-white text-[10px] py-1 px-2 rounded whitespace-nowrap transition-opacity shadow-card">
                                        ${(height * 10).toLocaleString()}
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray font-medium">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Popular Items */}
                <Card title="Popular Items" subtitle="Most sold menu items this period">
                    <div className="space-y-5">
                        {[
                            { name: 'Cheeseburger', sales: 142, growth: 12 },
                            { name: 'Double Burger', sales: 98, growth: 8 },
                            { name: 'French Fries', sales: 85, growth: -2 },
                            { name: 'Cola', sales: 76, growth: 5 },
                            { name: 'Chicken Wings', sales: 64, growth: 15 },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-light flex items-center justify-center text-xs font-bold text-gray">
                                        {idx + 1}
                                    </div>
                                    <span className="text-sm font-medium text-dark">{item.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-dark">{item.sales}</p>
                                    <p className={`text-[10px] font-bold ${item.growth >= 0 ? 'text-success' : 'text-danger'}`}>
                                        {item.growth >= 0 ? '+' : ''}{item.growth}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Recent Orders Table */}
            <Card title="Recent Orders" subtitle="Latest completed orders" noPadding>
                <Table headers={['Order ID', 'Customer', 'Amount', 'Status', 'Time', 'Actions']}>
                    {recentOrders.map((order) => (
                        <TableRow key={order._id}>
                            <TableCell className="font-bold text-primary">{order.orderNo}</TableCell>
                            <TableCell>Walk-in</TableCell>
                            <TableCell className="font-bold">${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    order.status === 'completed' ? 'success' :
                                        order.status === 'pending' ? 'warning' : 'danger'
                                }>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="flex items-center gap-1.5 text-gray">
                                <Clock size={14} />
                                {dayjs(order.createdAt).fromNow()}
                            </TableCell>
                            <TableCell>
                                <button
                                    onClick={() => navigate(`/orders/${order._id}`)}
                                    className="text-primary hover:underline font-medium text-xs"
                                >
                                    View Details
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </Card>
        </div>
    );
}
