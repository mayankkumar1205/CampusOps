const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaint');
const feedbackRoutes = require('./routes/feedback');
const statsRoutes = require('./routes/stats');

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim());

const checkOrigin = (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
    }

    return callback(null, false);
};

// HTTP middleware
app.use(cors({ origin: checkOrigin }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Socket.IO shares the Express HTTP server
const io = new Server(httpServer, {
    cors: {
        origin: checkOrigin,
        methods: ['GET', 'POST']
    }
});

// Authenticate each socket with the user's existing JWT
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        return next(new Error('Authentication required.'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const allowedRoles = ['student', 'staff', 'admin'];

        if (!decoded.id || !allowedRoles.includes(decoded.role)) {
            return next(new Error('Invalid authentication token.'));
        }

        socket.data.user = {
            id: String(decoded.id),
            role: decoded.role
        };

        next();
    } catch (error) {
        next(new Error('Invalid authentication token.'));
    }
});

// Rooms are assigned by the server, never selected by the client
io.on('connection', (socket) => {
    const { id, role } = socket.data.user;

    if (role === 'admin') {
        socket.join('admins');
    } else {
        socket.join(`user:${id}`);
    }

    console.log(`Socket connected (${role})`);

    socket.on('disconnect', () => {
        console.log(`Socket disconnected (${role})`);
    });
});

// Controllers can access Socket.IO with req.app.get('io')
app.set('io', io);

// Database connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected'))
    .catch((error) =>
        console.error('MongoDB connection error:', error)
    );

// Routes
console.log('Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Server is working!',
        timestamp: new Date().toISOString()
    });
});

// Start Express and Socket.IO together
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- GET /api/test');
    console.log('- GET /api/stats/complaints');
    console.log('- GET /api/stats/users');
    console.log('- GET /api/auth/stats');
    console.log('- GET /api/complaints/stats');
});