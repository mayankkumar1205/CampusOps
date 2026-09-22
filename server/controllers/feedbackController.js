const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

// Submit feedback (after complaint resolved)
const submitFeedback = async (req, res) => {
    try {
        const { complaintId, rating, comment } = req.body;
        // Find complaint and ensure it's resolved
        const complaint = await Complaint.findById(complaintId);
        if (!complaint || complaint.status !== 'resolved') {
            return res.status(400).json({ message: 'Feedback can only be submitted for resolved complaints.' });
        }
        // Only allow feedback if user is the complaint owner
        if (complaint.raisedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to submit feedback for this complaint.' });
        }
        // Prevent duplicate feedback
        const existing = await Feedback.findOne({ complaintId, userId: req.user.id });
        if (existing) {
            return res.status(400).json({ message: 'Feedback already submitted for this complaint.' });
        }
        const feedback = new Feedback({
            complaintId,
            userId: req.user.id,
            staffId: complaint.assignedTo,
            rating,
            comment
        });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted', feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all feedbacks (public)
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('userId', 'name email')
            .populate('staffId', 'name email')
            .populate('complaintId', 'title');
        res.json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { submitFeedback, getAllFeedbacks }; 