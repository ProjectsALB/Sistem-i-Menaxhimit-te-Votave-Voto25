const express = require('express');
const { 
  getElectionResults, 
  getOverallResults, 
  getCityResults 
} = require('../controllers/electionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/results', protect, getElectionResults);
router.get('/overall', protect, getOverallResults);
router.get('/city/:city', protect, getCityResults);

module.exports = router;