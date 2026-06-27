
import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a product name'],
            trim: true,
        },
        sku: {
            type: String,
            unique: true,
            sparse: true,
        },
        barcode: {
            type: String,
            unique: true,
            sparse: true,
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            default: 0.0,
        },
        stockQty: {
            type: Number,
            required: [true, 'Please add stock quantity'],
            default: 0,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        imageUrl: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
