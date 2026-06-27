
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Printer, Download } from 'lucide-react';
import Card from '../../components/ui/Card';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import dayjs from 'dayjs';

import { orderApi } from '../../api/orderApi';
import { formatLKR } from '../../utils/money';

export default function Orders() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await orderApi.getAll();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order =>
        order.orderNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return <Loader fullPage />;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Order History</h1>
                    <p className="text-gray text-sm">View and manage all your past orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="flex items-center gap-2">
                        <Download size={18} />
                        Export
                    </Button>
                </div>
            </div>

            <Card className="flex flex-col">
                <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Input
                            placeholder="Search by order ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={Search}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" className="flex items-center gap-2">
                            <Filter size={16} />
                            Filter
                        </Button>
                    </div>
                </div>

                <Table headers={['Order ID', 'Date', 'Items', 'Total', 'Status', 'Payment', 'Actions']}>
                    {filteredOrders.map((order) => (
                        <TableRow key={order._id}>
                            <TableCell className="font-bold text-primary">{order.orderNo}</TableCell>
                            <TableCell>{dayjs(order.createdAt).format('MMM D, YYYY HH:mm')}</TableCell>
                            <TableCell>{order.items.length} items</TableCell>
                            <TableCell className="font-bold text-primary">{formatLKR(order.total)}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    order.status === 'completed' ? 'success' :
                                        order.status === 'pending' ? 'warning' : 'danger'
                                }>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="capitalize">{order.payment.method}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate(`/orders/${order._id}`)}
                                        className="p-2 text-gray hover:text-primary transition-colors"
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => window.open(`/orders/${order._id}/receipt`, '_blank')}
                                        className="p-2 text-gray hover:text-dark transition-colors"
                                        title="Print Receipt"
                                    >
                                        <Printer size={18} />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>

                {filteredOrders.length === 0 && (
                    <div className="p-12 text-center text-gray">
                        No orders found matching your search.
                    </div>
                )}
            </Card>
        </div>
    );
}
