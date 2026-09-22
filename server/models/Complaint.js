const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
    category: { type: String, required: true },
    dueInDays: {
        type: Number,
        required: true,
        enum: [1, 2, 3], // 1: within 1 day, 2: within 2 days, 3: more days
        default: 3
    },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // staff user
    resolutionNotes: { type: String },
    date: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    staffUpdates: [{
        photoUrl: String,
        remarks: String,
        updatedAt: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Complaint', complaintSchema);