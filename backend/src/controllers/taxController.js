
import TaxRule from '../models/TaxRule.js';

const isValidObjectId = (value) => value && value.match(/^[0-9a-fA-F]{24}$/);

// @desc    Get all tax rules
// @route   GET /api/tax-rules
// @access  Private/Admin
export const getTaxRules = async (req, res) => {
    try {
        const rules = await TaxRule.find({}).sort({ createdAt: -1 });
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active tax rules
// @route   GET /api/tax-rules/active
// @access  Private
export const getActiveTaxRules = async (req, res) => {
    try {
        const rules = await TaxRule.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create tax rule
// @route   POST /api/tax-rules
// @access  Private/Admin
export const createTaxRule = async (req, res) => {
    try {
        const { name, rate, isActive } = req.body;
        const normalizedName = typeof name === 'string' ? name.trim() : '';
        const parsedRate = Number(rate);

        if (!normalizedName) {
            return res.status(400).json({ message: 'Tax rule name is required' });
        }

        if (!Number.isFinite(parsedRate) || parsedRate < 0 || parsedRate > 100) {
            return res.status(400).json({ message: 'Tax rate must be a number between 0 and 100' });
        }

        const rule = await TaxRule.create({
            name: normalizedName,
            rate: parsedRate,
            isActive: isActive !== undefined ? Boolean(isActive) : true,
        });

        res.status(201).json(rule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update tax rule
// @route   PUT /api/tax-rules/:id
// @access  Private/Admin
export const updateTaxRule = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid tax rule id' });
        }

        const { name, rate, isActive } = req.body;
        const rule = await TaxRule.findById(req.params.id);

        if (!rule) {
            return res.status(404).json({ message: 'Tax rule not found' });
        }

        if (name !== undefined) {
            const normalizedName = typeof name === 'string' ? name.trim() : '';
            if (normalizedName) {
                rule.name = normalizedName;
            }
        }

        if (rate !== undefined) {
            const parsedRate = Number(rate);
            if (Number.isFinite(parsedRate) && parsedRate >= 0 && parsedRate <= 100) {
                rule.rate = parsedRate;
            }
        }

        if (isActive !== undefined) {
            rule.isActive = Boolean(isActive);
        }

        const updatedRule = await rule.save();
        res.json(updatedRule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete tax rule
// @route   DELETE /api/tax-rules/:id
// @access  Private/Admin
export const deleteTaxRule = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid tax rule id' });
        }

        const rule = await TaxRule.findById(req.params.id);
        if (!rule) {
            return res.status(404).json({ message: 'Tax rule not found' });
        }

        await rule.deleteOne();
        res.json({ message: 'Tax rule deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
