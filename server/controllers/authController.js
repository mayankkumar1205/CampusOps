// filepath: smart-campus-complaint-system/server/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
    const { email, password, role, name, department } = req.body;

    try {
        // Validate required fields
        if (!email || !password || !role || !name || !department) {
            return res.status(400).json({ 
                message: 'All fields are required: email, password, role, name, department' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Validate role
        if (!['student', 'staff'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be student or staff' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email: email.trim(),
            password: hashedPassword,
            role,
            name: name.trim(),
            department: department.trim()
        });

        await newUser.save();
        console.log('User registered successfully:', { email, role, name, department });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login a user
const login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        if (role === 'admin') {
            // Only allow the admin from .env
            if (
                email === process.env.ADMIN_EMAIL &&
                password === process.env.ADMIN_PASSWORD
            ) {
                // You can generate a token for admin (no DB lookup needed)
                const token = jwt.sign(
                    { id: 'admin', email, role: 'admin', name: 'Admin' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                return res.status(200).json({
                    token,
                    user: { id: 'admin', email, role: 'admin', name: 'Admin' }
                });
            } else {
                return res.status(400).json({ message: 'Invalid admin credentials' });
            }
        }

        // For non-admin users, proceed as usual
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user statistics (public)
const getUserStats = async (req, res) => {
    try {
        console.log('getUserStats called');
        
        const totalUsers = await User.countDocuments();
        console.log('Total users:', totalUsers);
        
        const studentCount = await User.countDocuments({ role: 'student' });
        console.log('Student count:', studentCount);
        
        const staffCount = await User.countDocuments({ role: 'staff' });
        console.log('Staff count:', staffCount);
        
        const stats = {
            total: totalUsers,
            students: studentCount,
            staff: staffCount
        };
        
        console.log('Returning user stats:', stats);
        res.json(stats);
    } catch (error) {
        console.error('Error in getUserStats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login, getUserStats };