const Candidate = require('../models/Candidate');
const Party = require('../models/Party');

// Regjistrimi i kandidatit
const registerCandidate = async (req, res) => {
  try {
    const {
      name,
      party,
      city,
      age,
      dateOfBirth,
      qualifications,
      manifesto
    } = req.body;

    // Kontrollo nëse partia ekziston
    const existingParty = await Party.findById(party);
    if (!existingParty) {
      return res.status(400).json({
        status: 'error',
        message: 'Partia e zgjedhur nuk ekziston'
      });
    }

    // Kontrollo nëse kandidati ekziston për këtë parti në këtë qytet
    const existingCandidate = await Candidate.findOne({
      name,
      party,
      city
    });

    if (existingCandidate) {
      return res.status(400).json({
        status: 'error',
        message: 'Kandidati për këtë parti në këtë qytet tashmë ekziston'
      });
    }

    const candidate = await Candidate.create({
      name,
      party,
      city,
      age,
      dateOfBirth,
      qualifications,
      manifesto
    });

    const populatedCandidate = await Candidate.findById(candidate._id).populate('party');

    res.status(201).json({
      status: 'success',
      message: 'Kandidati u regjistrua me sukses',
      data: populatedCandidate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Gabim në server'
    });
  }
};

// Merr të gjithë kandidatët
const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().populate('party').sort({ createdAt: -1 });
    res.json({
      status: 'success',
      data: candidates
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Gabim në server'
    });
  }
};

// Merr kandidatët sipas qytetit
const getCandidatesByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const candidates = await Candidate.find({ city }).populate('party').sort({ name: 1 });
    
    res.json({
      status: 'success',
      data: candidates
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
  registerCandidate,
  getAllCandidates,
  getCandidatesByCity
};