
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Calendar, Clock, CreditCard, Ban, DollarSign } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import dayjs from 'dayjs';
import { formatLKR } from '../../utils/money';

import { useState, useEffect } from 'react';
import { orderApi } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [voidModal, setVoidModal] = useState(false);
    const [refundModal, setRefundModal] = useState(false);
    const [voidReason, setVoidReason] = useState('');
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const isAdmin = user?.role === 'admin';
    const canVoid = isAdmin && order && order.status !== 'voided' && order.status !== 'refunded';
    const canRefund = isAdmin && order && order.status !== 'voided' && order.status !== 'refunded';

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await orderApi.getById(id);
                setOrder(data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleVoid = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const { data } = await orderApi.voidOrder(id, { reason: voidReason });
            setFeedback(data.message || 'Order voided.');
            setOrder(data.order);
            setVoidModal(false);
            setVoidReason('');
            setTimeout(() => setFeedback(''), 3000);
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Failed to void order.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRefund = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const { data } = await orderApi.refundOrder(id, { amount: refundAmount, reason: refundReason });
            setFeedback(data.message || 'Refund processed.');
            setOrder(data.order);
            setRefundModal(false);
            setRefundAmount('');
            setRefundReason('');
            setTimeout(() => setFeedback(''), 3000);
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Failed to refund.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return <Loader fullPage />;
    if (!order) return <div className="p-20 text-center text-dark">Order not found</div>;

    const remainingRefundable = Number(order.total) - Number(order.refundAmount || 0);

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

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {feedback && (
                <div className="rounded-2xl border border-light-green bg-light-green px-4 py-3 text-sm text-success">
                    {feedback}
                </div>
            )}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/orders')}
                    className="p-2 rounded-full hover:bg-light transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-dark">Order Details</h1>
                <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Order Items" noPadding>
                        <Table headers={['Item', 'Price', 'Qty', 'Total']}>
                            {order.items.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium text-dark">{item.name}</TableCell>
                                    <TableCell>{formatLKR(item.price)}</TableCell>
                                    <TableCell>{item.qty}</TableCell>
                                    <TableCell className="font-bold">{formatLKR(item.total)}</TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    </Card>

                    <Card title="Payment Information">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray">Subtotal</span>
                                <span className="font-medium text-dark">{formatLKR(order.subtotal)}</span>
                            </div>
                            {order.taxBreakdown && order.taxBreakdown.length > 0
                                ? order.taxBreakdown.map((t, idx) => (
                                    <div key={t.name + idx} className="flex justify-between items-center">
                                        <span className="text-gray">Tax ({t.name} {t.rate}%)</span>
                                        <span className="font-medium text-dark">{formatLKR(t.amount)}</span>
                                    </div>
                                ))
                                : <div className="flex justify-between items-center">
                                    <span className="text-gray">Tax</span>
                                    <span className="font-medium text-dark">{formatLKR(order.tax)}</span>
                                </div>
                            }
                            {Number(order.discount || 0) > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray">Discount</span>
                                    <span className="font-medium text-dark">- {formatLKR(order.discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-4 border-t border-dashed border-border">
                                <span className="text-lg font-bold text-dark">Total</span>
                                <span className="text-xl font-bold text-primary">{formatLKR(order.total)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 text-sm">
                                <span className="text-gray">Amount Paid ({order.payment?.method || 'cash'})</span>
                                <span className="font-medium text-dark">{formatLKR(order.payment?.amountPaid ?? 0)}</span>
                            </div>
                            {Number(order.refundAmount || 0) > 0 && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-danger">Refunded</span>
                                    <span className="font-medium text-danger">- {formatLKR(order.refundAmount)}</span>
                                </div>
                            )}
                            {order.status === 'voided' && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-danger">Voided</span>
                                    <span className="font-medium text-danger">- {formatLKR(order.total)}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card title="Order Info">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-light rounded-lg text-gray">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray uppercase">Date</p>
                                    <p className="text-sm font-medium">{dayjs(order.createdAt).format('MMMM D, YYYY')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-light rounded-lg text-gray">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray uppercase">Time</p>
                                    <p className="text-sm font-medium">{dayjs(order.createdAt).format('hh:mm A')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-light rounded-lg text-gray">
                                    <CreditCard size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray uppercase">Payment Method</p>
                                    <p className="text-sm font-medium capitalize">{order.payment.method}</p>
                                </div>
                            </div>
                            {order.status === 'voided' && order.voidReason && (
                                <div className="mt-2 p-3 bg-light-red rounded-xl">
                                    <p className="text-xs font-bold text-danger uppercase">Void Reason</p>
                                    <p className="text-sm text-danger">{order.voidReason}</p>
                                </div>
                            )}
                            {order.status === 'refunded' && order.refundReason && (
                                <div className="mt-2 p-3 bg-light-red rounded-xl">
                                    <p className="text-xs font-bold text-danger uppercase">Refund Reason</p>
                                    <p className="text-sm text-danger">{order.refundReason}</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <div className="space-y-3">
                        <Button className="w-full flex items-center justify-center gap-2" size="lg" onClick={() => window.print()}>
                            <Printer size={18} />
                            Print / Save PDF
                        </Button>
                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2" size="lg">
                            <Download size={18} />
                            Download PDF
                        </Button>
                    </div>
                </div>
            </div>

            {/* Void Modal */}
            <Modal isOpen={voidModal} onClose={() => setVoidModal(false)} title="Void Order" size="sm">
                <form onSubmit={handleVoid} className="space-y-4">
                    <p className="text-sm text-gray">
                        Are you sure you want to void order <span className="font-bold text-dark">{order.orderNo}</span>?
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
                        <Button variant="ghost" className="flex-1" type="button" onClick={() => setVoidModal(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1" type="submit" isLoading={isProcessing}>
                            Confirm Void
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Refund Modal */}
            <Modal isOpen={refundModal} onClose={() => setRefundModal(false)} title="Process Refund" size="sm">
                <form onSubmit={handleRefund} className="space-y-4">
                    <p className="text-sm text-gray">
                        Processing refund for order <span className="font-bold text-dark">{order.orderNo}</span>.
                        Maximum refundable: {formatLKR(remainingRefundable)}
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
                        <Button variant="ghost" className="flex-1" type="button" onClick={() => setRefundModal(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1" type="submit" isLoading={isProcessing}>
                            Confirm Refund
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
