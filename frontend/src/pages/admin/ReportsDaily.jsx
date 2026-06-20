
import { useState, useEffect } from 'react';
import { Download, TrendingUp, ShoppingBag, CreditCard, RotateCcw } from 'lucide-react';
import Card from '../../components/ui/Card';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import dayjs from 'dayjs';

import axios from '../../api/axios';

export default function ReportsDaily() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/reports/daily?date=${selectedDate}`);
                setReportData(data);
            } catch (error) {
                console.error('Error fetching report:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReport();
    }, [selectedDate]);

    const stats = reportData ? [
        { label: 'Total Sales', value: `$${reportData.totalSales.toLocaleString()}`, icon: TrendingUp, color: 'text-primary bg-primary/10' },
        { label: 'Total Orders', value: reportData.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'text-green-600 bg-green-50' },
        { label: 'Avg Order', value: `$${reportData.avgOrderValue.toFixed(2)}`, icon: CreditCard, color: 'text-blue-600 bg-blue-50' },
        { label: 'Canceled', value: '0', icon: RotateCcw, color: 'text-danger bg-red-50' },
    ] : [];

    if (isLoading) return <Loader fullPage />;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Daily Sales Report</h1>
                    <p className="text-gray-500 text-sm">Review performance for {dayjs(selectedDate).format('MMMM D, YYYY')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <Button variant="secondary" className="flex items-center gap-2">
                        <Download size={18} />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="border-none shadow-md">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-dark">{stat.value}</h3>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Sales by Category" className="lg:col-span-1">
                    <div className="space-y-4">
                        {reportData.salesByCategory.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-dark">{item.category}</span>
                                    <span className="text-gray-500">${item.sales.toFixed(2)}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary"
                                        style={{ width: `${(item.sales / reportData.totalSales * 100) || 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {reportData.salesByCategory.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No data available</p>
                        )}
                    </div>
                </Card>

                <Card title="Recent Transactions" className="lg:col-span-2" noPadding>
                    <Table headers={['Time', 'Order ID', 'Items', 'Total', 'Payment']}>
                        {reportData.recentOrders.map((tx) => (
                            <TableRow key={tx._id}>
                                <TableCell className="text-gray-500">{dayjs(tx.createdAt).format('HH:mm')}</TableCell>
                                <TableCell className="font-bold text-primary">{tx.orderNo}</TableCell>
                                <TableCell>{tx.items.length} items</TableCell>
                                <TableCell className="font-bold">${tx.total.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant="neutral">{tx.payment.method}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                    {reportData.recentOrders.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-10">No transactions today</p>
                    )}
                </Card>
            </div>
        </div>
    );
}
