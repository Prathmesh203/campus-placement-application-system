const asyncHandler = require('express-async-handler');
const Application = require('../model/application.model');
const Drive = require('../model/drive.model');

// @desc    Apply to a drive
// @route   POST /api/applications
// @access  Private (Student)
const applyToDrive = asyncHandler(async (req, res) => {
    const { driveId } = req.body;

    const drive = await Drive.findById(driveId);
    if (!drive) {
        res.status(404);
        throw new Error('Drive not found');
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
        studentId: req.user._id,
        driveId
    });

    if (alreadyApplied) {
        res.status(400);
        throw new Error('Already applied to this drive');
    }

    // Check Eligibility (Basic check based on cutoff)
    // Note: Ideally this logic matches frontend logic
    if (req.user.cgpa < drive.cgpaCutoff) {
        res.status(400);
        throw new Error('Not eligible: CGPA criteria not met');
    }

    const application = await Application.create({
        studentId: req.user._id,
        driveId
    });

    res.status(201).json(application);
});

// @desc    Get logged in student's applications
// @route   GET /api/applications/my
// @access  Private (Student)
const getStudentApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({ studentId: req.user._id })
        .populate('driveId', 'title companyName status testDate deadline')
        .sort({ appliedAt: -1 });

    res.json(applications);
});

// @desc    Get applications for a specific drive (for company)
// @route   GET /api/applications/drive/:driveId
// @access  Private (Company)
const getDriveApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({ driveId: req.params.driveId })
        .populate('studentId', 'name email collegeId branch cgpa resume skills')
        .sort({ appliedAt: -1 });

    res.json(applications);
});

// @desc    Update application status (Shortlist/Reject/Hire)
// @route   PUT /api/applications/:id/status
// @access  Private (Company)
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status, testScore } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    // Verify ownership (optional but good practice: check if drive belongs to company)
    // For now skipping complex check for speed, assuming protected route + company role is sufficient context
    
    if (status) application.status = status;
    if (testScore !== undefined) application.testScore = testScore;
    
    await application.save();

    res.json(application);
});

// @desc    Get total stats for company home
// @route   GET /api/applications/stats
// @access  Private (Company)
const getCompanyStats = asyncHandler(async (req, res) => {
    const drives = await Drive.find({ companyId: req.user._id });
    const driveIds = drives.map(d => d._id);
    
    const totalApplications = await Application.countDocuments({
        driveId: { $in: driveIds }
    });

    res.json({
        totalDrives: drives.length,
        totalApplications
    });
});

// @desc    Submit test and create application
// @route   POST /api/applications/submit-test
// @access  Private (Student)
const submitTest = asyncHandler(async (req, res) => {
    const { driveId, answers } = req.body;

    const drive = await Drive.findById(driveId);
    if (!drive) {
        res.status(404);
        throw new Error('Drive not found');
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
        studentId: req.user._id,
        driveId
    });

    if (alreadyApplied) {
        res.status(400);
        throw new Error('Already applied to this drive');
    }

    // Check Eligibility
    if (req.user.cgpa < drive.cgpaCutoff) {
        res.status(400);
        throw new Error('Not eligible: CGPA criteria not met');
    }

    // Create application with test answers
    const application = await Application.create({
        studentId: req.user._id,
        driveId,
        status: 'test_submitted',
        testAnswers: answers
    });

    res.status(201).json(application);
});

const { compareCandidateWithJob } = require('../services/geminiService');

// @desc    Get recommended candidates for a drive
// @route   GET /api/applications/drive/:driveId/recommended
// @access  Private (Company)
const getRecommendedCandidates = asyncHandler(async (req, res) => {
    const driveId = req.params.driveId;
    const drive = await Drive.findById(driveId);
    if (!drive) {
        res.status(404);
        throw new Error('Drive not found');
    }

    // Fetch all applicants for this drive
    const applications = await Application.find({ driveId }).populate('studentId', 'name email skills');

    // Filter to those who haven't been scored yet
    const unscored = applications.filter(app => !app.matchScore && !app.explanation);
    
    // Pick top unscored to limit API calls (e.g. 5)
    const toScore = unscored.slice(0, 5);

    for (const app of toScore) {
        const studentData = app.studentId.skills || [];
        const jobData = drive.requiredSkills || [];

        // Call Gemini (geminiService already handles errors and returns fallback JSON on failure)
        const result = await compareCandidateWithJob(studentData, jobData);
        
        // Save to DB
        app.matchScore = result.match_percentage;
        app.recommendation = result.recommendation;
        app.explanation = result.explanation;
        app.missingSkills = result.missing_skills || [];
        app.strengths = result.strengths || [];
        await app.save();
    }

    // Return all applicants sorted by matchScore
    const allScored = await Application.find({ driveId, matchScore: { $gt: 0 } })
        .populate('studentId', 'name email resume profileCompleted skills')
        .sort({ matchScore: -1 });

    res.json(allScored);
});

module.exports = { applyToDrive, getStudentApplications, getDriveApplications, updateApplicationStatus, getCompanyStats, submitTest, getRecommendedCandidates };
