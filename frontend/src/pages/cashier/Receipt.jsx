
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { orderApi } from '../../api/orderApi';
import Loader from '../../components/ui/Loader';
import { formatLKR } from '../../utils/money';

export default function Receipt() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await orderApi.getReceipt(id);
                setOrder(data);
            } catch (error) {
                console.error('Error fetching receipt:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) return <Loader fullPage />;
    if (!order) return <div className="p-20 text-center">Order not found</div>;

    const displayOrder = {
        id: order.orderNo,
        date: order.createdAt,
        cashier: order.cashier?.name || order.cashierName || 'Unknown cashier',
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        amountPaid: order.payment?.amountPaid ?? 0,
        change: order.payment?.change ?? 0,
        items: order.items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.qty,
            subtotal: item.total
        }))
    };

    return (
        <div className="min-h-screen bg-light flex flex-col items-center py-10 print:bg-white print:py-0">
            {/* Action Bar (Hidden on print) */}
            <div className="mb-6 flex gap-4 print:hidden">
                <button
                    onClick={() => navigate('/orders')}
                    className="px-6 py-2 bg-white border border-border rounded-lg text-sm font-medium hover:bg-light"
                >
                    Back to Orders
                </button>
                <button
                    onClick={handlePrint}
                    className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-hover shadow-card"
                >
                    Print / Save PDF
                </button>
            </div>

            {/* Receipt Card */}
            <div className="bg-white w-[380px] p-8 shadow-card print:shadow-none border border-border print:border-none flex flex-col">
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-2xl font-black italic tracking-tighter text-dark uppercase">QuickPOS Lite</h1>
                    <p className="text-xs text-gray">123 Restaurant Street, City Center</p>
                    <p className="text-xs text-gray">Tel: +1 (234) 567-890</p>
                </div>

                <div className="border-y border-dashed border-border py-3 mb-6 flex flex-col gap-1 text-xs text-dark-2">
                    <div className="flex justify-between">
                        <span>Receipt:</span>
                        <span className="font-bold text-dark">#{displayOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{dayjs(displayOrder.date).format('MMM D, YYYY HH:mm')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Cashier:</span>
                        <span>{displayOrder.cashier}</span>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    {displayOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                            <div className="flex-1">
                                <p className="font-medium text-dark">{item.name}</p>
                                <p className="text-xs text-gray">{item.quantity} x {formatLKR(item.price)}</p>
                            </div>
                            <p className="font-semibold text-dark">{formatLKR(item.subtotal)}</p>
                        </div>
                    ))}
                </div>

                <div className="border-t border-dashed border-border pt-4 space-y-2 mb-8">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatLKR(displayOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Tax (10%):</span>
                        <span>{formatLKR(displayOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-dark pt-2">
                        <span>TOTAL:</span>
                        <span>{formatLKR(displayOrder.total)}</span>
                    </div>
                </div>

                <div className="space-y-1 mb-8 text-xs text-dark-2">
                    <div className="flex justify-between">
                        <span>Paid:</span>
                        <span>{formatLKR(displayOrder.amountPaid)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-dark">
                        <span>Change:</span>
                        <span>{formatLKR(displayOrder.change)}</span>
                    </div>
                </div>

                <div className="text-center space-y-2 pt-4 border-t border-dashed border-border">
                    <p className="text-xs font-medium text-dark uppercase tracking-widest">Thank you for your visit!</p>
                    <p className="text-[10px] text-gray">Please keep this receipt for your records.</p>
                </div>

                {/* Barcode/QR Placeholder */}
                <div className="mt-8 flex justify-center">
                    <div className="w-48 h-12 bg-light border border-border flex items-center justify-center">
                        <span className="text-[10px] text-gray tracking-[0.3em]">|||| || ||||| | ||| ||||</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
