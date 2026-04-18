const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../model/usermodel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, "Prathmesh@123");

      if (decoded._id === '000000000000000000000000') {
        req.user = {
          _id: '000000000000000000000000',
          name: 'System Administrator',
          email: 'admin@skillgate.com',
          role: 'admin',
          status: 'approved'
        };
      } else {
        req.user = await User.findById(decoded._id).select('-password');
      }
      next();
    } catch (error) {
      res.status(401).json({message:"failed to verify token"});
      
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };