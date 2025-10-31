const mongoose = require('mongoose');

const electionResultSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    enum: ['Tirana', 'Durrës', 'Vlorë', 'Shkodër', 'Elbasan', 'Korçë', 'Fier', 'Berat', 'Lushnjë', 'Kavajë']
  },
  candidates: [{
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate'
    },
    votes: {
      type: Number,
      default: 0
    }
  }],
  parties: [{
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party'
    },
    votes: {
      type: Number,
      default: 0
    }
  }],
  totalVotes: {
    type: Number,
    default: 0
  },
  winningCandidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  },
  winningParty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ElectionResult', electionResultSchema);