

const jwt = require('jsonwebtoken');
const secretKey = 'Turkey';
const usersModel = require('../models/usersmodel');

// Middleware code
const CheckAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 401, message: 'No or invalid token provided' });
    }

    const token = authHeader.split(' ')[1];
    const verifyToken = jwt.verify(token, secretKey);
    const user = await usersModel.findOne({ _id: verifyToken.userId });
    // 
    req.token = token;
    req.user = user;
    req.userId = user._id;
    req.username = user.username;
    req.email = user.email; // Add this line to include email
    req.permissions = user.permissions;

    req.userInformation = {
      userId: user.id,
      username: user.username,
      email: user.email,
      permissions: user.permissions,
    };
    // 
    console.log(req.userInformation);


    // Rest of your code remains unchanged
  } catch (error) {
    console.error(error);
    res.status(401).json({ status: 401, message: 'Invalid user token' });
  }
};

module.exports = {
  CheckAuth
};
