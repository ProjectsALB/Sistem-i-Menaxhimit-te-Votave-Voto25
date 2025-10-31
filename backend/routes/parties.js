const express = require('express');
const { registerParty, getAllParties } = require('../controllers/partyController');
const { protect } = require('../middleware/auth');
const { partyValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/register', protect, partyValidation, handleValidationErrors, registerParty);
router.get('/', getAllParties);

module.exports = router;