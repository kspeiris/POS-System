
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Printer, Download, Ban, DollarSign } from 'lucide-react';
import Card from '../../components/ui/Card';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import dayjs from 'dayjs';
import { formatLKR } from '../../utils/money';

import { orderApi } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';

export default function Orders() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [voidModal, setVoidModal] = useState({ open: false, order: null });
    const [refundModal, setRefundModal] = useState({ open: false, order: null });
    const [voidReason, setVoidReason] = useState('');
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');
    const [feedback, setFeedback] = useState('');

    const isAdmin = user?.role === 'admin';

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const { data } = await orderApi.getAll();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order =>
        (order.orderNo || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleVoid = async (e) => {
        e.preventDefault();
        const order = voidModal.order;
        if (!order) return;
        try {
            const { data } = await orderApi.voidOrder(order._id, { reason: voidReason });
            setFeedback(data.message || 'Order voided successfully.');
            setVoidModal({ open: false, order: null });
            setVoidReason('');
            fetchOrders();
            setTimeout(() => setFeedback(''), 3000);
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Failed to void order.');
        }
    };

    const handleRefund = async (e) => {
        e.preventDefault();
        const order = refundModal.order;
        if (!order) return;
        try {
            const { data } = await orderApi.refundOrder(order._id, {
                amount: refundAmount,
                reason: refundReason,
            });
            setFeedback(data.message || 'Refund processed successfully.');
            setRefundModal({ open: false, order: null });
            setRefundAmount('');
            setRefundReason('');
            fetchOrders();
            setTimeout(() => setFeedback(''), 3000);
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Failed to process refund.');
        }
    };

    const statusVariant = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            case 'refunded': return 'warning';
            case 'voided': return 'danger';
            default: return 'neutral';
        }
    };

    if (isLoading) return <Loader fullPage />;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {feedback && (
                <div className="rounded-2xl border border-light-green bg-light-green px-4 py-3 text-sm text-success">
                    {feedback}
                </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">Orders</p>
                    <h1 className="text-3xl font-bold text-dark mt-1">Order History</h1>
                    <p className="text-gray text-sm">View and manage all your past orders.</p>
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
                            <TableCell className="font-bold">{formatLKR(order.total)}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariant(order.status)}>
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
                                    {isAdmin && order.status !== 'voided' && order.status !== 'refunded' && (
                                        <>
                                                <button
                                                    onClick={() => setVoidModal({ open: true, order })}
                                                    className="p-2 text-gray hover:text-danger transition-colors"
                                                    title="Void Order"
                                                >
                                                    <Ban size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setRefundModal({ open: true, order })}
                                                    className="p-2 text-gray hover:text-primary transition-colors"
                                                    title="Process Refund"
                                                >
                                                    <DollarSign size={18} />
                                                </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => window.open(`${window.location.origin}/orders/${order._id}/receipt`, '_blank', 'noopener,noreferrer')}
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

            {/* Void Modal */}
            <Modal isOpen={voidModal.open} onClose={() => setVoidModal({ open: false, order: null })} title="Void Order" size="sm">
                <form onSubmit={handleVoid} className="space-y-4">
                    <p className="text-sm text-gray">
                        Are you sure you want to void order <span className="font-bold text-dark">{voidModal.order?.orderNo}</span>?
                        Stock will be restored.
                    </p>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-dark-2">Reason for voiding</label>
                        <textarea
                            value={voidReason}
                            onChange={(e) => setVoidReason(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border-border bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="Mention reason..."
                            required
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button variant="ghost" className="flex-1" type="button" onClick={() => setVoidModal({ open: false, order: null })}>
                            Cancel
                        </Button>
                        <Button className="flex-1" type="submit">
                            Confirm Void
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Refund Modal */}
            <Modal isOpen={refundModal.open} onClose={() => setRefundModal({ open: false, order: null })} title="Process Refund" size="sm">
                <form onSubmit={handleRefund} className="space-y-4">
                    <p className="text-sm text-gray">
                        Processing refund for order <span className="font-bold text-dark">{refundModal.order?.orderNo}</span>.
                        Maximum refundable: {formatLKR(Number(refundModal.order?.total || 0) - Number(refundModal.order?.refundAmount || 0))}
                    </p>
                    <Input
                        label="Refund Amount"
                        type="number"
                        step="0.01"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        placeholder="0.00"
                        required
                    />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-dark-2">Reason for refund</label>
                        <textarea
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border-border bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="Mention reason..."
                            required
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button variant="ghost" className="flex-1" type="button" onClick={() => setRefundModal({ open: false, order: null })}>
                            Cancel
                        </Button>
                        <Button className="flex-1" type="submit">
                            Confirm Refund
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
