
import { useState } from 'react';
import { X, CreditCard, Banknote, QrCode, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import { formatLKR } from '../../utils/money';
import clsx from 'clsx';

export default function CheckoutModal({ isOpen, onClose, total, onConfirm, isProcessing }) {
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountReceived, setAmountReceived] = useState(total.toString());
    const [amountError, setAmountError] = useState('');

    const change = parseFloat(amountReceived || 0) - total;

    const validateAmount = () => {
        const parsed = parseFloat(amountReceived);
        if (Number.isNaN(parsed) || parsed < total) {
            setAmountError(`Amount must be at least ${formatLKR(total)}`);
            return false;
        }
        setAmountError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateAmount()) return;
        onConfirm({
            paymentMethod,
            amountReceived: parseFloat(amountReceived),
            change: Math.max(0, change),
            total
        });
    };

    const paymentMethods = [
        { id: 'cash', label: 'Cash', icon: Banknote, color: 'text-success bg-light-green' },
        { id: 'card', label: 'Credit Card', icon: CreditCard, color: 'text-primary bg-light-blue' },
        { id: 'qr', label: 'QR Code', icon: QrCode, color: 'text-secondary bg-orange-50' },
    ];

    return (
        <div
            className={clsx(
                "fixed inset-0 z-[60] flex justify-end",
                isOpen ? "pointer-events-auto" : "pointer-events-none"
            )}
        >
            {/* Backdrop */}
            <div
                className={clsx(
                    "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={clsx(
                    "relative w-full max-w-[24rem] bg-white border-l border-border/70 shadow-card flex flex-col",
                    "transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                style={{ height: 'calc(100vh - 4rem)', top: '4rem' }}
            >
                {/* Header */}
                <div className="p-5 border-b border-border flex items-center justify-between bg-white shrink-0">
                    <h2 className="font-bold text-xl text-dark">Complete Checkout</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-light transition-colors text-gray hover:text-dark"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Total Display */}
                    <div className="p-4 rounded-2xl border border-border bg-light text-center">
                        <p className="text-[11px] font-medium text-gray uppercase tracking-wider mb-1">Total Amount Due</p>
                        <h2 className="text-2xl font-bold text-dark">{formatLKR(total)}</h2>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-gray">Select Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all gap-2 ${
                                        paymentMethod === method.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <div className={`p-1.5 rounded-lg ${method.color}`}>
                                        <method.icon size={18} />
                                    </div>
                                    <span className={`text-[11px] font-bold ${paymentMethod === method.id ? 'text-primary' : 'text-gray'}`}>
                                        {method.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amount Received */}
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-gray">Amount Received</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray font-bold text-xs">LKR</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amountReceived}
                                    onChange={(e) => {
                                        setAmountReceived(e.target.value);
                                        if (amountError) setAmountError('');
                                    }}
                                    readOnly={paymentMethod !== 'cash'}
                                    className={clsx(
                                        "w-full bg-light rounded-2xl py-3 pl-10 pr-4 text-lg font-bold focus:ring-2 focus:ring-primary transition-all",
                                        amountError ? "border-2 border-danger" : "border border-border",
                                        paymentMethod !== 'cash' && "opacity-70 cursor-not-allowed"
                                    )}
                                    autoFocus
                                />
                            </div>
                            {amountError && (
                                <p className="text-[11px] text-danger font-medium">{amountError}</p>
                            )}
                        </div>

                        {paymentMethod === 'cash' && (
                            <>
                                {/* Quick Cash Buttons */}
                                <div className="flex gap-2">
                                    {[500, 1000, 2000, 5000].map(amount => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() => {
                                                setAmountReceived(amount.toString());
                                                setAmountError('');
                                            }}
                                            className="flex-1 py-2 bg-white border border-border rounded-xl text-[11px] font-bold text-dark hover:bg-light hover:border-gray-300 transition-all"
                                        >
                                            {amount.toLocaleString()}
                                        </button>
                                    ))}
                                </div>

                                {/* Change Display */}
                                <div className={`p-3 rounded-2xl border border-border flex justify-between items-center ${
                                    change >= 0 ? 'bg-light-green text-success' : 'bg-light-red text-danger'
                                }`}>
                                    <span className="text-[11px] font-medium">Change to return:</span>
                                    <span className="text-xs font-bold">{formatLKR(Math.max(0, change))}</span>
                                </div>
                            </>
                        )}

                        {paymentMethod !== 'cash' && (
                            <div className="p-3 rounded-2xl border border-border bg-light text-[11px] text-gray text-center">
                                Payment of {formatLKR(total)} will be processed via {paymentMethod === 'card' ? 'Credit Card' : 'QR Code'}
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="p-5 bg-white border-t border-border shrink-0">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1 border-light-red text-danger hover:bg-light-red"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-[2] py-3 rounded-xl text-xs font-bold"
                            isLoading={isProcessing}
                            disabled={!!amountError || isProcessing}
                        >
                            Complete Order
                            <ArrowRight className="ml-2" size={14} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
