
import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CheckoutModal from './CheckoutModal';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import Button from '../ui/Button';
import { formatLKR } from '../../utils/money';

export default function CartPanel() {
    const { cart, addToCart, removeFromCart, updateQuantity, subtotal, tax, total, clearCart, taxBreakdown } = useCart();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [justAdded, setJustAdded] = useState(null);
    const navigate = useNavigate();

    const getItemId = (item) => item._id || item.id;

    useEffect(() => {
        if (justAdded) {
            const timer = setTimeout(() => setJustAdded(null), 400);
            return () => clearTimeout(timer);
        }
    }, [justAdded]);

    const handleAddToCart = (product) => {
        addToCart(product);
        setJustAdded(getItemId(product));
    };

    const handleCheckoutConfirm = async (orderData) => {
        try {
            setIsProcessing(true);
            const items = cart.map(item => ({
                product: getItemId(item),
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
                taxBreakdown,
                payment: {
                    method: orderData.paymentMethod,
                    amountPaid: orderData.amountReceived,
                    change: orderData.change
                }
            });

            setIsCheckoutOpen(false);
            clearCart();
            setFeedback('');
            navigate(`/orders/${data._id}/receipt`);
        } catch (error) {
            console.error('Error creating order:', error);
            setFeedback(error.response?.data?.message || 'Failed to create order');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClearCart = () => {
        clearCart();
        setFeedback('');
    };

    return (
        <>
        <div className="bg-white/90 backdrop-blur-xl h-[calc(100vh-4rem)] flex flex-col border-l border-border/70 shadow-card fixed right-0 top-16 w-full max-w-[24rem] z-20">

            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-white/80">
                <h2 className="font-bold text-xl text-dark">Current Order</h2>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                    {cart.length} Items
                </span>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray">
                        <div className="w-16 h-16 bg-light rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="w-8 h-8 text-gray" />
                        </div>
                        <p className="text-sm">Cart is empty</p>
                        <p className="text-xs text-gray mt-1">Scan or search products to begin</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div
                            key={getItemId(item)}
                            className={`flex gap-3 p-3 rounded-2xl border border-border group transition-all duration-300 ${
                                justAdded === getItemId(item) ? 'animate-bounce-in bg-primary/5 border-primary/30' : 'bg-light hover:bg-white'
                            }`}
                        >
                            <div className="w-14 h-14 bg-white rounded-xl border border-border flex items-center justify-center shrink-0">
                                <span className="text-lg font-bold text-gray">{item.name.charAt(0)}</span>
                            </div>

                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div>
                                    <h4 className="font-semibold text-dark text-sm line-clamp-1">{item.name}</h4>
                                    <p className="text-xs text-gray">{formatLKR(item.price)} / unit</p>
                                </div>

                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center gap-2 bg-white rounded-xl border border-border px-1.5 py-0.5">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(getItemId(item), -1)}
                                            className="text-gray hover:text-danger transition-colors p-1"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(getItemId(item), 1)}
                                            className="text-gray hover:text-success transition-colors p-1"
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
                                type="button"
                                onClick={() => removeFromCart(getItemId(item))}
                                className="self-start text-gray hover:text-danger opacity-0 group-hover:opacity-100 transition-all p-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Footer / Totals */}
            <div className="p-5 bg-white border-t border-border shadow-card">
                {feedback && (
                    <div className="mb-4 rounded-2xl border border-light-red bg-light-red px-4 py-3 text-sm text-danger animate-slide-up">
                        {feedback}
                    </div>
                )}
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-gray text-sm">
                        <span>Subtotal</span>
                        <span>{formatLKR(subtotal)}</span>
                    </div>
                    {(taxBreakdown || []).map((t, idx) => (
                        <div key={t.name + idx} className="flex justify-between text-gray text-sm">
                            <span>Tax ({t.name})</span>
                            <span>{formatLKR(t.amount)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between text-dark font-bold text-lg pt-2 border-t border-dashed border-border">
                        <span>Total</span>
                        <span className="text-primary">{formatLKR(total)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        onClick={handleClearCart}
                        disabled={cart.length === 0}
                        variant="secondary"
                        className="border-light-red text-danger hover:bg-light-red"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => setIsCheckoutOpen(true)}
                        disabled={cart.length === 0}
                        className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold text-sm shadow-card transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Charge {formatLKR(total)}
                    </Button>
                </div>
            </div>
        </div>

        <CheckoutModal
            key={`${isCheckoutOpen}-${total}`}
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            total={total}
            onConfirm={handleCheckoutConfirm}
            isProcessing={isProcessing}
        />
        </>
    );
}
