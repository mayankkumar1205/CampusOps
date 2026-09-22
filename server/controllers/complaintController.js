const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { sendResolutionEmail } = require('../utils/mailer');
const nodemailer = require('nodemailer');

// Create a new complaint
const createComplaint = async (req, res) => {
    try {
        const { title, description, category, dueInDays } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const complaint = new Complaint({
            title,
            description,
            category,
            dueInDays,
            imageUrl,
            raisedBy: req.user.id
        });
        await complaint.save();
        // No email to admins
        res.status(201).json({ message: 'Complaint submitted successfully', complaint });
    } catch (error) {
        console.error(error); // This will print the real error in your backend terminal
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all complaints for the logged-in user
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ raisedBy: req.user.id }).sort({ date: -1 });
        res.json(complaints);
    } catch (error) {
        console.error(error); // This will print the real error in your backend terminal
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single complaint details
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        res.json(complaint);
    } catch (error) {
        console.error(error); // This will print the real error in your backend terminal
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get all complaints split by status and sorted
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('raisedBy', 'email name')
            .populate('assignedTo', 'email name department')
            .sort({ date: -1 });
        // Split and sort
        const pending = complaints.filter(c => c.status === 'pending').sort((a, b) => a.dueInDays - b.dueInDays);
        const inProgress = complaints.filter(c => c.status === 'in-progress').sort((a, b) => a.dueInDays - b.dueInDays);
        const resolved = complaints.filter(c => c.status === 'resolved');
        res.json({ pending, inProgress, resolved });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Assign complaint to staff
const assignComplaint = async (req, res) => {
    try {
        const { staffId } = req.body;
        
        // Validate staffId is provided
        if (!staffId) {
            return res.status(400).json({ message: 'Staff ID is required.' });
        }
        
        // Check if staff exists and is actually a staff member
        const staff = await User.findOne({ _id: staffId, role: 'staff' });
        if (!staff) {
            return res.status(400).json({ message: 'Invalid staff member selected.' });
        }
        
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { assignedTo: staffId, status: 'in-progress', updatedAt: Date.now() },
            { new: true }
        );
        
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }
        
        // Send email to staff notifying assignment
        try {
            await sendResolutionEmail(
                staff.email,
                'New Complaint Assigned to You',
                `Hello ${staff.name || staff.email},\n\nA new complaint titled "${complaint.title || 'Complaint'}" has been assigned to you.\n\nPlease check the system for details.\n\nThank you.`
            );
            console.log(`Assignment email sent to staff: ${staff.email}`);
        } catch (mailError) {
            console.error('Error sending assignment email to staff:', mailError);
            // Optionally, do not fail the request if email fails
        }
        
        console.log(`Complaint ${complaint._id} assigned to staff ${staff.name || staff.email}`);
        res.json(complaint);
    } catch (error) {
        console.error('Error in assignComplaint:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Update complaint status and notes
const updateComplaintStatus = async (req, res) => {
    const { status, resolutionNotes } = req.body;

    try {
        const complaint = await Complaint.findById(req.params.id).populate('raisedBy');
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Only send email if status is being set to "resolved" and raisedBy exists
        if (status === 'resolved' && complaint.raisedBy && complaint.raisedBy.email) {
            try {
                await sendResolutionEmail(complaint.raisedBy.email, 'Your complaint has been resolved', `Hello ${complaint.raisedBy.name},\n\nYour complaint titled "${complaint.title}" has been resolved.\n\nThank you.`);
                console.log(`Resolution email sent to ${complaint.raisedBy.email}`);
            } catch (mailError) {
                console.error('Error sending resolution email:', mailError);
                // Optionally, don't fail the whole request if email fails
            }
        }

        complaint.status = status;
        complaint.resolutionNotes = resolutionNotes;
        complaint.updatedAt = Date.now();
        await complaint.save();

        res.json({ message: 'Complaint status updated successfully.' });
    } catch (error) {
        console.error('Error in updateComplaintStatus:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Staff: Get complaints assigned to the logged-in staff
const getAssignedComplaints = async (req, res) => {
    try {
        console.log('Staff assigned complaints request:', req.user);
        // Ensure req.user.id is a valid ObjectId
        const staffId = req.user.id || req.user._id;
        if (!staffId) {
            console.error('No staff id found in token:', req.user);
            return res.status(400).json({ message: 'Invalid staff user.' });
        }
        const complaints = await Complaint.find({ assignedTo: staffId }).sort({ date: -1 });
        res.json(complaints);
    } catch (error) {
        console.error('Error in getAssignedComplaints:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Staff: Submit update for a complaint (with photo and remarks)
const staffUpdateComplaint = async (req, res) => {
    try {
        const { remarks } = req.body;
        const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        complaint.staffUpdates.push({ photoUrl, remarks, updatedAt: new Date() });
        complaint.updatedAt = new Date();
        await complaint.save();
        // No email to admins
        res.json({ message: 'Update submitted', complaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get complaint statistics (public)
const getComplaintStats = async (req, res) => {
    try {
        console.log('getComplaintStats called');
        
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
};

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.sendMail({
    from: 'YOUR_EMAIL@gmail.com',
    to: 'YOUR_EMAIL@gmail.com',
    subject: 'Test Email',
    text: 'This is a test'
}, (err, info) => {
    if (err) {
        return console.error('Error:', err);
    }
    console.log('Sent:', info.response);
});

module.exports = {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    assignComplaint,
    updateComplaintStatus,
    getAssignedComplaints,
    staffUpdateComplaint,
    getComplaintStats
};