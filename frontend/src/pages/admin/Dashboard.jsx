
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import { orderApi } from '../../api/orderApi';
import { userApi } from '../../api/userApi';
import { productApi } from '../../api/productApi';
import Loader from '../../components/ui/Loader';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { formatLKR } from '../../utils/money';

dayjs.extend(relativeTime);

export default function Dashboard() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [ordersRes, usersRes, lowStockRes] = await Promise.all([
                    orderApi.getAll(),
                    userApi.getAll(),
                    productApi.getLowStock(),
                ]);

                const allOrders = ordersRes.data;
                setOrders(allOrders);
                setUsers(usersRes.data);
                setLowStockProducts(lowStockRes.data || []);

                const revenue = allOrders.reduce((acc, o) => acc + o.total, 0);
                const avgValue = allOrders.length > 0 ? revenue / allOrders.length : 0;

                setStats([
                    { label: 'Total Revenue', value: formatLKR(revenue), trend: '+12.5%', icon: DollarSign, color: 'text-success bg-light' },
                    { label: 'Total Orders', value: allOrders.length.toLocaleString(), trend: '+5.2%', icon: ShoppingBag, color: 'text-primary bg-primary/10' },
                    { label: 'Total Staff', value: usersRes.data.length.toLocaleString(), trend: '0%', icon: Users, color: 'text-secondary bg-secondary/10' },
                    { label: 'Avg Order Value', value: formatLKR(avgValue), trend: '+3.1%', icon: TrendingUp, color: 'text-primary bg-primary/10' },
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
                <p className="text-gray text-sm mt-1">Welcome back. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                        <Card key={idx} className="hover:-translate-y-0.5 transition-all duration-200">
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
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-dark mt-1">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            {lowStockProducts.length > 0 && (
                <Card title="Low Stock Alerts" subtitle="These products are running low">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lowStockProducts.map((product) => (
                            <div key={product._id} className="flex items-center justify-between p-4 rounded-2xl bg-light border border-border border-l-4 border-l-secondary">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden shrink-0">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sm font-bold text-gray">{product.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-dark">{product.name}</p>
                                        <p className="text-xs text-gray">Category: {product.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-danger">{product.stockQty}</p>
                                    <p className="text-xs text-gray">in stock</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Overview Chart placeholder */}
                <Card title="Revenue Overview" subtitle="Illustrative monthly performance" className="lg:col-span-2">
                    {(() => {
                        const data = [40, 70, 45, 90, 65, 85, 55, 75, 50, 80, 60, 95];
                        const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
                        const maxH = 220; // px
                        const maxVal = Math.max(...data);
                        return (
                            <div className="h-[280px] w-full flex items-end justify-between gap-2 px-2 pb-6 relative">
                                {/* Y-axis grid lines */}
                                <div className="absolute inset-x-2 bottom-6 top-0 flex flex-col justify-between pointer-events-none">
                                    {[100, 75, 50, 25, 0].map(pct => (
                                        <div key={pct} className="w-full border-t border-border/50 flex items-center">
                                            <span className="text-[9px] text-gray -mt-3 -ml-1 w-6 text-right">{pct}</span>
                                        </div>
                                    ))}
                                </div>
                                {data.map((val, i) => {
                                    const barH = Math.round((val / maxVal) * maxH);
                                    return (
                                        <div key={i} className="flex-1 group relative flex flex-col items-center gap-1 justify-end" style={{ height: `${maxH}px` }}>
                                            {/* Tooltip */}
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-[10px] py-1 px-2 rounded-lg whitespace-nowrap transition-opacity z-10 shadow-lg">
                                                LKR {(val * 1000).toLocaleString()}
                                            </div>
                                            {/* Bar */}
                                            <div
                                                className="w-full rounded-t-lg transition-all duration-500 cursor-pointer hover:opacity-80"
                                                style={{
                                                    height: `${barH}px`,
                                                    background: `linear-gradient(to top, var(--primary), color-mix(in srgb, var(--primary) 60%, transparent))`
                                                }}
                                            />
                                            <span className="text-[10px] text-gray font-medium absolute -bottom-5">{months[i]}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </Card>

                {/* Popular Items */}
                <Card title="Popular Items" subtitle="Most sold menu items this period">
                    <div className="space-y-6">
                        {[
                            { name: 'Cheeseburger', sales: 142, growth: 12 },
                            { name: 'Double Burger', sales: 98, growth: 8 },
                            { name: 'French Fries', sales: 85, growth: -2 },
                            { name: 'Cola', sales: 76, growth: 5 },
                            { name: 'Chicken Wings', sales: 64, growth: 15 },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
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
                            <TableCell className="font-bold">{formatLKR(order.total)}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    order.status === 'completed' ? 'success' :
                                        order.status === 'pending' ? 'warning' : 'danger'
                                }>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="flex items-center gap-1.5 text-gray-500">
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
