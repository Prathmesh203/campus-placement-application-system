const asyncHandler = require('express-async-handler');
const Drive = require('../model/drive.model');
const RecommendationCache = require('../model/recommendationCache.model');
const { compareCandidateWithJob } = require('../services/geminiService');

// @desc    Get recommended jobs for student
// @route   GET /api/student/recommended-jobs
// @access  Private (Student)
const getRecommendedJobs = asyncHandler(async (req, res) => {
    // Basic filter: active drives, deadline > now
    const drives = await Drive.find({ 
        status: 'active',
        deadline: { $gte: new Date() } 
    }).sort({ createdAt: -1 });

    const studentSkills = req.user.skills || [];

    // Only process a limited number of recommendations at a time (e.g. top 10 most recent)
    const limitedDrives = drives.slice(0, 10);

    const recommendedJobs = [];

    for (const drive of limitedDrives) {
        // Check cache
        let cache = await RecommendationCache.findOne({
            studentId: req.user._id,
            driveId: drive._id
        });

        if (!cache) {
            // Call Gemini
            const jobData = drive.requiredSkills || [];
            const result = await compareCandidateWithJob(studentSkills, jobData);
            
            // Create Cache
            cache = await RecommendationCache.create({
                studentId: req.user._id,
                driveId: drive._id,
                matchScore: result.match_percentage,
                recommendation: result.recommendation,
                explanation: result.explanation,
                missingSkills: result.missing_skills || [],
                strengths: result.strengths || []
            });
        }

        recommendedJobs.push({
            drive, // Populate full drive info
            matchScore: cache.matchScore,
            recommendation: cache.recommendation,
            explanation: cache.explanation,
            missingSkills: cache.missingSkills,
            strengths: cache.strengths
        });
    }

    // Sort by match score
    recommendedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json(recommendedJobs);
});

module.exports = { getRecommendedJobs };
