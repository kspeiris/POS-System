
import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const normalizedName = typeof name === 'string' ? name.trim() : '';

        if (!normalizedName) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const categoryExists = await Category.findOne({
            name: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
        });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({ name: normalizedName, description });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const { name, description } = req.body;
        const normalizedName = typeof name === 'string' ? name.trim() : '';

        if (normalizedName) {
            const duplicate = await Category.findOne({
                _id: { $ne: category._id },
                name: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
            });

            if (duplicate) {
                return res.status(400).json({ message: 'Category already exists' });
            }

            category.name = normalizedName;
        }

        if (description !== undefined) {
            category.description = description;
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            await category.deleteOne();
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
