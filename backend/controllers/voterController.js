const Voter = require('../models/Voter');
const Candidate = require('../models/Candidate');
const Party = require('../models/Party');
const ElectionResult = require('../models/ElectionResult');

// Login i votuesit
const voterLogin = async (req, res) => {
  const { voterId } = req.body;

  try {
    const voter = await Voter.findOne({ voterId }).populate('votedFor.candidateId votedFor.partyId');

    if (!voter) {
      return res.status(404).json({
        status: 'error',
        message: 'ID e votuesit nuk është e regjistruar'
      });
    }

    res.json({
      status: 'success',
      message: 'Login i suksesshëm',
      voter: {
        id: voter._id,
        firstName: voter.firstName,
        lastName: voter.lastName,
        voterId: voter.voterId,
        city: voter.city,
        hasVoted: voter.hasVoted,
        votedFor: voter.votedFor
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

// Regjistrimi i votuesit nga admini
const registerVoter = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      dateOfBirth,
      email,
      voterId,
      city,
      address
    } = req.body;

    // Kontrollo nëse votuesi ekziston
    const existingVoter = await Voter.findOne({
      $or: [{ email }, { voterId }]
    });

    if (existingVoter) {
      return res.status(400).json({
        status: 'error',
        message: 'Votuesi me këtë email ose ID tashmë ekziston'
      });
    }

    const voter = await Voter.create({
      firstName,
      lastName,
      age,
      dateOfBirth,
      email,
      voterId,
      city,
      address
    });

    res.status(201).json({
      status: 'success',
      message: 'Votuesi u regjistrua me sukses',
      data: voter
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Gabim në server'
    });
  }
};

// Merr të gjithë votuesit
const getAllVoters = async (req, res) => {
  try {
    const voters = await Voter.find().sort({ createdAt: -1 });
    res.json({
      status: 'success',
      data: voters
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Gabim në server'
    });
  }
};

// Votimi
const castVote = async (req, res) => {
  const { voterId, candidateId } = req.body;

  try {
    const voter = await Voter.findOne({ voterId });
    const candidate = await Candidate.findById(candidateId).populate('party');

    if (!voter) {
      return res.status(404).json({
        status: 'error',
        message: 'Votuesi nuk u gjet'
      });
    }

    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Kandidati nuk u gjet'
      });
    }

    if (voter.hasVoted) {
      return res.status(400).json({
        status: 'error',
        message: 'Ky votues ka votuar tashmë'
      });
    }

    if (voter.city !== candidate.city) {
      return res.status(400).json({
        status: 'error',
        message: 'Votuesi mund të votojë vetëm për kandidatët e qytetit të tij'
      });
    }

    // Përditëso votuesin
    voter.hasVoted = true;
    voter.votedFor = {
      candidateId: candidate._id,
      partyId: candidate.party._id
    };
    await voter.save();

    // Përditëso numrin e votave të kandidatit
    candidate.voteCount += 1;
    await candidate.save();

    // Përditëso numrin e votave të partisë
    await Party.findByIdAndUpdate(candidate.party._id, {
      $inc: { voteCount: 1 }
    });

    // Përditëso rezultatet e zgjedhjeve për qytetin
    await updateElectionResults(candidate.city, candidate._id, candidate.party._id);

    res.json({
      status: 'success',
      message: 'Vota u regjistrua me sukses'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Gabim në server'
    });
  }
};

// Funksion ndihmës për përditësimin e rezultateve
const updateElectionResults = async (city, candidateId, partyId) => {
  let electionResult = await ElectionResult.findOne({ city });

  if (!electionResult) {
    electionResult = await ElectionResult.create({
      city,
      candidates: [],
      parties: [],
      totalVotes: 0
    });
  }

  // Përditëso kandidatët
  const candidateIndex = electionResult.candidates.findIndex(
    c => c.candidate.toString() === candidateId.toString()
  );

  if (candidateIndex > -1) {
    electionResult.candidates[candidateIndex].votes += 1;
  } else {
    electionResult.candidates.push({
      candidate: candidateId,
      votes: 1
    });
  }

  // Përditëso partitë
  const partyIndex = electionResult.parties.findIndex(
    p => p.party.toString() === partyId.toString()
  );

  if (partyIndex > -1) {
    electionResult.parties[partyIndex].votes += 1;
  } else {
    electionResult.parties.push({
      party: partyId,
      votes: 1
    });
  }

  electionResult.totalVotes += 1;

  // Përcakto fituesit
  if (electionResult.candidates.length > 0) {
    const winningCandidate = electionResult.candidates.reduce((prev, current) => 
      prev.votes > current.votes ? prev : current
    );
    electionResult.winningCandidate = winningCandidate.candidate;
  }

  if (electionResult.parties.length > 0) {
    const winningParty = electionResult.parties.reduce((prev, current) => 
      prev.votes > current.votes ? prev : current
    );
    electionResult.winningParty = winningParty.party;
  }

  await electionResult.save();
};

module.exports = {
  voterLogin,
  registerVoter,
  getAllVoters,
  castVote
};