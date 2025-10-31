const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true
  },
  city: {
    type: String,
    required: true,
    enum: ['Tirana', 'Durrës', 'Vlorë', 'Shkodër', 'Elbasan', 'Korçë', 'Fier', 'Berat', 'Lushnjë', 'Kavajë']
  },
  age: {
    type: Number,
    required: true,
    min: 25
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  qualifications: {
    type: String,
    required: true
  },
  manifesto: {
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

module.exports = mongoose.model('Candidate', candidateSchema);