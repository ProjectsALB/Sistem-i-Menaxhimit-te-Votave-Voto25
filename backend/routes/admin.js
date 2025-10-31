const express = require('express');
const { adminLogin, getAdminProfile } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', adminLogin);
router.get('/profile', protect, getAdminProfile);

module.exports = router;