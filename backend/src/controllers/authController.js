
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select('+password');

        if (user && (await user.matchPassword(password))) {
            if (!user.isActive) {
                return res.status(401).json({ message: 'Account is deactivated' });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update current user profile
// @route   PATCH /api/auth/me
// @access  Private
export const updateMe = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const user = await User.findById(req.user._id).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, email, currentPassword, newPassword } = req.body;

        if (typeof name === 'string' && name.trim()) {
            user.name = name.trim();
        }

        if (typeof email === 'string' && email.trim()) {
            const normalizedEmail = email.toLowerCase().trim();
            const existingUser = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: user._id },
            });

            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }

            user.email = normalizedEmail;
        }

        if (newPassword !== undefined) {
            if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || newPassword.length < 6) {
                return res.status(400).json({ message: 'Valid current and new passwords are required' });
            }

            const passwordMatches = await user.matchPassword(currentPassword);

            if (!passwordMatches) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            user.password = newPassword;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile' });
    }
};
