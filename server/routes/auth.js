const express = require('express');
const { register, login, getUserStats } = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const isAdmin = require('../middleware/isAdmin');
const jwt = require('jsonwebtoken');

// Public routes
router.get('/stats', getUserStats);

// Register route
router.post('/register', register);

// Login route
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
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all staff users (for admin assign dropdown)
router.get('/staff', authMiddleware, isAdmin, async (req, res) => {
    try {
        const staff = await User.find({ role: 'staff' }).select('_id name email department');
        console.log('Staff found:', staff.length, 'staff members');
        res.json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'Error fetching staff list' });
    }
});

module.exports = router;