const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');

// Get complaint statistics (public)
router.get('/complaints', async (req, res) => {
    try {
        console.log('getComplaintStats called from separate route');
        
        const totalComplaints = await Complaint.countDocuments();
        console.log('Total complaints:', totalComplaints);
        
        const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
        console.log('Resolved complaints:', resolvedComplaints);
        
        // Calculate average response time (time from submission to first staff update)
        const resolvedComplaintsWithUpdates = await Complaint.find({ 
            status: 'resolved',
            'staffUpdates.0': { $exists: true }
        });
        
        let totalResponseTime = 0;
        let countWithResponseTime = 0;
        
        resolvedComplaintsWithUpdates.forEach(complaint => {
            if (complaint.staffUpdates && complaint.staffUpdates.length > 0) {
                const firstUpdate = complaint.staffUpdates[0];
                const responseTime = firstUpdate.updatedAt - complaint.date;
                totalResponseTime += responseTime;
                countWithResponseTime++;
            }
        });
        
        const avgResponseTime = countWithResponseTime > 0 
            ? Math.round(totalResponseTime / countWithResponseTime / (1000 * 60 * 60)) // Convert to hours
            : 24; // Default 24 hours if no data
        
        const stats = {
            total: totalComplaints,
            resolved: resolvedComplaints,
            avgResponseTime: avgResponseTime
        };
        
        console.log('Returning stats:', stats);
        res.json(stats);
    } catch (error) {
        console.error('Error in getComplaintStats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user statistics (public)
router.get('/users', async (req, res) => {
    try {
        console.log('getUserStats called from separate route');
        
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
});

module.exports = router; 