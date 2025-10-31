const express = require('express');
const { 
  registerCandidate, 
  getAllCandidates, 
  getCandidatesByCity 
} = require('../controllers/candidateController');
const { protect } = require('../middleware/auth');
const { candidateValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/register', protect, candidateValidation, handleValidationErrors, registerCandidate);
router.get('/', getAllCandidates);
router.get('/city/:city', getCandidatesByCity);

module.exports = router;