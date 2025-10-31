const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'voto25secret');
      req.admin = await Admin.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        status: 'error',
        message: 'Jo i autorizuar, token dështoi'
      });
    }
  }

  if (!token) {
    res.status(401).json({
      status: 'error',
      message: 'Jo i autorizuar, pa token'
    });
  }
};

module.exports = { protect };