const express = require('express');
const router = express.Router();
const { getRecommendedJobs } = require('../controllers/student.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/recommended-jobs', protect, getRecommendedJobs);

module.exports = router;
