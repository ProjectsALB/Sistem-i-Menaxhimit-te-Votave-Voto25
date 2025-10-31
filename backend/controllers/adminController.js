const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Login i administratorit
const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kontrollo nëse ka admin të krijuar, nëse jo krijo një default
    let admin = await Admin.findOne({ username });
    
    if (!admin) {
      // Krijo admin default nëse nuk ekziston
      admin = await Admin.create({
        username: 'admin',
        password: 'admin123',
        name: 'Administrator',
        email: 'admin@voto25.com'
      });
    }

    if (admin && (await admin.matchPassword(password))) {
      const token = jwt.sign(
        { id: admin._id },
        process.env.JWT_SECRET || 'voto25secret',
        { expiresIn: '30d' }
      );

      res.json({
        status: 'success',
        message: 'Login i suksesshëm',
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          name: admin.name,
          email: admin.email
        }
      });
    } else {
      res.status(401).json({
        status: 'error',
        message: 'Kredenciale të pavlefshme'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Gabim në server'
    });
  }
};

// Merr profilin e administratorit
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    res.json({
      status: 'success',
      data: admin
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Gabim në server'
    });
  }
};

module.exports = {
  adminLogin,
  getAdminProfile
};