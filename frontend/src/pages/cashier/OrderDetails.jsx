
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, MapPin, Calendar, Clock, CreditCard, Ban, DollarSign } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table, { TableRow, TableCell } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import dayjs from 'dayjs';

import { useState, useEffect } from 'react';
import { orderApi } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import { formatLKR } from '../../utils/money';

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = user?.role === 'admin';

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

    if (isLoading) return <Loader fullPage />;
    if (!order) return <div className="p-20 text-center text-dark">Order not found</div>;

    const remainingRefundable = Number(order.total) - Number(order.refundAmount || 0);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
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
                            <div className="flex justify-between items-center">
                                <span className="text-gray">Tax</span>
                                <span className="font-medium text-dark">{formatLKR(order.tax)}</span>
                            </div>
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
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray">Change</span>
                                <span className="font-medium text-success">{formatLKR(order.payment?.change ?? 0)}</span>
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
                            Print Receipt
                        </Button>
                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2" size="lg">
                            <Download size={18} />
                            Download PDF
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
