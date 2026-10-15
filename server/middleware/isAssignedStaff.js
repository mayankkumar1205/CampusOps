const Complaint = require('../models/Complaint');

const isAssignedStaff = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (String(complaint.assignedTo) !== String(req.user.id)) {
            return res.status(403).json({
                message: 'You can only update complaints assigned to you.'
            });
        }

        req.complaint = complaint;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = isAssignedStaff;