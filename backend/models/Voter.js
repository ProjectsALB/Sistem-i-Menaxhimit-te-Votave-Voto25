const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    voterId: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    hasVoted: {
        type: Boolean,
        default: false
    },
    votedCandidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        default: null
    },
    votedPartyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
        default: null
    },
    voteDate: {
        type: Date,
        default: null
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Voter', voterSchema);