const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { sendResolutionEmail } = require('../utils/mailer');
const { emitComplaintEvent } = require('../utils/complaintEvents');

const getDeadlineTimestamp = (complaint) => {
    if (complaint.dueDate) {
        return new Date(complaint.dueDate).getTime();
    }

    const submittedAt = new Date(complaint.date).getTime();
    const days = Number(complaint.dueInDays || 3);

    return submittedAt + days * 24 * 60 * 60 * 1000;
};

// Create a new complaint
const createComplaint = async (req, res) => {
    try {
        const { title, description, category, dueInDays } = req.body;
        const days = Number(dueInDays);

        if (![1, 2, 3].includes(days)) {
            return res.status(400).json({
                message: 'Choose a deadline of 1, 2, or 3 days.'
            });
        }

        const submittedAt = new Date();
        const dueDate = new Date(submittedAt);
        dueDate.setDate(dueDate.getDate() + days);

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const complaint = new Complaint({
            title,
            description,
            category,
            dueInDays: days,
            dueDate,
            date: submittedAt,
            imageUrl,
            statusHistory: [
                {
                    status: 'pending',
                    changedBy: req.user.id,
                    note: 'Complaint submitted',
                    changedAt: submittedAt
                }
            ],
            raisedBy: req.user.id
        });

        await complaint.save();

        emitComplaintEvent(
            req.app.get('io'),
            complaint,
            'complaint:created'
        );

        res.status(201).json({
            message: 'Complaint submitted successfully',
            complaint
        });
    } catch (error) {
        console.error('Error in createComplaint:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all complaints for the logged-in user
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ raisedBy: req.user.id })
            .sort({ date: -1 });

        res.json(complaints);
    } catch (error) {
        console.error('Error in getMyComplaints:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single complaint details
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const isAdmin = req.user.role === 'admin';
        const isOwner = String(complaint.raisedBy) === String(req.user.id);
        const isAssignedStaff =
            req.user.role === 'staff' &&
            String(complaint.assignedTo) === String(req.user.id);

        if (!isAdmin && !isOwner && !isAssignedStaff) {
            return res.status(403).json({
                message: 'You are not allowed to view this complaint.'
            });
        }

        res.json(complaint);
    } catch (error) {
        console.error('Error in getComplaintById:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get complaints split by status and sorted by deadline
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('raisedBy', 'email name')
            .populate('assignedTo', 'email name department')
            .sort({ date: -1 });

        const pending = complaints
            .filter((complaint) => complaint.status === 'pending')
            .sort(
                (a, b) =>
                    getDeadlineTimestamp(a) - getDeadlineTimestamp(b)
            );

        const inProgress = complaints
            .filter((complaint) => complaint.status === 'in-progress')
            .sort(
                (a, b) =>
                    getDeadlineTimestamp(a) - getDeadlineTimestamp(b)
            );

        const resolved = complaints.filter(
            (complaint) => complaint.status === 'resolved'
        );

        res.json({ pending, inProgress, resolved });
    } catch (error) {
        console.error('Error in getAllComplaints:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Assign complaint to staff
const assignComplaint = async (req, res) => {
    try {
        const { staffId } = req.body;

        if (!staffId) {
            return res.status(400).json({ message: 'Staff ID is required.' });
        }

        const staff = await User.findOne({ _id: staffId, role: 'staff' });

        if (!staff) {
            return res.status(400).json({
                message: 'Invalid staff member selected.'
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }

        const previousStatus = complaint.status;
        const previousStaffId = complaint.assignedTo
            ? String(complaint.assignedTo)
            : '';
        const assignmentChanged =
            previousStaffId !== String(staff._id);
        const statusChanged = previousStatus !== 'in-progress';
        const changedAt = new Date();

        complaint.assignedTo = staff._id;
        complaint.status = 'in-progress';
        complaint.updatedAt = changedAt;

        if (assignmentChanged || statusChanged) {
            const note = assignmentChanged
                ? `Assigned to ${staff.name || staff.email} by admin`
                : `Admin changed status from ${previousStatus} to in-progress`;

            complaint.statusHistory.push({
                status: 'in-progress',
                changedBy: null,
                note,
                changedAt
            });
        }

        await complaint.save();

        emitComplaintEvent(req.app.get('io'), complaint);

        if (assignmentChanged || statusChanged) {
            try {
                await sendResolutionEmail(
                    staff.email,
                    'New Complaint Assigned to You',
                    `Hello ${staff.name || staff.email},

A new complaint titled "${complaint.title || 'Complaint'}" has been assigned to you.

Please check the system for details.

Thank you.`
                );
            } catch (mailError) {
                console.error(
                    'Assignment email failed:',
                    mailError.code || 'unknown error'
                );
            }
        }

        res.json(complaint);
    } catch (error) {
        console.error('Error in assignComplaint:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Update complaint status and notes
const updateComplaintStatus = async (req, res) => {
    const { status, resolutionNotes } = req.body;
    const allowedStatuses = ['pending', 'in-progress', 'resolved'];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Invalid complaint status.'
        });
    }

    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('raisedBy');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const previousStatus = complaint.status;
        const statusChanged = previousStatus !== status;
        const changedAt = new Date();

        complaint.status = status;

        if (resolutionNotes !== undefined) {
            complaint.resolutionNotes = resolutionNotes;
        }

        complaint.updatedAt = changedAt;

        if (statusChanged) {
            const transitionNote =
                `Admin changed status from ${previousStatus} to ${status}.`;
            const extraNote = resolutionNotes?.trim();

            complaint.statusHistory.push({
                status,
                changedBy: null,
                note: extraNote
                    ? `${transitionNote} ${extraNote}`
                    : transitionNote,
                changedAt
            });
        }

        await complaint.save();

        emitComplaintEvent(req.app.get('io'), complaint);

        if (
            statusChanged &&
            status === 'resolved' &&
            complaint.raisedBy?.email
        ) {
            try {
                await sendResolutionEmail(
                    complaint.raisedBy.email,
                    'Your complaint has been resolved',
                    `Hello ${complaint.raisedBy.name},

Your complaint titled "${complaint.title}" has been resolved.

Thank you.`
                );
            } catch (mailError) {
                console.error(
                    'Resolution email failed:',
                    mailError.code || 'unknown error'
                );
            }
        }

        res.json({
            message: 'Complaint status updated successfully.'
        });
    } catch (error) {
        console.error('Error in updateComplaintStatus:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Staff: Get complaints assigned to the logged-in staff
const getAssignedComplaints = async (req, res) => {
    try {
        const staffId = req.user.id || req.user._id;

        if (!staffId) {
            return res.status(400).json({ message: 'Invalid staff user.' });
        }

        const complaints = await Complaint.find({ assignedTo: staffId })
            .sort({ date: -1 });

        res.json(complaints);
    } catch (error) {
        console.error('Error in getAssignedComplaints:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Staff: Submit update for a complaint, with photo and remarks
const staffUpdateComplaint = async (req, res) => {
    try {
        const { remarks } = req.body;
        const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const complaint = req.complaint;

        complaint.staffUpdates.push({
            photoUrl,
            remarks,
            updatedAt: new Date()
        });
        complaint.updatedAt = new Date();

        await complaint.save();

        emitComplaintEvent(req.app.get('io'), complaint);

        res.json({ message: 'Update submitted', complaint });
    } catch (error) {
        console.error('Error in staffUpdateComplaint:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get complaint statistics
const getComplaintStats = async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        const resolvedComplaints = await Complaint.countDocuments({
            status: 'resolved'
        });

        const resolvedComplaintsWithUpdates = await Complaint.find({
            status: 'resolved',
            'staffUpdates.0': { $exists: true }
        });

        let totalResponseTime = 0;
        let countWithResponseTime = 0;

        resolvedComplaintsWithUpdates.forEach((complaint) => {
            if (complaint.staffUpdates?.length > 0) {
                const firstUpdate = complaint.staffUpdates[0];
                const responseTime =
                    firstUpdate.updatedAt - complaint.date;

                totalResponseTime += responseTime;
                countWithResponseTime++;
            }
        });

        const avgResponseTime =
            countWithResponseTime > 0
                ? Math.round(
                      totalResponseTime /
                          countWithResponseTime /
                          (1000 * 60 * 60)
                  )
                : 24;

        res.json({
            total: totalComplaints,
            resolved: resolvedComplaints,
            avgResponseTime
        });
    } catch (error) {
        console.error('Error in getComplaintStats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

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