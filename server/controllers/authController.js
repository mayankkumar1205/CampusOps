const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateAccountDetails = (email, password, name, department) => {
    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        typeof name !== 'string' ||
        typeof department !== 'string' ||
        !email.trim() ||
        !password ||
        !name.trim() ||
        !department.trim()
    ) {
        return 'Email, password, name, and department are required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        return 'Please enter a valid email address.';
    }

    if (password.length < 6) {
        return 'Password must be at least 6 characters long.';
    }

    return null;
};

const createAccount = async ({ email, password, role, name, department }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
        return null;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        email: normalizedEmail,
        password: hashedPassword,
        role,
        name: name.trim(),
        department: department.trim()
    });

    await user.save();
    return user;
};

// Public registration: students only
const register = async (req, res) => {
    const { email, password, role, name, department } = req.body;

    if (role !== 'student') {
        return res.status(403).json({
            message: 'Staff accounts can only be created by an admin.'
        });
    }

    const validationError = validateAccountDetails(
        email,
        password,
        name,
        department
    );

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const user = await createAccount({
            email,
            password,
            role: 'student',
            name,
            department
        });

        if (!user) {
            return res.status(409).json({
                message: 'A user with this email already exists.'
            });
        }

        res.status(201).json({ message: 'Student account created.' });
    } catch (error) {
        console.error('Student registration error:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'A user with this email already exists.'
            });
        }

        res.status(500).json({
            message: 'Server error during registration.'
        });
    }
};

// Admin-only handler: create a staff account
const createStaff = async (req, res) => {
    const { email, password, name, department } = req.body;

    const validationError = validateAccountDetails(
        email,
        password,
        name,
        department
    );

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const user = await createAccount({
            email,
            password,
            role: 'staff',
            name,
            department
        });

        if (!user) {
            return res.status(409).json({
                message: 'A user with this email already exists.'
            });
        }

        res.status(201).json({
            message: 'Staff account created.',
            staff: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department
            }
        });
    } catch (error) {
        console.error('Staff account creation error:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'A user with this email already exists.'
            });
        }

        res.status(500).json({
            message: 'Server error while creating staff account.'
        });
    }
};

// Login a user
const login = async (req, res) => {
    const { email, password, role } = req.body;
    const normalizedEmail =
        typeof email === 'string' ? email.trim().toLowerCase() : '';

    try {
        if (role === 'admin') {
            const configuredAdminEmail =
                process.env.ADMIN_EMAIL?.trim().toLowerCase();
            const configuredAdminPassword = process.env.ADMIN_PASSWORD;

            if (
                configuredAdminEmail &&
                configuredAdminPassword &&
                normalizedEmail === configuredAdminEmail &&
                password === configuredAdminPassword
            ) {
                const token = jwt.sign(
                    {
                        id: 'admin',
                        email: configuredAdminEmail,
                        role: 'admin',
                        name: 'Admin'
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                return res.status(200).json({
                    token,
                    user: {
                        id: 'admin',
                        email: configuredAdminEmail,
                        role: 'admin',
                        name: 'Admin'
                    }
                });
            }

            return res.status(400).json({
                message: 'Invalid admin credentials.'
            });
        }

        if (!['student', 'staff'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        const user = await User.findOne({
            email: normalizedEmail,
            role
        });

        if (!user) {
            return res.status(400).json({ message: 'Email not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password.' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// Get user statistics
const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const studentCount = await User.countDocuments({ role: 'student' });
        const staffCount = await User.countDocuments({ role: 'staff' });

        res.json({
            total: totalUsers,
            students: studentCount,
            staff: staffCount
        });
    } catch (error) {
        console.error('Error in getUserStats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    register,
    createStaff,
    login,
    getUserStats
};