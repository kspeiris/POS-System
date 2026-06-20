
import { useState } from 'react';
import { CreditCard, Banknote, QrCode, ArrowRight } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function CheckoutModal({ isOpen, onClose, total, onConfirm }) {
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountReceived, setAmountReceived] = useState(total.toString());
    const [isProcessing, setIsProcessing] = useState(false);

    const change = parseFloat(amountReceived || 0) - total;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate processing
        setTimeout(() => {
            onConfirm({
                paymentMethod,
                amountReceived: parseFloat(amountReceived),
                change: Math.max(0, change),
                total
            });
            setIsProcessing(false);
        }, 1500);
    };

    const paymentMethods = [
        { id: 'cash', label: 'Cash', icon: Banknote, color: 'text-green-600 bg-green-50' },
        { id: 'card', label: 'Credit Card', icon: CreditCard, color: 'text-blue-600 bg-blue-50' },
        { id: 'qr', label: 'QR Code', icon: QrCode, color: 'text-purple-600 bg-purple-50' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Complete Checkout" size="md">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Total Display */}
                <div className="bg-primary/5 p-6 rounded-2xl text-center border border-primary/10">
                    <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">Total Amount Due</p>
                    <h2 className="text-4xl font-black text-primary">${total.toFixed(2)}</h2>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Select Payment Method</label>
                    <div className="grid grid-cols-3 gap-3">
                        {paymentMethods.map((method) => (
                            <button
                                key={method.id}
                                type="button"
                                onClick={() => setPaymentMethod(method.id)}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 ${paymentMethod === method.id
                                        ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                        : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${method.color}`}>
                                    <method.icon size={20} />
                                </div>
                                <span className={`text-xs font-bold ${paymentMethod === method.id ? 'text-primary' : 'text-gray-500'}`}>
                                    {method.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Amount Received (Only for Cash) */}
                {paymentMethod === 'cash' && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Amount Received</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amountReceived}
                                    onChange={(e) => setAmountReceived(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-xl py-4 pl-8 pr-4 text-2xl font-bold focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Quick Cash Buttons */}
                        <div className="flex gap-2">
                            {[10, 20, 50, 100].map(amount => (
                                <button
                                    key={amount}
                                    type="button"
                                    onClick={() => setAmountReceived(amount.toString())}
                                    className="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
                                >
                                    ${amount}
                                </button>
                            ))}
                        </div>

                        {/* Change Display */}
                        <div className={`p-4 rounded-xl flex justify-between items-center ${change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <span className="text-sm font-medium">Change to return:</span>
                            <span className="text-xl font-bold">${Math.max(0, change).toFixed(2)}</span>
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
                        className="flex-[2] py-4 rounded-xl text-lg font-bold"
                        isLoading={isProcessing}
                        disabled={paymentMethod === 'cash' && change < 0}
                    >
                        Complete Order
                        <ArrowRight className="ml-2" size={20} />
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
