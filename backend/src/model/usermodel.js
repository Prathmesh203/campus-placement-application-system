const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
     name: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     role: { type: String, enum: ['student', 'company', 'admin'], default: 'student' },
     
     // Student Specific Fields
     collegeId: { type: String },
     branch: { type: String },
     graduationYear: { type: Number },
     cgpa: { type: Number },
     skills: [{
          name: { type: String, required: true },
          level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' }
     }],
     resume: { type: String }, // URL or path
     profileCompleted: { type: Boolean, default: false },

     // Company Specific Fields
     companyDetails: {
          registrationNumber: String,
          industryType: String,
          companySize: String,
          websiteUrl: String,
          description: String,
          contactPerson: String
     }
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
     try {
          return jwt.sign(
               { _id: this._id, role: this.role },
               "Prathmesh@123",
               { expiresIn: '7d' }
          );
     } catch (error) {
          return "failed to generate jwt"
     }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
