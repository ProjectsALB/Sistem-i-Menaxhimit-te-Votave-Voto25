
const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  symbol: {
    type: String,
    required: true
  },
  leader: {
    type: String,
    required: true
  },
  foundingYear: {
    type: Number,
    required: true
  },
  ideology: {
    type: String,
    required: true
  },
  voteCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Party', partySchema);