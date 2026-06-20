
import { useState } from 'react';
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import clsx from 'clsx';
import CheckoutModal from './CheckoutModal';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';

export default function CartPanel() {
    const { cart, removeFromCart, updateQuantity, subtotal, tax, total, clearCart } = useCart();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handleCheckoutConfirm = async (orderData) => {
        try {
            setIsProcessing(true);
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
            alert(error.response?.data?.message || 'Failed to create order');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white h-full flex flex-col border-l border-gray-200 shadow-xl fixed right-0 top-16 w-96 z-20">

            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
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
                        <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                            {/* Image Placeholder */}
                            <div className="w-16 h-16 bg-white rounded-md border border-gray-200 flex items-center justify-center shrink-0">
                                <span className="text-xl font-bold text-gray-300">{item.name.charAt(0)}</span>
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-semibold text-dark text-sm line-clamp-1">{item.name}</h4>
                                    <p className="text-xs text-gray-500">${item.price.toFixed(2)} / unit</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 bg-white rounded-md border border-gray-200 px-2 py-1">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="text-gray-400 hover:text-green-500 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <span className="font-bold text-dark text-sm">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="self-start text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Footer / Totals */}
            <div className="p-5 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-gray-500 text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-sm">
                        <span>Tax (10%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-dark font-bold text-lg pt-2 border-t border-dashed border-gray-200">
                        <span>Total</span>
                        <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={clearCart}
                        disabled={cart.length === 0}
                        className="px-4 py-3 border border-red-100 text-red-600 rounded-lg hover:bg-red-50 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => setIsCheckoutOpen(true)}
                        disabled={cart.length === 0}
                        className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold text-sm shadow-lg shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Charge ${(total).toFixed(2)}
                    </button>
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
