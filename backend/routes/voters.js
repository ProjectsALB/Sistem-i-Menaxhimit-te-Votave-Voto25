const express = require('express');
const { 
  voterLogin, 
  registerVoter, 
  getAllVoters, 
  castVote 
} = require('../controllers/voterController');
const { protect } = require('../middleware/auth');
const { voterValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/login', voterLogin);
router.post('/register', protect, voterValidation, handleValidationErrors, registerVoter);
router.get('/', protect, getAllVoters);
router.post('/vote', castVote);

module.exports = router;