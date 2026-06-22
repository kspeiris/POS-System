
import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CheckoutModal from './CheckoutModal';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import Button from '../ui/Button';
import { formatLKR } from '../../utils/money';

export default function CartPanel() {
    const { cart, removeFromCart, updateQuantity, subtotal, tax, total, clearCart } = useCart();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
        const [feedback, setFeedback] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFeedback('');
    }, [cart.length]);

    const handleCheckoutConfirm = async (orderData) => {
        try {
                        const items = cart.map(item => ({
                product: item._id || item.id,
                name: item.name,
                qty: item.quantity,
                price: item.price,
                total: item.price * item.quantity
            }));

            const { data } = await orderApi.create({
                items,
                subtotal,
                tax,
                total,
                discount: 0,
                payment: {
                    method: orderData.paymentMethod,
                    amountPaid: orderData.amountReceived,
                    change: orderData.change
                }
            });

            setIsCheckoutOpen(false);
            clearCart();
            navigate(`/orders/${data._id}/receipt`);
        } catch (error) {
            console.error('Error creating order:', error);
            setFeedback(error.response?.data?.message || 'Failed to create order');
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-xl h-[calc(100vh-4rem)] flex flex-col border-l border-white/60 shadow-[0_20px_60px_rgba(15,23,42,0.08)] fixed right-0 top-16 w-full max-w-[24rem] z-20">

            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/80">
                <h2 className="font-bold text-xl text-dark">Current Order</h2>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                    {cart.length} Items
                </span>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <CreditCard className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-sm">Cart is empty</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
                            <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                                <span className="text-xl font-bold text-gray-300">{item.name.charAt(0)}</span>
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-semibold text-dark text-sm line-clamp-1">{item.name}</h4>
                                    <p className="text-xs text-slate-500">{formatLKR(item.price)} / unit</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-2 py-1">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="text-slate-400 hover:text-emerald-500 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <span className="font-bold text-dark text-sm">
                                        {formatLKR(item.price * item.quantity)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="self-start text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Footer / Totals */}
            <div className="p-5 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(15,23,42,0.04)]">
                {feedback && (
                    <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {feedback}
                    </div>
                )}
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-slate-500 text-sm">
                        <span>Subtotal</span>
                        <span>{formatLKR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-sm">
                        <span>Tax (10%)</span>
                        <span>{formatLKR(tax)}</span>
                    </div>
                    <div className="flex justify-between text-dark font-bold text-lg pt-2 border-t border-dashed border-slate-200">
                        <span>Total</span>
                        <span className="text-primary">{formatLKR(total)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        onClick={clearCart}
                        disabled={cart.length === 0}
                        variant="secondary"
                        className="border-red-100 text-red-600 hover:bg-red-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => setIsCheckoutOpen(true)}
                        disabled={cart.length === 0}
                        className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold text-sm shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Charge {formatLKR(total)}
                    </Button>
                </div>
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                total={total}
                onConfirm={handleCheckoutConfirm}
            />
        </div>
    );
}
