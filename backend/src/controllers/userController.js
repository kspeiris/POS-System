
import mongoose from 'mongoose';
import User from '../models/User.js';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
const isAllowedRole = (role) => ['admin', 'cashier'].includes(role);

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('name email role isActive createdAt updatedAt')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: error.message || 'Failed to load users' });
    }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const normalizedName = typeof name === 'string' ? name.trim() : '';
        const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';
        const normalizedRole = role ? String(role).toLowerCase() : 'cashier';

        if (!normalizedName || !normalizedEmail || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        if (!isAllowedRole(normalizedRole)) {
            return res.status(400).json({ message: 'Invalid user role' });
        }

        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name: normalizedName,
            email: normalizedEmail,
            password,
            role: normalizedRole,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: error.message || 'Failed to create user' });
    }
};

// @desc    Update user status
// @route   PATCH /api/users/:id
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user id' });
        }

        const user = await User.findById(req.params.id);

        if (user) {
            user.isActive = req.body.isActive ?? user.isActive;
            if (req.body.role !== undefined) {
                const nextRole = String(req.body.role).toLowerCase();
                if (!isAllowedRole(nextRole)) {
                    return res.status(400).json({ message: 'Invalid user role' });
                }
                user.role = nextRole;
            }
            user.name = req.body.name?.trim() || user.name;

            if (req.body.email) {
                const normalizedEmail = req.body.email.toLowerCase().trim();
                if (normalizedEmail !== user.email) {
                    const emailExists = await User.findOne({ email: normalizedEmail });
                    if (emailExists) {
                        return res.status(400).json({ message: 'Email already exists' });
                    }
                    user.email = normalizedEmail;
                }
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            await user.save();
            res.json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: error.message || 'Failed to update user' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user id' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user?._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own admin account' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: error.message || 'Failed to delete user' });
    }
};
