const mongoose = require('mongoose');

const driveSchema = mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    batchYear: { type: Number, required: true },
    cgpaCutoff: { type: Number, required: true },
    requiredSkills: [{
        name: { type: String, required: true },
        level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' }
    }], // Required skills tags
    salary: { type: String, required: true },
    deadline: { type: Date, required: true },
    testDate: { type: Date },
    questions: [{
        question: { type: String, required: true },
        options: [String], // Optional for MCQ
        type: { type: String, enum: ['text', 'mcq'], default: 'text' },
        marks: { type: Number, default: 10 }
    }],
    status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, { timestamps: true });

const Drive = mongoose.model('Drive', driveSchema);
module.exports = Drive;
