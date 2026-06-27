
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// @desc    Fetch all products
// @route   GET /api/products
// @access  Private
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
export const getProductById = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product id' });
        }

        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const { name, price, category, stockQty, description, imageUrl } = req.body;

        const categoryName = typeof category === 'string' ? category.trim() : '';
        const normalizedName = typeof name === 'string' ? name.trim() : '';
        const normalizedDescription = typeof description === 'string' ? description.trim() : '';
        const normalizedImageUrl = typeof imageUrl === 'string' ? imageUrl.trim() : '';
        const parsedPrice = Number(price);
        const parsedStockQty = Number(stockQty);

        if (!normalizedName || !categoryName) {
            return res.status(400).json({ message: 'Name and category are required' });
        }

        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({ message: 'Price must be a valid non-negative number' });
        }

        if (!Number.isFinite(parsedStockQty) || parsedStockQty < 0 || !Number.isInteger(parsedStockQty)) {
            return res.status(400).json({ message: 'Stock quantity must be a whole number greater than or equal to 0' });
        }

        const product = new Product({
            name: normalizedName,
            price: parsedPrice,
            category: categoryName,
            stockQty: parsedStockQty,
            description: normalizedDescription,
            imageUrl: normalizedImageUrl,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product id' });
        }

        const { name, price, category, stockQty, description, imageUrl, isAvailable } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            if (name !== undefined) {
                const normalizedName = typeof name === 'string' ? name.trim() : '';
                if (!normalizedName) {
                    return res.status(400).json({ message: 'Product name cannot be empty' });
                }
                product.name = normalizedName;
            }

            if (price !== undefined) {
                const parsedPrice = Number(price);
                if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
                    return res.status(400).json({ message: 'Price must be a valid non-negative number' });
                }
                product.price = parsedPrice;
            }

            if (category !== undefined) {
                const normalizedCategory = typeof category === 'string' ? category.trim() : '';
                if (!normalizedCategory) {
                    return res.status(400).json({ message: 'Category cannot be empty' });
                }
                product.category = normalizedCategory;
            }

            if (stockQty !== undefined) {
                const parsedStockQty = Number(stockQty);
                if (!Number.isFinite(parsedStockQty) || parsedStockQty < 0 || !Number.isInteger(parsedStockQty)) {
                    return res.status(400).json({ message: 'Stock quantity must be a whole number greater than or equal to 0' });
                }
                product.stockQty = parsedStockQty;
            }

            product.description = description ?? product.description;
            product.imageUrl = imageUrl ?? product.imageUrl;
            product.isAvailable = isAvailable ?? product.isAvailable;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product id' });
        }

        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
