const express = require('express');
const router = express.Router();
const { applyToDrive, getStudentApplications, getDriveApplications, updateApplicationStatus, getCompanyStats, submitTest, getRecommendedCandidates } = require('../controllers/application.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, applyToDrive);
router.post('/submit-test', protect, submitTest); // New route
router.get('/my', protect, getStudentApplications);
router.get('/drive/:driveId', protect, getDriveApplications);
router.get('/drive/:driveId/recommended', protect, getRecommendedCandidates); // Gemini Recommendation route
router.put('/:id/status', protect, updateApplicationStatus); // New route
router.get('/stats', protect, getCompanyStats);

module.exports = router;
