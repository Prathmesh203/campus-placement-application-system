const asyncHandler = require('express-async-handler');
const User = require('../model/usermodel');

const registerUser = asyncHandler(async (req, res) => {
     const { name, email, password, role } = req.body;
     // console.log(req.body);

     if (!name || !email || !password) {
          res.status(400).json({ message: "Please fill all fields" });
     }

     const userExists = await User.findOne({ email });
     if (userExists) {
          res.status(400).json({ message: "User already exists" });
     }

     const user = await User.create({
          name,
          email,
          password, // Stored as plain text
          role: role || 'student'
     });

     if (user) {
          res.status(201).json({
               _id: user._id,
               name: user.name,
               email: user.email,
               role: user.role,
               token: user.generateAuthToken()
          });
     } else {
          res.status(400).json({ message: "Invalid User Data" });
     }
});


const loginUser = asyncHandler(async (req, res) => {
     const { email, password } = req.body;

     // Hardcoded Admin Check
     if (email === 'admin@skillgate.com' && password === 'admin123') {
          // Create a temporary admin user instance to generate token
          const adminUser = new User({
               _id: '000000000000000000000000', // Mock Object ID
               name: 'System Administrator',
               email: 'admin@skillgate.com',
               role: 'admin',
               status: 'approved'
          });

          res.json({
               _id: adminUser._id,
               name: adminUser.name,
               email: adminUser.email,
               role: adminUser.role,
               status: adminUser.status,
               token: adminUser.generateAuthToken()
          });
          return;
     }

     const user = await User.findOne({ email });

     // Compare plain text password directly
     if (user && user.password === password) {
          res.json({
               _id: user._id,
               name: user.name,
               email: user.email,
               role: user.role,
               status: user.status,
               token: user.generateAuthToken()
          });
     } else {
          res.status(400).json({ message: "Invalid Email or password" });
     }
});


const getUserProfile = asyncHandler(async (req, res) => {
     if (req.user._id === '000000000000000000000000') {
          return res.json(req.user);
     }
     const user = await User.findById(req.user._id).select('-password');
     if(!user){
              res.status(400).json({message:"User not found."});
     }
     res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        
        if (req.body.password) {
            user.password = req.body.password;
        }

        // Student Updates
        if (user.role === 'student') {
            user.collegeId = req.body.collegeId || user.collegeId;
            user.branch = req.body.branch || user.branch;
            user.graduationYear = req.body.graduationYear || user.graduationYear;
            user.cgpa = req.body.cgpa || user.cgpa;
            user.skills = req.body.skills ? (typeof req.body.skills === 'string' ? JSON.parse(req.body.skills) : req.body.skills) : user.skills;
            user.resume = req.body.resume || user.resume;
            user.profileCompleted = true; // Mark complete on update
        }

        // Company Updates
        if (user.role === 'company') {
             user.companyDetails = {
                  ...user.companyDetails,
                  ...req.body.companyDetails
             };
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status,
            token: updatedUser.generateAuthToken(),
            // Return full object
            ...updatedUser.toObject()
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
