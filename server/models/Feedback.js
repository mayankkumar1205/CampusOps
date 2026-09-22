const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema); 