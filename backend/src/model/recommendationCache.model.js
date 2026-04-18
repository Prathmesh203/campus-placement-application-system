const mongoose = require('mongoose');

const recommendationCacheSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive', required: true },
    matchScore: { type: Number, default: 0 },
    recommendation: { type: String },
    explanation: { type: String },
    missingSkills: { type: [String] },
    strengths: { type: [String] },
    expiresAt: { type: Date, default: () => Date.now() + 7*24*60*60*1000 } // 7 days TTL
}, { timestamps: true });

// Ensure unique cache per student/job pair
recommendationCacheSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

module.exports = mongoose.model('RecommendationCache', recommendationCacheSchema);
