const express = require('express');
const {
    register,
    createStaff,
    login,
    getUserStats
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const User = require('../models/User');

const router = express.Router();

// Public routes
router.get('/stats', getUserStats);
router.post('/register', register);
router.post('/login', login);

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin-only staff account creation
router.post('/staff', authMiddleware, isAdmin, createStaff);

// Get staff list for the admin assignment dropdown
router.get('/staff', authMiddleware, isAdmin, async (req, res) => {
    try {
        const staff = await User.find({ role: 'staff' })
            .select('_id name email department');

        res.json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'Error fetching staff list' });
    }
});

module.exports = router;