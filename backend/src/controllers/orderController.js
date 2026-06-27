
import Order from '../models/Order.js';
import Product from '../models/Product.js';

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
                return res.status(404).json({ message: `Product ${item.name} not found` });
            }
            if (product.stockQty < item.qty) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
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
            subtotal,
            tax,
            total,
            discount,
            taxBreakdown: normalizedTaxBreakdown,
            payment,
        });

        const createdOrder = await order.save();

        // 4. Update stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stockQty: -item.qty },
            });
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
        const orders = await Order.find({}).sort({ createdAt: -1 });
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
        const start = new Date(date.setHours(0, 0, 0, 0));
        const end = new Date(date.setHours(23, 59, 59, 999));

        const orders = await Order.find({
            createdAt: { $gte: start, $lte: end },
            status: 'completed',
        });

        const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
        const totalOrders = orders.length;

        // Aggregation for payment methods
        const paymentBreakdown = {
            cash: orders.filter(o => o.payment.method === 'cash').reduce((acc, o) => acc + o.total, 0),
            card: orders.filter(o => o.payment.method === 'card').reduce((acc, o) => acc + o.total, 0),
            qr: orders.filter(o => o.payment.method === 'qr').reduce((acc, o) => acc + o.total, 0),
        };

        res.json({
            date: start.toISOString().split('T')[0],
            totalSales,
            totalOrders,
            paymentBreakdown,
            orders: orders.slice(0, 50), // Send last 50 orders for summary
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
