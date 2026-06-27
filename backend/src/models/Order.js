
import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
    {
        orderNo: {
            type: String,
            required: true,
            unique: true,
        },
        cashier: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        cashierName: {
            type: String,
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                price: { type: Number, required: true },
                total: { type: Number, required: true },
                imageUrl: { type: String },
            },
        ],
        subtotal: {
            type: Number,
            required: true,
            default: 0.0,
        },
        tax: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxBreakdown: [{
            name: { type: String },
            rate: { type: Number },
            amount: { type: Number },
        }],
        discount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        total: {
            type: Number,
            required: true,
            default: 0.0,
        },
        payment: {
            method: {
                type: String,
                required: true,
                enum: ['cash', 'card', 'qr'],
                default: 'cash',
            },
            amountPaid: {
                type: Number,
                required: true,
            },
            change: {
                type: Number,
                required: true,
                default: 0.0,
            },
        },
        status: {
            type: String,
            required: true,
            enum: ['completed', 'pending', 'cancelled', 'refunded', 'voided'],
            default: 'completed',
        },
        voidedAt: {
            type: Date,
        },
        voidedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        voidReason: {
            type: String,
        },
        refundedAt: {
            type: Date,
        },
        refundedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        refundAmount: {
            type: Number,
            default: 0.0,
        },
        refundReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
