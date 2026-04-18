const asyncHandler = require('express-async-handler');
const Drive = require('../model/drive.model');
const Application = require('../model/application.model');

// @desc    Create a new drive
// @route   POST /api/drives
// @access  Private (Company)
const createDrive = asyncHandler(async (req, res) => {
    const { title, description, batchYear, cgpaCutoff, requiredSkills, salary, deadline, testDate, questions } = req.body;

    if (!title || !description || !batchYear || !cgpaCutoff || !salary || !deadline) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    const drive = await Drive.create({
        companyId: req.user._id,
        companyName: req.user.name,
        title,
        description,
        batchYear,
        cgpaCutoff,
        requiredSkills: requiredSkills ? (typeof requiredSkills === 'string' ? JSON.parse(requiredSkills) : requiredSkills) : [],
        salary,
        deadline,
        testDate,
        questions: questions || []
    });

    res.status(201).json(drive);
});

// @desc    Get drive test details (questions)
// @route   GET /api/drives/:id/test
// @access  Private (Student)
const getDriveTest = asyncHandler(async (req, res) => {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
        res.status(404);
        throw new Error('Drive not found');
    }

    // Check if student is eligible (Basic check)
    // In production, we should check if student already applied or other criteria
    
    // We only return necessary fields for taking the test
    res.json({
        _id: drive._id,
        title: drive.title,
        questions: drive.questions,
        duration: drive.duration // If we had duration
    });
});

// @desc    Get all active drives (for students)
// @route   GET /api/drives
// @access  Private (Student)
const getDrives = asyncHandler(async (req, res) => {
    // Filter by active status and deadline > now
    const drives = await Drive.find({ 
        status: 'active',
        deadline: { $gte: new Date() } 
    }).sort({ createdAt: -1 });

    res.json(drives);
});

// @desc    Get drives for logged in company
// @route   GET /api/drives/company
// @access  Private (Company)
const getCompanyDrives = asyncHandler(async (req, res) => {
    const drives = await Drive.find({ companyId: req.user._id }).sort({ createdAt: -1 });
    
    // Enrich with applicant count
    const enrichedDrives = await Promise.all(drives.map(async (drive) => {
        const applicantCount = await Application.countDocuments({ driveId: drive._id });
        return { ...drive.toObject(), applicantCount };
    }));

    res.json(enrichedDrives);
});

module.exports = { createDrive, getDrives, getCompanyDrives, getDriveTest };
