const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { submitFeedback, getAllFeedbacks } = require('../controllers/feedbackController');

// Submit feedback (user, after complaint resolved)
router.post('/', authMiddleware, submitFeedback);
// Get all feedbacks (public)
router.get('/', getAllFeedbacks);

module.exports = router; 