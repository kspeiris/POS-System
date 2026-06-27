
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    const { items, payment, subtotal, tax, total, discount, taxBreakdown } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        // 1. Generate human-friendly order number
        const date = new Date();
        const orderCount = await Order.countDocuments();
        const orderNo = `ORD-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${(orderCount + 1).toString().padStart(4, '0')}`;

        // 2. Validate stock and items
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.name || 'item'} not found` });
            }
            if (product.stockQty < item.qty) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name || 'item'}` });
            }
        }

        const normalizedTaxBreakdown = Array.isArray(taxBreakdown)
            ? taxBreakdown.map((t) => ({
                  name: typeof t.name === 'string' ? t.name : 'Tax',
                  rate: Number(t.rate) || 0,
                  amount: Number(t.amount) || 0,
              }))
            : [];

        // 3. Create order
        const order = new Order({
            orderNo,
            cashier: req.user._id,
            cashierName: req.user.name,
            items,
            subtotal: Number(subtotal) || 0,
            tax: Number(tax) || 0,
            total: Number(total) || 0,
            discount: Number(discount) || 0,
            taxBreakdown: normalizedTaxBreakdown,
            payment: {
                method: payment.method,
                amountPaid: Number(payment.amountPaid) || 0,
                change: Number(payment.change) || 0,
            },
        });

        const createdOrder = await order.save();

        // 4. Update stock AFTER order is committed
        for (const item of items) {
            if (isValidObjectId(item.product)) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stockQty: -item.qty },
                });
            }
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order id' });
        }

        const order = await Order.findById(req.params.id).populate('cashier', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('cashier', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Void an order
// @route   PATCH /api/orders/:id/void
// @access  Private/Admin
export const voidOrder = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order id' });
        }

        const { reason } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'voided') {
            return res.status(400).json({ message: 'Order is already voided' });
        }

        if (order.status === 'refunded') {
            return res.status(400).json({ message: 'Cannot void a refunded order' });
        }

        // Restore stock
        for (const item of order.items) {
            if (isValidObjectId(item.product)) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stockQty: item.qty },
                });
            }
        }

        order.status = 'voided';
        order.voidedAt = new Date();
        order.voidedBy = req.user._id;
        order.voidReason = typeof reason === 'string' ? reason : '';
        await order.save();

        res.json({ message: 'Order voided successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Refund an order
// @route   PATCH /api/orders/:id/refund
// @access  Private/Admin
export const refundOrder = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order id' });
        }

        const { amount, reason } = req.body;
        const refundAmount = Number(amount);

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'voided') {
            return res.status(400).json({ message: 'Cannot refund a voided order' });
        }

        if (order.status === 'refunded') {
            return res.status(400).json({ message: 'Order is already refunded' });
        }

        if (!Number.isFinite(refundAmount) || refundAmount <= 0) {
            return res.status(400).json({ message: 'Valid refund amount is required' });
        }

        const remainingRefundable = Number(order.total) - Number(order.refundAmount || 0);
        if (refundAmount > remainingRefundable) {
            return res.status(400).json({ message: `Refund amount cannot exceed remaining refundable amount of ${remainingRefundable}` });
        }

        order.status = 'refunded';
        order.refundedAt = new Date();
        order.refundedBy = req.user._id;
        order.refundAmount = Number(order.refundAmount || 0) + refundAmount;
        order.refundReason = typeof reason === 'string' ? reason : '';
        await order.save();

        res.json({ message: 'Refund processed successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get daily report
// @route   GET /api/reports/daily
// @access  Private/Admin
export const getDailyReport = async (req, res) => {
    try {
        const date = req.query.date ? new Date(req.query.date) : new Date();
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            createdAt: { $gte: startDate, $lte: endDate },
            status: 'completed',
        }).populate('cashier', 'name email').sort({ createdAt: -1 });

        const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
        const totalOrders = orders.length;

        const paymentBreakdown = {
            cash: orders.filter(o => o.payment.method === 'cash').reduce((acc, o) => acc + o.total, 0),
            card: orders.filter(o => o.payment.method === 'card').reduce((acc, o) => acc + o.total, 0),
            qr: orders.filter(o => o.payment.method === 'qr').reduce((acc, o) => acc + o.total, 0),
        };

        res.json({
            date: startDate.toISOString().split('T')[0],
            totalSales,
            totalOrders,
            paymentBreakdown,
            orders,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
