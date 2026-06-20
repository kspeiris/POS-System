
import Product from '../models/Product.js';

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

        if (!normalizedName || !categoryName) {
            return res.status(400).json({ message: 'Name and category are required' });
        }

        const product = new Product({
            name: normalizedName,
            price,
            category: categoryName,
            stockQty,
            description,
            imageUrl,
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
        const { name, price, category, stockQty, description, imageUrl, isAvailable } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name?.trim() || product.name;
            product.price = price ?? product.price;
            product.category = category?.trim() || product.category;
            product.stockQty = stockQty ?? product.stockQty;
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
