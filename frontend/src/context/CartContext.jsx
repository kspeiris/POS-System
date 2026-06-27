/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [taxRate, setTaxRate] = useState(0);
    const [taxRules, setTaxRules] = useState([]);

    useEffect(() => {
        const fetchTaxRules = async () => {
            try {
                const { data } = await api.get('/tax-rules/active');
                const totalRate = data.reduce((sum, rule) => sum + Number(rule.rate || 0), 0);
                setTaxRate(totalRate / 100);
                setTaxRules(data || []);
            } catch (error) {
                setTaxRate(0);
                setTaxRules([]);
            }
        };
        fetchTaxRules();
    }, []);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxBreakdown = taxRules.map(rule => ({
        name: rule.name,
        rate: rule.rate,
        amount: Number((subtotal * (rule.rate / 100)).toFixed(2)),
    }));
    const tax = taxBreakdown.reduce((sum, t) => sum + t.amount, 0);
    const total = subtotal + tax;

    const addToCart = (product) => {
        setCart(prevCart => {
            const productId = product._id || product.id;
            const existingItem = prevCart.find(item => (item._id || item.id) === productId);
            if (existingItem) {
                return prevCart.map(item =>
                    (item._id || item.id) === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => (item._id || item.id) !== productId));
    };

    const updateQuantity = (productId, change) => {
        setCart(prev => prev.map(item => {
            if ((item._id || item.id) === productId) {
                const newQty = item.quantity + change;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            subtotal,
            tax,
            total,
            taxRate,
            taxRules,
            taxBreakdown,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
