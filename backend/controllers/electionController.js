const ElectionResult = require('../models/ElectionResult');
const Candidate = require('../models/Candidate');
const Party = require('../models/Party');

// Merr rezultatet e zgjedhjeve për të gjithë qytetet
const getElectionResults = async (req, res) => {
  try {
    const results = await ElectionResult.find()
      .populate('candidates.candidate')
      .populate('parties.party')
      .populate('winningCandidate')
      .populate('winningParty')
      .sort({ city: 1 });

    res.json({
      status: 'success',
      data: results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Gabim në server'
    });
  }
};

// Merr rezultatet totale të zgjedhjeve
const getOverallResults = async (req, res) => {
  try {
    // Merr të gjithë kandidatët me numrin e votave
    const candidates = await Candidate.find().populate('party').sort({ voteCount: -1 });
    
    // Merr të gjitha partitë me numrin e votave
    const parties = await Party.find().sort({ voteCount: -1 });

    // Llogarit totalin e votave
    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);

    res.json({
      status: 'success',
      data: {
        totalVotes,
        candidates,
        parties
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Gabim në server'
    });
  }
};

// Merr rezultatet për një qytet specifik
const getCityResults = async (req, res) => {
  try {
    const { city } = req.params;
    
    const result = await ElectionResult.findOne({ city })
      .populate('candidates.candidate')
      .populate('parties.party')
      .populate('winningCandidate')
      .populate('winningParty');

    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Nuk u gjetën rezultate për këtë qytet'
      });
    }

    res.json({
      status: 'success',
      data: result
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
  getElectionResults,
  getOverallResults,
  getCityResults
};