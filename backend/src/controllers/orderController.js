
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    const { items, payment, subtotal, tax, total, discount, taxBreakdown } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    if (!payment?.method || payment.amountPaid === undefined) {
        return res.status(400).json({ message: 'Payment method and amount paid are required' });
    }

    const normalizedItems = items.map((item) => ({
        ...item,
        qty: Number(item.qty),
        price: Number(item.price),
        total: Number(item.total),
    }));

    for (const item of normalizedItems) {
        if (!isValidObjectId(item.product)) {
            return res.status(400).json({ message: `Invalid product id for ${item.name || 'item'}` });
        }

        if (!Number.isFinite(item.qty) || item.qty <= 0) {
            return res.status(400).json({ message: `Invalid quantity for ${item.name || 'item'}` });
        }

        if (!Number.isFinite(item.price) || item.price < 0) {
            return res.status(400).json({ message: `Invalid price for ${item.name || 'item'}` });
        }
    }

    try {
        let createdOrder;
        const reservedItems = [];

        try {
            // 1. Generate human-friendly order number
            const date = new Date();
            const orderNo = `ORD-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${date.getTime().toString().slice(-6)}`;

            // 2. Reserve inventory with conditional atomic decrements
            for (const item of normalizedItems) {
                const updatedProduct = await Product.findOneAndUpdate(
                    {
                        _id: item.product,
                        stockQty: { $gte: item.qty },
                        isAvailable: true,
                    },
                    { $inc: { stockQty: -item.qty } },
                    { new: true }
                );

                if (!updatedProduct) {
                    const product = await Product.findById(item.product);

                    if (!product) {
                        throw new Error(`Product ${item.name || 'item'} not found`);
                    }

                    if (!product.isAvailable) {
                        throw new Error(`${item.name || product.name} is unavailable`);
                    }

                    throw new Error(`Insufficient stock for ${item.name || product.name}`);
                }

                reservedItems.push({ product: item.product, qty: item.qty });
            }

            // 3. Create order
            const normalizedTaxBreakdown = Array.isArray(taxBreakdown)
                ? taxBreakdown.map((t) => ({
                    name: typeof t.name === 'string' ? t.name : 'Tax',
                    rate: Number(t.rate) || 0,
                    amount: Number(t.amount) || 0,
                }))
                : [];

            const order = new Order({
                orderNo,
                cashier: req.user._id,
                cashierName: req.user.name,
                items: normalizedItems,
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

            createdOrder = await order.save();
            return res.status(201).json(createdOrder);
        } catch (error) {
            if (reservedItems.length > 0) {
                await Promise.all(
                    reservedItems.map((item) =>
                        Product.findByIdAndUpdate(item.product, {
                            $inc: { stockQty: item.qty },
                        })
                    )
                );
            }

            throw error;
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
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

        const order = await Order.findById(req.params.id).populate('cashier', 'name email role');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Void an order (restore stock)
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

// @desc    Process refund for an order
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
        order.refundAmount = (Number(order.refundAmount || 0) + refundAmount);
        order.refundReason = typeof reason === 'string' ? reason : '';
        await order.save();

        res.json({ message: 'Refund processed successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get receipt data by order ID
// @route   GET /api/orders/:id/receipt
// @access  Private
export const getOrderReceipt = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order id' });
        }

        const order = await Order.findById(req.params.id).populate('cashier', 'name email role');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('cashier', 'name email role').sort({ createdAt: -1 });
        res.json(orders);
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

        if (Number.isNaN(date.getTime())) {
            return res.status(400).json({ message: 'Invalid date parameter' });
        }

        const start = new Date(date.setHours(0, 0, 0, 0));
        const end = new Date(date.setHours(23, 59, 59, 999));

        const orders = await Order.find({
            createdAt: { $gte: start, $lte: end },
            status: 'completed',
        }).populate('items.product', 'name category');

        const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
        const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;

        const paymentBreakdown = {
            cash: orders.filter(o => o.payment.method === 'cash').reduce((acc, o) => acc + o.total, 0),
            card: orders.filter(o => o.payment.method === 'card').reduce((acc, o) => acc + o.total, 0),
            qr: orders.filter(o => o.payment.method === 'qr').reduce((acc, o) => acc + o.total, 0),
        };

        const salesByCategoryMap = new Map();
        for (const order of orders) {
            for (const item of order.items) {
                const category = item.product?.category || 'Uncategorized';
                const itemTotal = Number(item.total) || 0;
                salesByCategoryMap.set(category, (salesByCategoryMap.get(category) || 0) + itemTotal);
            }
        }

        const salesByCategory = Array.from(salesByCategoryMap.entries())
            .map(([category, sales]) => ({ category, sales }))
            .sort((a, b) => b.sales - a.sales);

        res.json({
            date: start.toISOString().split('T')[0],
            totalSales,
            totalOrders,
            avgOrderValue,
            cancelledOrders,
            paymentBreakdown,
            salesByCategory,
            recentOrders: orders.slice(0, 20),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
