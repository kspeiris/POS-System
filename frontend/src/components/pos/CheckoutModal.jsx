
import { useState } from 'react';
import { CreditCard, Banknote, QrCode, ArrowRight } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { formatLKR } from '../../utils/money';
import clsx from 'clsx';

export default function CheckoutModal({ isOpen, onClose, total, onConfirm, isProcessing }) {
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountReceived, setAmountReceived] = useState('');
    const [amountError, setAmountError] = useState('');

    const change = parseFloat(amountReceived || 0) - total;

    const validateAmount = () => {
        const parsed = parseFloat(amountReceived);
        if (Number.isNaN(parsed) || parsed < 0) {
            setAmountError('Please enter a valid amount');
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
        <Modal isOpen={isOpen} onClose={onClose} title="Complete Checkout" size="md">
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
                {/* Total Display */}
                <div className="bg-primary/5 p-6 rounded-2xl text-center border border-primary/10 animate-pop-in">
                    <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">Total Amount Due</p>
                    <h2 className="text-4xl font-black text-primary">{formatLKR(total)}</h2>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-dark-2">Select Payment Method</label>
                    <div className="grid grid-cols-3 gap-3">
                        {paymentMethods.map((method) => (
                            <button
                                key={method.id}
                                type="button"
                                onClick={() => setPaymentMethod(method.id)}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${paymentMethod === method.id
                                        ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                        : 'border-border bg-white hover:border-border'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${method.color}`}>
                                    <method.icon size={20} />
                                </div>
                                <span className={`text-xs font-bold ${paymentMethod === method.id ? 'text-primary' : 'text-gray'}`}>
                                    {method.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Amount Received (Only for Cash) */}
                {paymentMethod === 'cash' && (
                    <div className="space-y-4 animate-slide-up">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-dark-2">Amount Received</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray font-bold">LKR</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amountReceived}
                                    onChange={(e) => {
                                        setAmountReceived(e.target.value);
                                        if (amountError) setAmountError('');
                                    }}
                                    className={clsx(
                                        "w-full bg-light border-none rounded-2xl py-4 pl-14 pr-4 text-2xl font-bold focus:ring-2 focus:ring-primary transition-all",
                                        amountError ? "border-2 border-danger" : ""
                                    )}
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>
                            {amountError && (
                                <p className="text-sm text-danger font-medium">{amountError}</p>
                            )}
                        </div>

                        {/* Quick Cash Buttons */}
                        <div className="flex gap-2">
                            {[10, 20, 50, 100].map(amount => (
                                <button
                                    key={amount}
                                    type="button"
                                    onClick={() => {
                                        setAmountReceived(amount.toString());
                                        setAmountError('');
                                    }}
                                    className="flex-1 py-2 bg-white border border-border rounded-xl text-sm font-bold text-dark-2 hover:bg-light hover:border-border transition-all"
                                >
                                    LKR {amount}
                                </button>
                            ))}
                        </div>

                        {/* Change Display */}
                        <div className={`p-4 rounded-xl flex justify-between items-center ${change >= 0 ? 'bg-light-green text-success' : 'bg-light-red text-danger'}`}>
                            <span className="text-sm font-medium">Change to return:</span>
                            <span className="text-xl font-bold">{formatLKR(Math.max(0, change))}</span>
                        </div>
                    </div>
                )}

                <div className="pt-4 flex gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        className="flex-1"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-[2] py-4 rounded-xl text-lg font-bold animate-pop-in"
                        isLoading={isProcessing}
                        disabled={!!amountError || (paymentMethod === 'cash' && change < 0)}
                    >
                        Complete Order
                        <ArrowRight className="ml-2" size={20} />
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
