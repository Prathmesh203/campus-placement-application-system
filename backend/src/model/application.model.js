const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive', required: true },
    status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'test_submitted', 'interview', 'selected'], default: 'applied' },
    testAnswers: [{
        questionId: String,
        question: String,
        answer: String,
        marksObtained: { type: Number, default: 0 } // For manual grading
    }],
    testScore: { type: Number, default: 0 },
    matchScore: { type: Number, default: 0 },
    recommendation: { type: String, enum: ['High Fit', 'Medium Fit', 'Low Fit'] },
    explanation: { type: String },
    missingSkills: { type: [String] },
    strengths: { type: [String] },
    appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
