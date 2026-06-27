
import mongoose from 'mongoose';

const taxRuleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tax rule name is required'],
            trim: true,
        },
        rate: {
            type: Number,
            required: [true, 'Tax rate is required'],
            min: [0, 'Tax rate cannot be negative'],
            max: [100, 'Tax rate cannot exceed 100'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const TaxRule = mongoose.model('TaxRule', taxRuleSchema);

export default TaxRule;
